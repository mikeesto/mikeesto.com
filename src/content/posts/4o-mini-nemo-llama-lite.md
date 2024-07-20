---
title: GPT-4o mini, Mistral NeMo and Llama 3 Lite
description: A summary of the latest small models released this week including GPT-4o mini, Mistral NeMo and Llama 3 Lite.
date: 20-07-2024
draft: false
---

It's been a big week for small models!

### GPT-4o mini

- $0.15/m input tokens and $0.60/m output tokens
- Supports 128,000 input tokens and 16,000 output tokens
- Appears to benchmark higher than Haiku and Gemini 1.5 Flash (both are more expensive)
- Image inputs remain the same price as GPT-4o so Haiku or Gemini 1.5 Flash seem more attractive for this use case
- Has become the new default model for free users of ChatGPT. You continue to get a limited number of calls to GPT-4o, and then once exhausted it falls back to GPT-4o mini. GPT 3.5 turbo is no longer available for free users.

### Mistral NeMo

- A 12B parameter model with 128k context length
- Released under Apache 2.0
- Appears to benchmark slightly ahead of Llama 8B
- Uses a new tokenzier
- Support in llama.cpp (and by extension Ollama) is [being actively worked on](https://github.com/ggerganov/llama.cpp/pull/8579)

### Llama 3 Lite

- [Together AI](https://www.together.ai/blog/together-inference-engine-2) are using INT4 quantization, as well as a number of other optimizations, to offer Llama 3 8B at $0.1/m tokens (both input & output)
- I think this is the cheapest 8B model endpoint I have seen
