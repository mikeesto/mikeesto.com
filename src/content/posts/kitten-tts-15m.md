---
title: Kitten TTS 15M
description: A tiny 15M parameter text-to-speech model that runs anywhere.
date: 06-08-2025
draft: false
---

Good things often come in small packages. [Kitten TTS](https://github.com/KittenML/KittenTTS), which was released this week, is a perfect case in point. This open-source (weights only) text-to-speech model packs realistic voice synthesis into just 15 million parameters. The entire model weighs in at under 25MB, which is roughly the size of 5-6 photos from a modern iPhone camera. That's genuinely impressive for something that can turn text into natural sounding speech.

The model is currently in developer preview, trained on less than 10% of the team's intended training data. Even at this early stage, the results are surprisingly good for such a compact model.

### Running it locally

Python packaging can be a bit of a pain, so I wrote a quick script that uses `uv` to handle the dependencies cleanly:

```python
# /// script
# dependencies = [
#     "soundfile",
#     "kittentts @ https://github.com/KittenML/KittenTTS/releases/download/0.1/kittentts-0.1.0-py3-none-any.whl",
# ]
# ///

import sys
import soundfile as sf
from kittentts import KittenTTS

def main():
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    else:
        text = "This high quality TTS model works without a GPU"

    print(f"Generating audio for: '{text}'")
    m = KittenTTS("KittenML/kitten-tts-nano-0.1")
    audio = m.generate(text, voice='expr-voice-2-f')
    sf.write('output.wav', audio, 24000)
    print("Audio saved to output.wav")

if __name__ == "__main__":
    main()
```

Save this as `tts-script.py` and run it with:

```bash
uv run tts-script.py "Sometimes it is the people who no one imagines anything of who do the things that no one can imagine."
```

If you prefer not to install anything locally, there's already a [web demo](https://clowerweb.github.io/kitten-tts-web-demo/) that runs entirely in your browser using ONNX Runtime and Transformers.js.

The model offers eight voices total: four male, four female. English only for now. Is it the most natural sounding TTS I've ever heard? No. But... for a model this tiny, the expressivity is genuinely quite good. You can hear clear intonation in the generated speech and it doesn't sound overly robotic, which is surprising given its size.

Just a few months ago I wrote about [Kokoro-82M](https://mikeesto.com/posts/kokoro-82m-pi/) which seemed like a perfect fit for running on a Raspbery Pi. Kitten TTS is nearly four times smaller! The fact that this is still an early checkpoint makes it even more intriguing. If they can achieve this quality with only 10% of their training data, the final model should indeed be something worth keeping an eye on.
