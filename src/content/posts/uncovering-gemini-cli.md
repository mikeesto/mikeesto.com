---
title: Uncovering Gemini CLI
description: TODO:...
date: 03-08-2025
draft: true
---

The terminal-based AI coding agent wars have well and truly begun. Claude Code (Anthropic), Codex CLI (OpenAI), Amp (SourceGraph) and most recently Gemini CLI (Google) all operate directly in your shell and are capable of reading files, writing new code, and executing commands to build and test their own work. These tools represent a shift from chat based/code completion programming assistance that was popularised through GitHub Copilot to now agents that can directly manipulate codebases and development environments.

The pricing models suggest these companies see significant value in the space. Claude Code's max tier is $200 USD per month, a price point that some speculate is actually a loss-leader, while Amp unashamedly markets itself as having unconstrained token usage (and therefore cost). For enterprise these costs are perhaps justifiable. For hobby/side-project development, I imagine these "unlimited" usage price points are prohibitive for most.

The hype around programming agents is at an all time high. Many developers anecdotally report significant productivity boosts. Personally, I have also found value in using them although I would describe my experience as a bit more mixed. It can feel magical one moment and unhinged the next. Some tasks I would have completed in half the time had I read the documentation and written the code myself.

A recent paper from METR questions whether these productivity claims hold up. Their study, [Measuring the Impact of Early-2025 AI on
Experienced Open-Source Developer Productivity](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study.pdf), suggests that for experienced developers working on tasks within mature open source projects, current AI performance doesn't yet match the hype. In fact, they found that AI tooling on average slowed their study participants down by 19%. I'm curious to see if similar studies will corroborate these findings.

### Gemini CLI

Google's [Gemini CLI](https://github.com/google-gemini/gemini-cli) is the latest entrant in the arena, released on June 25. Like Codex CLI, it's also open source, while Claude Code and Amp remain closed.

I must have been distracted when Codex CLI launched because it didn't really catch my attention, but Gemini CLI's release did. Perhaps that was partly due to its generous free tier of 1,000 requests per day. Since Gemini CLI is still very early in its product lifecycle and I haven't used it extensively, I don't feel well positioned to offer a review. The general consensus seems to be that it's still somewhat rough around the edges, particularly when compared to Claude Code.

A few factors likely contribute to this gap: while Gemini 2.5 Pro is undoubtedly a strong model, it doesn't appear to be as good at tool calling as Claude Sonnet and Opus 4 which, as I will explain below, is a key part of what makes these agents excel. Additionally, Gemini CLI uses a mix of Pro and Flash models depending on the task, a deliberate [efficiency trade-off](https://github.com/google-gemini/gemini-cli/discussions/3064). While Flash is excellent, it's clearly not as capable as these larger models.

That said, there's no doubt that Gemini CLI is continuing to improve. A lot of improvements have been merged since I started drafting this post.

Soon after its release, I took the opportunity to explore the codebase. The CLI has been built with Node.js and TypeScript [need to verify]. I was particularly interested in two things: how it determines which files to use as context for the LLM, and how it makes edits to files.

### Context discussion [better title needed]

When you interact with an LLM, the quality of its response is directly tied to the quality of the context it receives. A model that doesn't understand your project's structure or conventions is unlikely to respond with ideal [better word?] answers. Beyond reading instructions from `Gemini.md` files [add some more context here] the Gemini CLI employs two primary ways of context gathering: specifying files with `@` commands and LLM-initiated file discovery.

<b>Specifying files with @ commands</b>

This is the most direct way to provide context. When you know exactly which file or directory is relevant to your prompt, you can point the CLI straight to it using the `@` symbol.

For example, you might ask: <i>What does this file do? @src/main.ts</i>

Behind the scenes, the CLI's `atCommandProcessor` (in `packages/cli/src/ui/hooks/atCommandProcessor.ts`) intercepts this before sending it to the model. It identifies `@src/main.ts` as a path and uses the internal `FileDiscoveryService` (in `packages/core/src/services/fileDiscoveryService.ts`) and `read_many_files` tool (in `packages/core/src/tools/read-many-files.ts`) to read its content. The processor then reconstructs the prompt, replacing the `@` command with the actual file contents, neatly packaged for the LLM:

```
What does this file do?

---
Content from: src/main.ts
---

// ... content of main.ts ...
```

This entire combined prompt (your original question plus the file content) is what gets sent to the model. This feature is quite flexible:

- You can use `@` on a directory (e.g., `@src/components/`), and it will recursively read all non-ignored text files within it.
- By default, this respects your `.gitignore` file, automatically skipping directories like `node_modules` and any other patterns you've specified.

<b>LLM-initiated file discovery</b>

The LLM is not just a passive recipient of context, it can also actively seek it out. The CLI provides a suite of file system tools to the model, empowering it to explore a codebase.

The core tools are defined in `packages/core/src/tools/`. Some of these tools include:

- `list_directory` (ls.ts): To see what files are in a directory.
- `read_file` (read-file.ts): To read the content of a specific file.
- `glob / findFiles` (glob.ts): To search for files using patterns (e.g., \*.ts).
- `search_file_content` / `grep` (grep.ts): To search for text inside files.

Imagine you ask a broad question like: <i>Where in the codebase is the authentication logic handled?</i>

The model doesn't need you to point it to the right file. Instead, it can execute a chain of reasoning using the tools at its disposal:

- First, the model might reason that it needs to find relevant files. It would call the `findFiles` tool (powered by glob) with a pattern like auth\*.ts [is this pattern right? i don't think so] to locate potential candidates.
- The CLI executes this tool, finds `packages/cli/src/config/auth.ts`, and returns the path to the model.
- With a promising file identified, the model's next logical step is to read its contents. It calls the `read_file` tool, passing in the path it just discovered.
- The CLI executes the read operation and sends the file's content back.

Only then, with the necessary information gathered and placed into its working context, does the LLM formulate the final answer to your question. This agentic workflow allows the model to independently navigate your project to solve complex problems.

One of the main issues with popular agentic tools is that they are often "context-starved" to save on tokens and therefore API costs, which can significantly impact their effectiveness and reasoning ability. Gemini's large context window (up to 1 million tokens) and Google's dual role as both tool developer and inference provider position it well to compete in this space.

### Editing discussion [better title needed]

The LLM generates precise replacement commands, and the CLI tool calculates and displays a diff for your confirmation before making any changes. [need a better intro for this section]

Imagine you issue a command like: "In src/components/Button.tsx, change the variant prop to secondary."

Of course, it would probably be quicker for you to just make this change yourself but alas.

The model understands your intent and formulates a call to the replace tool. It doesn't think in terms of diffs; it thinks in terms of search-and-replace. Its output will be a structured tool call like this:

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

Notice the old_string. The model includes surrounding lines as context to ensure it targets the exact location you intended, avoiding ambiguity.

The CLI anticipates that the LLM's old_string might not be a perfect, byte-for-byte match of the file on disk (e.g., due to subtle whitespace differences or the LLM hallucinating a slightly different context).
Before showing you a diff, the EditTool calls ensureCorrectEdit from packages/core/src/utils/editCorrector.ts.
Initial Check: It first tries to find old_string in the file.
Correction Sub-Routine: If it's not found (or found multiple times), it triggers a correction routine. It makes a new, highly-focused call to the Gemini API with a prompt that essentially says:
"Here is the content of a file. Here is a 'problematic snippet' (old_string) that I'm trying to find. Please give me back the exact text from the file content that corresponds to this snippet."
Refined Parameters: The LLM responds with a more precise old_string that actually exists in the file. The editCorrector may also ask the LLM to adjust the new_string to match the corrected context.
This self-correction makes the editing tool dramatically more reliable than a simple search-and-replace.

Now, with a reliable old_string and new_string, the CLI can proceed.

The EditTool's shouldConfirmExecute method is called.
It calculates a diff between the original file content and the content as it would be after the replacement.
This diff is rendered beautifully in the terminal using DiffRenderer.tsx inside the ToolConfirmationMessage.tsx component.
You are presented with a prompt:

```
Gemini wants to run the tool "Edit" on file `src/main.ts`.
--- DIFF ---
- const TIMEOUT_MS = 5000;
+ const TIMEOUT_MS = 10000; // Increased timeout for long operations
---
Do you want to proceed?
(Y)es, (n)o, (m)odify in editor, (a)lways allow for this tool
```

If you press Y (or have auto-accept enabled), the EditTool.execute() method is finally called.
It re-reads the file to ensure no changes have happened since the confirmation was generated.
It performs the string replacement in memory.
It writes the entire new buffer back to the file using fs.writeFile.

There is a second, simpler tool for file modifications: write_file.
LLM's Goal: To create a new file or completely overwrite an existing one.
What LLM Provides: file_path and the full content.
How it's Applied: It also goes through a confirmation step showing a diff.
If the file is new, the diff will show all lines being added.
If the file exists, the diff will be against the old content.
Upon confirmation, it simply writes the provided content to the file_path. Like the EditTool, it also has a self-correction mechanism (ensureCorrectFileContent) to fix potential formatting or escaping issues in the content provided by the LLM before writing.

### Importance of tool usage

It turns out that both of these rely on tool calling, and Thorsten's Ball's viral article on XYZ is great background reading here.
