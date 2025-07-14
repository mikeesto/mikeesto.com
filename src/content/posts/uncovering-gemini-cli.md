---
title: Uncovering Gemini CLI
description: TODO:...
date: 15-07-2025
draft: false
---

The terminal-based AI coding agent wars have well and truly begun. Claude Code (Anthropic), Codex CLI (OpenAI), Amp (SourceGraph) and most recently Gemini CLI (Google) all operate directly in your shell and are capable of reading files, writing new code, and executing commands to build and test their own work. These tools represent a shift from chat-based/code-completion programming assistance that was popularised through GitHub Copilot to now agents that can directly manipulate codebases and development environments.

The pricing models suggest these companies see significant value in the space. Claude Code's max tier costs $200 USD per month, a price point that some speculate is actually a loss-leader (insert my surprised Pikachu face here), while Amp unashamedly markets itself as having <i>"unconstrained token usage (and therefore cost)"</i>. In enterprise these costs are perhaps palatable (use different word) but For personal, explorative development, it does sadden me a little that there seems to be this growing divide between those that can make the most of these tools and those that cannot [reword this whole sentence].

The excitement for these agents is palpable, with many developers anecdotally reporting significant productivity boosts that make these high monthly costs seem justifiable. An interesting new paper from METR, however, questions whether these productivity claims hold up. Their study, [Measuring the Impact of Early-2025 AI on
Experienced Open-Source Developer Productivity](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study.pdf), suggests that for experienced developers working on tasks within mature open source projects, current AI performance doesn't yet match the hype. In fact, they found that AI tooling slowed their study participants down by 19%. I'm curious to see if similar studies corroborate these findings. Nevertheless, I've observed that interest and discussion around agentic coding tools continues to grow rapidly.

### Gemini CLI

Google's Gemini CLI is latest entrant to enter the arena, released on XYZ. Along with Codex CLI it is also open source, the files are laid bare on GitHub. Claude Code and Amp meanwhile are not.

I must have been busy when Codex CLI came out because it really didn't catch my attention but the launch of Gemini CLI did. Perhaps part of the reason for that was its generous free tier offering. Gemini CLI is still very early in its product lifecyle and I haven't extensively used it so I don't feel well positioned to comment. I think what is fair to say is that the general discourse is that it's a bit raw. Particularly when compared to Claude Code. I think some of the reasons why it might not currently stack up compared are: while Gemini 2.5 pro is undoubtedly a strong model, it doesn't seem to have been trained on tool calling to the extent that Claude Sonnet 4 has, and Gemini CLI uses a mix of Pro and Flash depending on the task (this seems to be a deliberate trade off for efficiency - link to GitHub issue) and while Flash is a great model it's clearly not as capable as these top tier models.

With the release of Gemini CLI I took the opportunity to explore the codebase. It's a node/react app? [need to check this]. I was particularly interested in two things: how the tool determines which files to use as context for the LLM, and how the CLI makes edits to files.

### Context discussion [better title needed]

When you interact with an LLM, the quality of its response is directly tied to the quality of the context it receives. A model that doesn't understand your project's structure or conventions is unlikely to respond with ideal [better word?] answers. Beyond reading instructions from `Gemini.md` files [add some more context here] the Gemini CLI employs two primary ways of context gathering: specifying files with `@` commands and LLM-initiated file discovery.

<b>Specifying files with @ commands</b>

This is the most direct way to provide context. When you know exactly which file or directory is relevant to your prompt, you can point the CLI straight to it using the `@` symbol.

For example, you might ask: "What does this file do? @src/main.ts"

Behind the scenes, the CLI's `atCommandProcessor` (in packages/cli/src/ui/hooks/atCommandProcessor.ts) intercepts this before sending it to the model. It identifies `@src/main.ts` as a path and uses the internal `FileDiscoveryService` (in packages/core/src/services/fileDiscoveryService.ts) and `read_many_files` tool (in packages/core/src/tools/read-many-files.ts) to read its content. The processor then reconstructs the prompt, replacing the `@` command with the actual file contents, neatly packaged for the LLM:

```
What does this file do?

---
Content from: src/main.ts
---

// ... content of main.ts ...
```

This entire combined prompt (your original question plus the file content) is what gets sent to the model.

This feature is quite flexible:

- You can use `@` on a directory (e.g., `@src/components/`), and it will recursively read all non-ignored text files within it.
- By default, this respects your `.gitignore` file, automatically skipping directories like `node_modules` and any other patterns you've specified.

<b>LLM-initiated file discovery</b>

The LLM is not just a passive recipient of context, it can also actively seek it out. The CLI provides a suite of file system tools to the model, empowering it to explore a codebase.

The core tools are defined in `packages/core/src/tools/`. Some of these tools include:

- `list_directory` (ls.ts): To see what files are in a directory.
- `read_file` (read-file.ts): To read the content of a specific file.
- `glob / findFiles` (glob.ts): To search for files using patterns (e.g., \*.ts).
- `search_file_content` / grep (grep.ts): To search for text inside files.

Imagine you ask a broad question like: "Where in the codebase is the authentication logic handled?"

The model doesn't need you to point it to the right file. Instead, it can execute a chain of reasoning using the tools at its disposal:

- First, the model might reason that it needs to find relevant files. It would call the `findFiles` tool (powered by glob) with a pattern like _auth_.ts to locate potential candidates.
- The CLI executes this tool, finds packages/cli/src/config/auth.ts, and returns the path to the model.
- With a promising file identified, the model's next logical step is to read its contents. It calls the read_file tool, passing in the path it just discovered.
- The CLI executes the read operation and sends the file's content back.
- Only then, with the necessary information gathered and placed into its working context, does the LLM formulate the final answer to your question. This agentic workflow allows the model to independently navigate your project to solve complex problems.

One of the main issues with popular agentic tools is that they are often "context-starved" to save on tokens and therefore API costs, which can significantly impact their effectiveness and reasoning ability. Gemini's large context window (up to 1 million tokens) and because Google is both the maker of this tool plus the model provider [better way of expressing this?] make it well positioned to compete here.

### Editing discussion

### Importance of tool usage

It turns out that both of these rely on tool calling, and Thorsten's Ball's viral article on XYZ is great background reading here.
