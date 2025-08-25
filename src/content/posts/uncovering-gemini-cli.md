---
title: Uncovering Gemini CLI
description: A deep dive into how Google's open source coding agent understands codebases and makes safe file edits.
date: 25-08-2025
draft: false
---

The terminal based AI coding agent wars have well and truly begun. Claude Code (Anthropic), Codex CLI (OpenAI), Amp (SourceGraph) and most recently Gemini CLI (Google) all operate directly in your shell and are capable of reading files, writing new code, and executing commands to build and test their own work. These tools mark a shift from chat-based/code-completion programming assistance that was popularised through GitHub Copilot to now agents that can directly manipulate codebases and development environments.

The pricing models suggest these companies see significant value in the space. Claude Code's max tier is $200 USD per month, a price point that some speculate is actually a loss leader, while Amp unashamedly markets itself as having unconstrained token usage (and therefore cost). For enterprise these costs are perhaps justifiable. For hobby and side-project development, I imagine these "unlimited" usage prices are prohibitive for most.

The hype around programming agents is at an all time high. I recently attended a conference where AI and agentic coding dominated most of the talks despite not being an explicit theme of the conference. Some developers say it makes them significantly more productive. I've heard claims ranging from 2x to 10x, to even 100x. Other developers say it provides no benefit and in some cases actually slows them down. As with most things, I think the reality is more nuanced. For certain tasks agents clearly can be a productivity force multiplier. However, software engineering has never really been about churning out lines of code per hour, and agentic coding won't magically solve all the other friction points that we as developers face day to day.

A recent paper from METR questions whether AI assisted programming makes experienced developers more productive. Their study, [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study.pdf), suggests that for experienced developers working on tasks within mature open source projects, current AI performance doesn't yet match the hype. In fact, they found that AI tooling on average slowed their study participants down by 19%. There are some interesting aspects to this study, and I'm curious to see if similar studies will corroborate these findings.

To better understand how these tools work, I decided to take a closer look at the newest entrant to the space.

### Gemini CLI

Google's [Gemini CLI](https://github.com/google-gemini/gemini-cli) was released on June 25th. Like Codex CLI it's also open source, while Claude Code and Amp remain closed.

Gemini CLI is still very early in its product lifecycle. At the time of writing, the general consensus online seems to be that it's still rough around the edges, particularly when compared to Claude Code. A few factors likely contribute to this gap. While Gemini 2.5 Pro is undoubtedly a strong model, it doesn't appear to be as proficient at tool calling as Anthropic's models are, which is a key component of what makes agents excel. Additionally, Gemini CLI uses a mix of Pro and Flash models depending on the task - a deliberate [efficiency trade-off](https://github.com/google-gemini/gemini-cli/discussions/3064).

That said, there's no doubt that Gemini CLI continues to improve. Hundreds of PRs are being merged into the repository every week. It also offers a very generous free tier of 1,000 requests per day if you'd like to try it out.

Since it's open source, soon after its release I spent a Saturday exploring the codebase. The CLI has been built with Node.js and TypeScript. I was particularly interested in two things: how it determines which files to use as context for the LLM, and how it makes edits to files.

### Gemini CLI's context strategy

When you interact with a LLM, the quality of its response is directly tied to the quality of the context it receives. A model that doesn't understand your project's structure, conventions, or the specific code you're asking about is unlikely to provide truly useful answers. The Gemini CLI tackles this context problem with a multi-layered approach.

At its foundation are `GEMINI.md` files, which create a hierarchical set of instructions for the model. You can have a global `~/.gemini/GEMINI.md` for your personal preferences, a project-level `GEMINI.md` for team conventions, and even component specific `GEMINI.md` files in subdirectories. The CLI intelligently loads and combines these, giving the model a deep understanding of your rules before you even type a prompt.

On top of this foundation, the Gemini CLI employs two primary methods for gathering dynamic context during a session: explicit file injection and agentic LLM initiated file discovery.

<b>Providing explicit context with `@`</b>

This is the most direct way to provide context. When you know exactly which file or directory is relevant to your prompt, you can point the CLI straight to it using the `@` symbol.

For example, you might ask: <i>What does this file do? @src/main.ts</i>

Behind the scenes, the CLI's `atCommandProcessor` (from `packages/cli/src/ui/hooks/atCommandProcessor.ts`) intercepts your prompt. It recognises `@src/main.ts` as a path and invokes the internal `read_many_files` tool (found in `packages/core/src/tools/read-many-files.ts`).

This tool reads the file's content and the processor then reconstructs the prompt, replacing the `@` command with the actual file contents, neatly packaged for the LLM. The final prompt sent to the model looks something like this:

```
What does this file do?

---
Content from: src/main.ts
---

// ... the actual content of main.ts is injected here ...
```

This feature is quite flexible:

- You can use `@` on a directory (e.g., `@src/components/`), and the `read_many_files` tool will recursively read all non-ignored text files within it.
- By default, this process respects your `.gitignore` and `.geminiignore` files, automatically skipping directories like `node_modules`, build artifacts, and any other patterns you've specified. This is handled by the `FileDiscoveryService` in `packages/core/src/services/fileDiscoveryService.ts`.

<b>LLM initiated discovery</b>

The LLM isn't just a passive recipient of context; it can also actively seek it out. The CLI provides a suite of file system tools to the model, empowering it to explore your codebase in an agentic manner.

These core tools are defined in `packages/core/src/tools/` and include:

- `list_directory` (`ls.ts`): To see what files are in a directory.
- `read_file` (`read-file.ts`): To read the content of a specific file.
- `glob` (`glob.ts`): To search for files using patterns (e.g., `src/**/*.ts`).
- `search_file_content` (`grep.ts` or `ripGrep.ts`): To search for text inside files.

Imagine you ask a broad question like: <i>Where in the codebase is the authentication logic handled?</i>

The model doesn't need you to point it to the right file. Instead, it can execute a chain of reasoning using the tools at its disposal:

1. The model might first reason that "authentication logic" is often related to files containing the word "auth". It decides to search the entire project for that term.
2. It calls the `search_file_content` tool with the pattern "auth".
3. The CLI executes this search and returns a list of matching files and line numbers, such as `packages/cli/src/config/auth.ts`.
4. Now with a promising file identified, the model's next logical step is to read its contents. It calls the `read_file` tool, passing in the full path it just discovered.
5. The CLI executes the read operation and sends the file's content back to the model.

Only then, with the necessary information gathered and placed into its working context, does the LLM formulate the final, informed answer to your original question. This agentic workflow allows the model to independently navigate your project to solve complex problems.

One of the main issues with popular agentic tools is that they are often "context starved" to save on tokens and therefore API costs, which can significantly impact their effectiveness. I think Gemini's large context window (up to 1 million tokens) and Google's dual role as both tool developer and inference provider positions it well to compete here.

Understanding the codebase is only half the battle. Once the model knows what needs to change, the CLI faces an even trickier challenge: making precise, safe edits to files without breaking anything.

### How Gemini CLI makes changes

This process is a multi-step dance of intent translation, self-correction, and user confirmation. The LLM doesn't generate a diff. Instead, it understands your request and formulates a call to a specific tool: `replace`. Its goal is to find an exact block of text and replace it with a new one.

For a request like: "<i>In src/main.ts, change the timeout from 5000 to 10000 and add a comment"</i>, the model will generate a tool call that looks something like this:

```
{
  "name": "replace",
  "args": {
    "file_path": "/path/to/project/src/main.ts",
    "old_string": "const TIMEOUT_MS = 5000;\nconsole.log('Using default timeout');",
    "new_string": "const TIMEOUT_MS = 10000; // Increased timeout for long operations\nconsole.log('Using default timeout');"
  }
}
```

The `old_string` includes surrounding lines. This is crucial. The model provides this context to pinpoint the exact location for the change, reducing the risk of modifying the wrong line if, for example, `const TIMEOUT_MS = 5000;` appeared multiple times.

At this point a very interesting thing happens. The CLI anticipates that the LLM's `old_string` might not be a perfect, byte-for-byte match of the file on disk. The model might hallucinate a slightly different comment, miss a whitespace character, or be working from a slightly outdated context.

To solve this, the EditTool calls a helper function: `ensureCorrectEdit` (found in `packages/core/src/utils/editCorrector.ts`):

1. It first tries a direct search for `old_string`. If it finds exactly one match, great!
2. If the string isn't found, or is found multiple times, it doesn't just fail. Instead, it triggers a correction sub-routine by making a new call back to the model. The prompt is essentially: "Here is the full content of the file. Here is a problematic snippet (`old_string`) that I'm trying to find. Please give me back the exact text from the file content that corresponds to this snippet."
3. The LLM analyses the full context and returns a more precise `old_string` that actually exists in the file. The `editCorrector` may also ask the LLM to adjust the `new_string` to align with the corrected context.

This self-correction cycle makes the editing tool dramatically more reliable than a simple search-and-replace, gracefully handling minor inaccuracies from the model.

With a high confidence `old_string` and `new_string`, the CLI is ready to propose the change to you. The EditTool's `shouldConfirmExecute` method is called.

This method calculates a diff between the original file content and the new content that would result from the replacement. This diff is then nicely rendered in your terminal by the `DiffRenderer.tsx` component inside the `ToolConfirmationMessage.tsx` UI.

You are presented with a clear, interactive prompt:

```
Gemini wants to run the tool "Edit" on file `src/main.ts`.

--- DIFF ---
- const TIMEOUT_MS = 5000;
+ const TIMEOUT_MS = 10000; // Increased timeout for long operations
---

Do you want to proceed?
(Y)es, (n)o, (m)odify in editor, (a)lways allow for this tool
```

This confirmation step is designed to ensure you are always in control. You can accept, reject, or even jump into your own editor to modify the proposed changes before accepting.

Only after you give your approval does the `EditTool.execute()` method run. As a final safety check, it re-reads the file from disk to ensure it hasn't been changed by another process since you saw the diff. It then performs the string replacement in memory and writes the new content back to the file.

For creating new files or completely overwriting existing ones, the LLM uses a simpler tool: `write_file`. Like the `replace` tool, `write_file` also goes through a confirmation step showing a diff. If the file is new, the diff shows all lines being added. Upon confirmation, it writes the content to the file. It also features its own self-correction mechanism, `ensureCorrectFileContent`, to fix potential formatting or escaping issues in the LLM provided content before writing to disk.

### The models yearn for tools

This entire workflow, from context gathering to confirmed edits, illustrates why tool calling has become the cornerstone of modern AI agents. I recommend Thorsten Ball's viral article on [How to Build an Agent](https://ampcode.com/how-to-build-an-agent) if you want to understand programmatically how a coding agent's core loop works. It's surprisingly approachable, Thorsten's example is less than 400 lines of code.

### A few loose ends

I started drafting this post five weeks ago but with a healthy dose of procrastination and life, only finished and published it today. In this rapidly evolving space, several major developments have emerged since then. Cursor has released their own terminal based AI coding agent and OpenAI released their GPT-5 suite of models. While the hype cycle inevitably continues, I think taking time to understand how these tools actually work remains the best way to evaluate their true potential.
