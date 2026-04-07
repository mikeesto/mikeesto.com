---
title: Whimscribe
description: Notes on Gemma 4, Cohere Transcribe, and a new local audio transcription app.
date: 07-04-2026
draft: false
---

I spent most of Easter doing the important things — eating chocolate, seeing family and friends, and defying my bedtime. The long (long) weekend also gave me a chance to properly try a few things I'd only managed to previously scribble down.

### Gemma 4

Google released [Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) last week, four open weight models under an Apache 2.0 license. The lineup is: E2B and E4B (designed for edge devices and phones), a 26B Mixture-of-Experts model (activating only 3.8B parameters at inference for speed), and a 31B dense model. The bigger two are available through Google AI Studio with a generous free quota each of 1,500 requests per day.

I was mostly interested in E2B and E4B for audio/speech use cases. [mlx-vlm](https://github.com/Blaizzy/mlx-vlm) shipped day-zero Gemma 4 support for Apple silicon. When I tried it, though, it was hallucinating quite a bit on audio. There were clearly some early bugs in the encoder implementation, with some PRs already open. I ended up falling back to transformers, which worked reasonably well. I've always had a soft spot for small multimodal models. Note that you won't get timestamps or speaker diarization though, if those matter to you.

### Cohere Transcribe

[Cohere Transcribe](https://cohere.com/blog/transcribe) is a new 2B parameter open source ASR model that currently sits at #1 on the HuggingFace Open ASR Leaderboard with a word error rate of 5.42%, edging out Whisper Large v3, ElevenLabs Scribe v2, and NVIDIA's Parakeet. It supports 14 languages and runs nicely with transformers.js in-browser with WebGPU.

If you need raw speed for a dictation style use cases (the kind of thing [Handy](https://handy.computer/) and others are built around), Parakeet is still smaller and faster. But if accuracy is what you're optimising for, Cohere's model seems meaningfully better. Again, you won't get timestamps or speaker diarization.

### Whimscribe

I've been working on something new too. Cohere Transcribe made me realise that ASR models are now good enough to do high quality transcription entirely in the browser. No server, no audio leaving your device.

So I've been hacking the past few days on [Whimscribe](https://whimscribe.netlify.app/), an audio transcription app that runs completely locally. It's similar in spirit to a project I started two years ago, [Gemini Transcribe](https://gemini-transcribe.fly.dev/), but privacy first by design. There are plenty of situations where you'd rather not send audio recordings to a third party, and Whimscribe is my attempt at solving that.
