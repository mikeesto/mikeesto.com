---
title: Speech-to-text with Parakeet 0.6b v2
description: Nvidia's new Parakeet ASR model is impressively fast. I got it running on my M3 MacBook Pro using parakeet-mlx where an hour of audio only took just over a minute to transcribe.
date: 12-05-2025
draft: false
---

Nvidia announced their Parakeet-TDT-0.6b-v2 model last week and I was immediately intrigued.

It's a relatively small 600 million parameter model which boasts some impressive stats: a 6.05% Word Error Rate (WER) and a ludicrous Real-Time-Factor (RTF) of 3386. This means the model can transcribe 60 minutes of audio in just one second on an A100 - an approximately $10,000 USD GPU. That's fast. So fast, in fact, that it has taken first place on [Hugging Face's Open ASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard).

The model is released under a Creative Commons Attribution 4.0 license, making it suitable for both commercial and non-commercial use. Perhaps a key limitation for wider adoption, though, is that it's currently English-only.

### Running on Apple Silicon with MLX

Parakeet was unsurprisingly optimised for Nvidia's GPU architectures. However, I do most of my daily work at the moment on a M3 MacBook Pro with 36GB of unified memory. So I was delighted to discover that GitHub user [Senstella](https://github.com/senstella) had ported the model to Apple's MLX framework in their [parakeet-mlx repository](https://github.com/senstella/parakeet-mlx).

My understanding is that this 0.6B parameter model requires a minimum of 2GB of unified memory, which is impressively small and makes it accessible on even lower-spec macs. There are users who have [posted on the repository](https://github.com/senstella/parakeet-mlx/issues/4) showing successful runs on 8GB MacBook Airs.

### Installation

I installed `parakeet-mlx` using `pipx`, my preferred tool for installing Python CLI applications in isolated environments. One day I'll find the time to move to `uv`.

```bash
pipx install parakeet-mlx
```

`pipx` handles creating an isolated environment, installing the package and its dependencies, and adding the CLI tool to my PATH.

Of course, things are never that simple. I immediately ran into this error when trying to use the CLI:
`ModuleNotFoundError: No module named '_lzma'`.

This is a classic Python-on-macOS-via-pyenv issue. It usually means the development libraries for LZMA weren't present when Python itself was compiled. Since I use pyenv to manage my Python versions, the fix involved:

1. Installing the `xz` package (which provides LZMA libraries) via Homebrew.
2. Reinstalling my Python version so it could pick up the newly available libraries.

```bash
brew install xz
pyenv uninstall 3.12.2
pyenv install 3.13.3
pyenv global 3.13.3
```

I took the opportunity to bump to Python 3.13.3 while I was at it.

### Transcribing

The `parakeet-mlx` CLI makes it straightforward to transcribe a file:

```bash
parakeet-mlx <audio_file>
```

By default, it outputs a `srt` subtitle file, but you can specify `txt` or `json` using the `--output-format` flag.

To put it through its paces, I fed it a MP4 video file that was 1 hour and 8 minutes long. Even with a mess of other applications open (including a small Linux VM chugging away), the transcription completed in just 1 minute and 2 seconds. This is dramatically faster than running something like whisper large locally on my M3 for the same file.

One of the touted capabilities of this model is song-to-lyrics transcription. I was curious about this, as I'd been experimenting with generating AI music videos last year. I ran a copy of one of those videos through parakeet-mlx.

The transcription was... okay. Not terrible, but not amazing either. Google's Gemini models actually produced a more accurate transcription. To be fair, this is a sample size of one, and music transcription is notoriously difficult.

Two notable features are currently missing (for now):

1. Diarization: The ability to distinguish between different speakers. This is a common request for ASR models used for meetings or interviews. The only option right now is to do some kind of post processing.

2. Built-in Streaming: While the parakeet-mlx port doesn't have a direct audio streaming feature yet, it is listed as a to-do item on the GitHub repository.

### A quick streaming test

The model's speed is its golden feature. It clearly processes audio much faster than it arrives in real-time, which is the fundamental prerequisite for streaming transcription.

Implementing robust, low-latency streaming with accurate voice activity detection (VAD) and intelligent merging of text segments is non-trivial. But, I did put together this quick Python script using the `sounddevice` library to capture audio from my microphone in 5-second chunks and feed it to the parakeet-mlx library:

```python
import sounddevice as sd
import numpy as np
import mlx.core as mx
from parakeet_mlx import from_pretrained
from parakeet_mlx.audio import (
    get_logmel,
)


MODEL_ID = "mlx-community/parakeet-tdt-0.6b-v2"
MODEL_DTYPE = mx.bfloat16
CHUNK_SECONDS = 5

print(f"Loading model: {MODEL_ID}...")
model = from_pretrained(MODEL_ID, dtype=MODEL_DTYPE)
TARGET_SAMPLE_RATE = model.preprocessor_config.sample_rate
print("Model loaded.")


def audio_callback(indata, frames, time, status):
    if status:
        print(status)

    audio_np = indata[:, 0]
    audio_mx = mx.array(audio_np, dtype=MODEL_DTYPE)

    try:
        mel_chunk = get_logmel(audio_mx, model.preprocessor_config)
        mx.eval(mel_chunk)

        results_list = model.generate(mel_chunk)
        mx.eval(results_list)

        if results_list:
            result = results_list[0]
            if result.text.strip():
                print(
                    f"[{len(audio_np)/TARGET_SAMPLE_RATE:.2f}s chunk] Transcribed: {result.text.strip()}"
                )
    except Exception as e:
        print(f"Error processing chunk: {e}")


try:
    with sd.InputStream(
        samplerate=TARGET_SAMPLE_RATE,
        channels=1,
        dtype="float32",
        blocksize=int(TARGET_SAMPLE_RATE * CHUNK_SECONDS),
        callback=audio_callback,
    ):
        print(
            f"Streaming from microphone ({TARGET_SAMPLE_RATE} Hz, {CHUNK_SECONDS}s chunks)... Press Ctrl+C to stop."
        )
        while True:
            sd.sleep(1000)
except KeyboardInterrupt:
    print("\nStreaming stopped.")
except Exception as e:
    print(f"An error occurred: {e}")
```

Running this script gave me output like:

```bash
(venv) ➜  parakeet-test python script.py
Loading model: mlx-community/parakeet-tdt-0.6b-v2...
Model loaded.
Streaming from microphone (16000 Hz, 5s chunks)... Press Ctrl+C to stop.
[5.00s chunk] Transcribed: Hello?
[5.00s chunk] Transcribed: Testing one, two, three.
[5.00s chunk] Transcribed: Hello?
```

It works! It's obviously very basic:

- Each chunk is transcribed in complete isolation;
- There's no voice activity detection, so it processes silent chunks too; and
- There's no overlap or merging strategy for words that might span across chunk boundaries, which is a common technique for more accurate streaming.

Still, for a very quick and naive hack, it's exciting to see it responding in near real-time.

### What does this unlock?

Fast, local speech-to-text isn't a completely new capability. I've been using various Whisper implementations (like `whisper.cpp`) for a while now. What Parakeet-TDT-0.6b-v2, especially via this MLX port, brings to the table is a significant leap in speed for high-accuracy transcription on Apple Silicon.

This dramatic speed-up starts to shift ASR on my Mac from something that I might occasionally do when necessary and take a walk to stretch my legs while it processes, towards an instant utility layer that I can see myself engaging with more frequently.
