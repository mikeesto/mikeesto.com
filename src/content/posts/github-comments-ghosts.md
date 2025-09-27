---
title: GitHub Comments and Ghosts
description: GitHub finally lets us comment on unchanged lines in PRs, plus a workaround for phantom notifications that won't go away.
date: 27-09-2025
draft: false
---

GitHub shipped a feature this week that I've been wanting for years: the ability to [comment on unchanged lines in pull request reviews](https://github.blog/changelog/2025-09-25-pull-request-files-changed-public-preview-now-supports-commenting-on-unchanged-lines/). There's a catch though - you need to be using the new PR public preview to access it.

This feels like a small change but it's actually quite significant for code review. Previously, if you wanted to suggest improvements to code that wasn't directly modified in the PR, you were out of luck. Now you can point out related issues, suggest broader refactoring opportunities, or flag code that should have been changed but wasn't. It's a meaningful improvement.

### The Ghost Notification Problem

Speaking of GitHub frustrations, I've been battling a particularly annoying bug this week. You know that little blue dot on the notification bell that suggests you have unread notifications? Mine's been persistently lit up despite my inbox being empty after clearing everything out.

Turns out I'm not alone, there's a [discussion thread](https://github.com/orgs/community/discussions/6874) that's been running since 2021 with over 190 replies from people experiencing the same issue. The root cause appears to be spam mentions. Someone mentions you in a spam post or repo, GitHub removes the spam content, but the associated notification becomes a "ghost" that never quite disappears from your count.

After trying various solutions, here's what worked for me.

**If you have 25+ notifications in your inbox:**

1. Use "select all" and mark everything as read
2. This clears the ghost notifications along with the real ones

**If you have fewer than 25 notifications:**
The select all feature doesn't appear unless you hit that threshold, so you need to artificially inflate your inbox first.

1. Go to your "Done" tab
2. Select all notifications (checkbox)
3. Click "Move to inbox"
4. Return to your inbox
5. Select all (checkbox)
6. Click "Select all X"
7. Click "Done"

It's a bit of a dance, but it's the most reliable way I've found to exorcise the notification ghosts.
