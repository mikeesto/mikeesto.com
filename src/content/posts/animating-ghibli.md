---
title: Generating animations with GPT-4o image grids
description: "TODO: something here"
date: 17-06-2025
draft: true
---

When OpenAI rolled out [GPT-4o's image generation](https://openai.com/index/introducing-4o-image-generation/) in the final week of March 2025, the internet promptly lost its collective mind. Overnight, feeds were flooded with Studio Ghibli-esque images, all rendered in that distinct, whimsical aesthetic, as users eagerly portrayed themselves, friends, family, and pets. The sheer scale was phenomenal. ChatGPT clocked a reported million new users in a single hour, a velocity that dwarfed its own initial launch, which had taken five days to reach the same milestone.

Getting that distinctive, whimsical Ghibli look is almost trivial. You can prompt for:

```
A cat playing with a ball of purple yarn. The art style is soft and hand-drawn, with subtle shading and gentle pastel colors, reminiscent of Studio Ghibli or slice-of-life anime.
```

And thirty or so seconds later receive a generation just like this:

[IMAGE OF CAT]

Of course, it's not just Ghibli. The model is capable of imitating many other artistic styles too. As someone who spent their childhood years watching [Wallace & Gromit](https://en.wikipedia.org/wiki/Wallace_%26_Gromit) and [Pingu](https://en.wikipedia.org/wiki/Pingu) I have an affection for claymation as well:

```
TODO: Claymation prompt here
```

[CLAYMATION IMAGE]

Despite wrestling with the legal and ethical ramifications, and the flood of Ghibli-fied everything across the web, I can't deny the undeniable warmth of seeing family and friends rendered in these styles. The whimsical, slightly painterly realism is incredibly heartwarming.

### Bringing Ghibli to life

However, I didn't sit down to start this small project on a particularly wintery Monday evening just to generate static images in ways that mainstream media had covered extensively when 4o image generation first came out. What piqued my interest was the idea of bringing these generated images to life. I wanted to animate them.

The concept of animation is fairly straightforward: it's a sequence of frames displayed in quick succession. In theory then, generating an animation shouldn't be particularly hard. You can:

- Prompt for frame 1
- Prompt for frame 2, trying to describe it as a continuation of frame 1
- Repeat N times

However, this naive approach presents two issues.

The first is time. Each image generation request takes around 30-45 seconds to process. Crucially, since each frame conceptually depends on the previous one for narrative consistency, you can't easily parallelise this. Generating a mere 10 frames for a very short animation loop would mean waiting sequentially: 10 frames \* ~37.5s/frame = 375 seconds, or over 6 minutes. Not terrible for a one-off, but painful for iteration.

The second is cost. At the time of writing, generating a single image of 1024 x 1024 pixels at medium quality costs roughly $0.04 USD. So, that 10-frame animation would set you back 10 frames \* $0.04/frame = $0.40. Again, fine for a single experiment, but if you want to generate dozens of animations or longer sequences, this adds up very quickly. As much as I enjoy creating fun animations, I wanted an approach that was cost effective too.

## Grids

It turns out that GPT 4o's image generation has another trick - it's particularly good at following instructions and grids. Indeed, this is one of the main examples shown on their [introductory blog post](https://openai.com/index/introducing-4o-image-generation/).

Importance of explicitly specifying rows and columns. When I asked for a `4x3 grid` it often didn't generate a grid of that dimension.

This presents an interesting opportunity. To animate something requires a series of images. Of course it is possible to make multiple requests to the 4o API, seeking to generate a number of frames. However, what if instead we prompted for a grid of images that represents an animation sequence?

I was hoping that by doing this in one generation the consistency between the frames would be maintained. From my limited testing it seems that often the main focal point of the image does but the background can vary wildly. For example, if you look at frames X and Y - you can see that Z has changed.

I wrote a small python script that takes the grid, cuts it into frames and then stitches them together as a mp4/gif file with a short interval between each frame.

```python
script here
```

Here's the result:

If you're interested in playing around with this, I made a small tool. I've loaded up a small amount of credits on it (turns out: image generation is an easy way to burn through money!) so enjoy it while it lasts. If it doesn't work, I've also opened sourced the app here.

## Cost

Cost is roughly $0.07 USD per medium-quality, 1024 × 1536 image. Can also generate for free via ChatGPT interface (2 generations per day?) and then run script locally.

Compare to generating 9 images individually (I think 1024 x 1024 is roughly $0.04) and then \* 9

=== gif of starry night ===
