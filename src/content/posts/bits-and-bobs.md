---
title: Bits and bobs
description: Plannotator for annotating Codex changesets, a branch naming skill, and a JSHeroes talk worth watching.
date: 13-06-2026
draft: false
---

Three small things I've been enjoying lately.

### Plannotator

I prefer running coding agents in a terminal. Lately that's mostly been Codex. I still read almost every line the agent writes in VS Code, but when I want to flag feedback on a specific change, it's awkward to describe the file and location by hand.

I recently started using [Plannotator](https://plannotator.ai/). You type `!plannotator review` in Codex, the `!` tells Codex to run it as a shell command, and it opens a browser with the current changeset where you can annotate specific lines. Plannotator then sends the annotations back to Codex as context. It also has a planning feature (hence the name), but I don't find myself reaching for it.

The command is a bit long and I often forget it, so I added a wrapper:

```bash
mkdir -p ~/.local/bin

cat > ~/.local/bin/plr <<'EOF'
#!/usr/bin/env bash
exec plannotator review "$@"
EOF

chmod +x ~/.local/bin/plr
```

Now I just type `!plr`.

### A naming skill

I try not to rely on AGENT.md files and skills. But I recently made one exception - a small skill that takes a ticket number and suggests a branch name and commit message.

I usually tweak the output, but it's a useful starting point and it stops me agonising over what to call the branch.

```markdown
---
name: b-c
description: Generate a branch name and commit message for the overall change using the ticket number.
---

Suggest:

1. Branch name
2. Commit message

Use the ticket number provided by the user.

Base the suggestion on the overall change from the current conversation.

Rules:

- Normalize tickets like TKK302 to TKK-302
- Branch: lowercase ticket + concise kebab summary
- Commit: uppercase ticket + lowercase concise imperative summary
- Do not create the branch or commit
```

I run this skill by typing `!b-c TKK-300`.

### JSHeroes 2026

I really enjoyed this closing talk by Suz Hinton on Digital Preservation and Cyberpunk for Front-end Developers. Suz's Twitch streams were formative for me when I was learning to code. I appreciate how she consistently thinks about tech holistically, with empathy, and without getting swept up in whatever the current hype cycle is.

<div class="video-embed">
  <iframe
    src="https://www.youtube.com/embed/GJbCNYUk_Q8"
    title="Digital Preservation and Cyberpunk for Front-end Developers by Suz Hinton"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>
