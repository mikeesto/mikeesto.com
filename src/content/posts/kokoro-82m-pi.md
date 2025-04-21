---
title: Kokoro-82M high quality TTS on a Raspberry Pi
description: Kokoro-82M is a small and efficient text to speech (TTS) model that delivers natural sounding speech on a Raspberry Pi.
date: 10-03-2025
draft: false
---

[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) is a small text-to-speech model capable of running on resource constrained devices like the Raspberry Pi. The quantized model weighs in at only ~80MB. Prior to Kokoro's release I usually used [eSpeak](https://espeak.sourceforge.net/) or [Piper](https://github.com/rhasspy/piper) for TTS. I prefer Kokoro's more natural sounding human voice. However, on my Raspberry Pi 4 (2GB) the inference speed is less than real time so these older TTS options still have their place.

If you're curious to try Kokoro without having to install anything, I made a [web version here](https://kokoro-web.netlify.app/) that runs completely in your web browser (Chrome only).

For Python on the Pi, the [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx) package simplifies the process of using Kokoro.

First, install the necessary Python packages:

`pip install kokoro-onnx soundfile`

`soundfile` is used for saving the generated audio to a file.

Next, download the pre-trained Kokoro model and voice files:

```bash
wget https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx

wget https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

These files contain the required model and voice data. Place them in the same directory as your Python script.

Now, create a Python file (e.g. tts.py) with the following:

```python
import soundfile as sf
from kokoro_onnx import Kokoro

kokoro = Kokoro("kokoro-v1.0.int8.onnx", "voices-v1.0.bin")

samples, sample_rate = kokoro.create(
    "It was the best of times, it was the worst of times", voice="af_heart", speed=1.0, lang="en-us"
)

sf.write("audio.wav", samples, sample_rate)
print("Created audio.wav")
```

To play the generated audio using aplay (often pre-installed on Raspberry Pi OS):

```bash
aplay audio.wav
```

For direct audio playback without saving to a file, install `sounddevice`:

```bash
pip install sounddevice
```

Then modify your Python script to this:

```python
import sounddevice as sd
from kokoro_onnx import Kokoro

kokoro = Kokoro("kokoro-v1.0.int8.onnx", "voices-v1.0.bin")

samples, sample_rate = kokoro.create(
    "It was the best of times, it was the worst of times", voice="af_heart", speed=1.0, lang="en-us"
)

sd.play(samples, sample_rate)
sd.wait()
```
