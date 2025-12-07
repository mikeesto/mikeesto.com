---
title: Why Anthropic bought the programmers, not just the code
description: Code generation is becoming a commodity, but human judgment remains more valuable than ever.
date: 07-12-2025
draft: false
---

<i>"So, what's your plan?" they asked, raising an eyebrow.
"My plan?" I replied, unsure whether they were referring to the upcoming holidays, the rising cost of living, or what I was going to order for dessert.
They looked at me, somewhat nervously.
"Yes, your plan. When AI writes all the code, what will you do for work?"
</i>

As someone who writes code for a living and has had the pleasure of teaching many others how to program, the displacement of software engineers has been occupying the back of my mind for the past few years. It's confronting to prompt an LLM and receive hundreds of lines of code in seconds, code that would have taken me far longer to write. What hope do I have to compete with a machine?

As time has passed, I've come to realise that while software engineering has already substantially changed and will likely continue to do so, the displacement of engineers remains far off. I would be foolish to suggest I know exactly how things will play out in the years to come, but I am quietly confident that while the role is evolving, it's not disappearing. And that isn't wishful thinking on my part. We can see clear evidence of this in the actions of companies building frontier models, despite what they may otherwise spruik in press releases.

### What's changed?

The core shift is almost undeniable at this stage. Just a few years ago programmers weren’t using LLMs and agents, thinking about hallucinations, or managing context windows. The tools have changed, and the work has changed with them. This doesn't make the programmer obsolete; it changes their job. Their primary role shifts from being the generator of code to the verifier, refiner, and integrator.

Knowing how to write clear prompts, spot hallucinations, understand when something is worth rewriting by hand, and have an intuition for which model to use for a given task is the new baseline. A gap is widening between those who are AI literate and those who are not. As routine code generation becomes a commodity, everything above that layer becomes the true differentiator.

### Beyond writing code

Software engineering has never just been about writing lines of code; it’s about talking to users to understand what they actually need, debating architectural trade-offs, deciding what work is worth prioritising, and recognising that the problem a user describes isn’t always the problem they have.

This is the work of judgment, of taste, of communication. AI can help you brainstorm whether to build a feature, but it doesn’t own the business context, the relationship with stakeholders, or the accountability for being wrong. Real empathy for your users still has to come from humans.

The skills that matter are shifting from syntax and algorithms to systems design, product (and common!) sense, and the ability to effectively steer AI toward the right solution.

### The Hiring Paradox

Every few weeks, an executive at a big tech company announces that AI is writing an increasing share of their company’s code. Some even go so far as to suggest that learning to code is becoming a fruitless exercise. If you took that story at face value, you’d expect the companies building frontier models to simply stop hiring engineers.

As it turns out, that’s not what’s happening! OpenAI, Google, Anthropic, and Meta are all still hiring software engineers.

Why would they be hiring if their own technology was making these roles obsolete?

A clear example of this tension appeared last week when [Anthropic acquired Bun](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone), the JavaScript runtime they use for Claude Code, their AI coding product.

Bun is MIT licensed. The code is completely open source, freely [available on GitHub](https://github.com/oven-sh/bun). In principle, Anthropic could have simply forked the project and used Claude to continue developing it for their needs.

But they didn't. They bought the team. They're keeping the permissive MIT license, and they're [committed to hiring](https://bun.com/blog/bun-joins-anthropic#bun-joins-anthropic) _more_ software engineers to work on it.

So what did Anthropic actually buy? Not just a codebase they already had access to, but everything that doesn’t live in the repo: the judgment of engineers who know which performance optimisations are worth the added complexity; the taste that produced an API design developers actually enjoy using; the institutional memory of which ideas were tried and abandoned; the ability to make the next hundred decisions correctly.

Even if Anthropic could technically fork and maintain Bun in-house with heavy AI assistance, doing so without the original team would carry a real risk. Despite unlimited access to the most powerful AI tools in existence, human engineering judgment is still what these companies are competing for. They aren’t betting on AI to replace engineers; they’re betting on AI to massively amplify engineers with judgment, taste, and vision.

### The Talent Pipeline Question

Here's where things get murky for me, but the question matters too much to ignore.

There's growing anecdotal evidence that companies are hiring fewer junior developers. If a senior engineer amplified by AI can produce the work of what was once a small team, why hire juniors who need years of mentorship? It's not clear to me how widespread this trend is, or whether it's driven primarily by AI or other economic factors. But the question is worth asking: if it's true, what is the consequence?

Where do senior engineers come from? They start as juniors, learning by making mistakes on real projects, getting code reviews from experienced developers, and gradually building the pattern recognition that lets them see problems before they happen. They learn by watching how seniors navigate ambiguity, make trade-offs, and communicate with stakeholders. Online courses can teach syntax and bootcamps can teach frameworks, but they struggle to teach the judgment that comes from shipping code to real users, from debugging a production incident, or from seeing a feature you built get used in ways you never anticipated.

If traditional entry-level pathways narrow significantly, perhaps alternative routes emerge: open source contributions, building in public, AI assisted self‑learning. But these paths still require feedback loops, real stakes, and the ability to learn from others. The gap between junior and senior productivity might be widening in a way that makes traditional mentorship economics harder to justify, and it's unclear whether alternative pathways can bridge that gap at scale.

I don't know how this will play out. But I do think it's a question we should be asking more loudly. Anthropic didn’t just buy code, they bought the kind of human judgment we may one day discover we’ve let wither.
