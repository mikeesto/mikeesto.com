---
title: How to fix apt timing out on a Raspberry Pi
description: A quick fix for when apt update times out on a Raspberry Pi when trying to access archive.raspberrypi.com
date: 06-11-2024
draft: false
---

On some corporate networks I've run into a brick wall when using `apt update` on a Raspberry Pi. The first couple of repositories connect successfully. Then it usually gets up to `archive.raspberrypi.com` and hangs and times out.

Apt defaults to IPv6 when it is available, and in some cases it just does not seem to play nicely. The solution - force IPv4 instead.

You can do this via the `-o` flag when running the command:

```bash
sudo apt -o Acquire::ForceIPv4=true update
```

Or you can edit the apt configuration and add a line to make IPv4 permanent:

```bash
sudo nano /etc/apt/apt.conf.d/99force-ipv4
```

Add this line:

```bash
Acquire::ForceIPv4 "true";
```

If you found this useful, I have started [collating notes](https://pifiles.netlify.app/) on working with the Raspberry Pi in a central place.
