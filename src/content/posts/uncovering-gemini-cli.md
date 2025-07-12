---
title: Uncovering Gemini CLI
description: TODO:...
date: 13-07-2025
draft: true
---

The terminal-based AI coding agent wars have well and truly begun. Claude Code (Anthropic), Codex CLI (OpenAI), Amp (SourceGraph) and most recently Gemini CLI (Google) all operate directly in your shell and are capable of reading files, writing new code, and executing commands to build and test their own work. These tools represent a shift from chat-based/code-completion programming assistance that was popularised through GitHub Copilot to now agents that can directly manipulate codebases and development environments.

The pricing models suggest these companies see significant value in the space. Claude Code's max tier costs $200 USD per month, a price point that some speculate is actually a loss-leader (insert my surprised Pikachu face here), while Amp unashamedly markets itself as having <i>"unconstrained token usage (and therefore cost)"</i>. In enterprise these costs are perhaps palatable (use different word) but For personal, explorative development, it does sadden me a little that there seems to be this growing divide between those that can make the most of these tools and those that cannot [reword this whole sentence].

The excitement for these agents is palpable, with many developers anecdotally reporting significant productivity boosts that make these high monthly costs seem justifiable. An interesting new paper from METR, however, raises questions about whether these productivity claims hold up. Their study, [Measuring the Impact of Early-2025 AI on
Experienced Open-Source Developer Productivity](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study.pdf), suggests that for experienced developers working on tasks within mature open source projects, current AI performance doesn't yet match the hype. In fact, they found that AI tooling slowed their study participants down by 19%. I'm fascinated (perhaps a different word?) to see if similar studies corroborate these claims (is 'these claims' the right phrase?). Nonetheless, I've observed that interest and discussion around agentic coding tools continues to grow rapidly.

### Gemini CLI

Google's Gemini CLI is the latest entrant in this space. Along with Codex CLI it is also open source, the files are laid bare on GitHub. Claude Code and Amp meanwhile are not.

I must have been busy when Codex CLI came out because it really didn't catch my attention but the launch of Gemini CLI did. Perhaps part of the reason for that was its generous free tier offering. Gemini CLI is still very early in its product lifecyle and I haven't extensively used it so I don't feel well positioned to comment. I think what is fair to say is that the general discourse is that it's a bit raw. Particularly when compared to Claude Code. I think some of the reasons why it might not currently stack up compared are: while Gemini 2.5 pro is undoubtedly a strong model, it doesn't seem to have been trained on tool calling to the extent that Claude Sonnet 4 has, and Gemini CLI uses a mix of Pro and Flash depending on the task (this seems to be a deliberate trade off for efficiency - link to GitHub issue) and while Flash is a great model it's clearly not as capable as these top tier models.

With the release of Gemini CLI I took the opportunity to explore the codebase. It's a node/react app? I was particularly interested in two things: how the tool determines which files to use as context for the LLM, and how the CLI makes edits to files. It turns out that both of these rely on tool calling, and Thorsten's Ball's viral article on XYZ is great background reading here.

### Context discussion

### Editing discussion
