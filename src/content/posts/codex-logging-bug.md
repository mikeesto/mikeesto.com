---
title: Codex's SQLite logging bug
description: Codex was logging huge amounts of data to a local SQLite file.
date: 29-06-2026
draft: false
---

I was mindlessly scrolling when I saw a tweet about Codex logging large amounts of data to disk. Enough to chew through an SSD. I checked my own machine with `du -sh ~/.codex` which returned 150MB. That seemed normal enough to me? But the more I dug into it the more I realised the file size wasn't the whole story.

In [#28224](https://github.com/openai/codex/issues/28224) a user found that their SSD had absorbed around ~37TB of writes in 21 days of uptime (640TB a year if extrapolated), almost all from Codex's local log database (`~/.codex/logs_2.sqlite`). The cause is a logging sink set to global `TRACE` level, the noisiest setting there is, which was logging things like raw WebSocket payloads on every event, plus a bunch of duplicated OpenTelemetry traffic.

The logs table doesn't grow forever, it prunes old rows about as fast as it inserts new ones, so the log file stays a deceptively normal size. This is why my 150MB file didn't mean anything - the file size is the size of the current backlog, not a record of how much writing has happened. The issue reporter actually measured the real number. Over a 15 second window, the retained row count stayed flat at ~680,000, while the row ID counter (which only ever increases) jumped by about 36,000. That's 36,000 inserts in 15 seconds.

You can watch the row churn yourself to check:

```bash
sqlite3 ~/.codex/logs_2.sqlite "SELECT MAX(rowid) FROM logs;"

# wait 15 seconds, run it again

sqlite3 ~/.codex/logs_2.sqlite "SELECT MAX(rowid) FROM logs;"
```

In response, three PRs have landed so far. Two shipped in `0.142.0`: [#29432](https://github.com/openai/codex/pull/29432) stops logging full WebSocket payloads, and [#29457](https://github.com/openai/codex/pull/29457) filters out other noisy duplicated log targets. The third, [#29599](https://github.com/openai/codex/pull/29599) (merged June 23rd), stops some "bridged" log events that still reach SQLite even on `0.142.0` - it's slated for `0.143.0`, which hadn't shipped as stable yet.

So, it's worth continuing to update Codex!

```bash
npm install -g @openai/codex@latest
codex --version
```
