---
title: Axios compromised
description: The axios npm package was briefly compromised, motivating me to add a minimum release age policy and disable install scripts.
date: 03-04-2026
draft: false
---

On March 31st, the npm account of an axios maintainer was compromised and two
malicious versions were published - v1.14.1 and v0.30.4. [Axios](https://www.npmjs.com/package/axios) is one of the most depended upon packages in the JavaScript ecosystem, averaging roughly 100 million downloads
per week, so this was a particularly newsworthy event.

The malicious versions injected a hidden dependency, `plain-crypto-js@4.2.1`, which
executed during installation and dropped a cross-platform remote access trojan. The compromised packages were live for roughly three hours before npm pulled them. It feels like supply chain attacks are becoming more common, but it's still surprising to me how quickly they are identified and mitigated (thankfully!). That said, any project whose CI/CD pipeline, developer environment, or build system pulled a fresh install during that window could have been compromised.

I've used axios a lot in the past, so this one hit close to home. It was a wake-up call that motivated me to take a closer look at how I was handling things.

### Setting a minimum release age

The first thing I did was add a minimum release age policy to my package
managers, or at least to the ones that support it. This attempts to create a
safety buffer that prevents automatic adoption of newly published packages. In the case of axios, anyone with a cooldown of even a few hours would have been protected. Being a cautious creature, I've set mine to 7 days.

```bash
# ~/.config/uv/uv.toml
exclude-newer = "7 days"

# ~/.npmrc
min-release-age=7 # days

# ~/Library/Preferences/pnpm/rc
minimum-release-age=10080 # minutes

# ~/.bunfig.toml
[install]
minimumReleaseAge = 604800 # seconds
```

Note that you will need `npm v11.10.0` or later for this to work.

### Disabling install scripts

The remote access trojan was delivered via npm's postinstall lifecycle hook, a
script that runs automatically after a package installs. Setting `ignore-scripts=true`
in `.npmrc` disables these hooks entirely. Most packages don't need them; they're
mainly a convenience for compiling native addons. I'll probably be annoyed in the future when I try to install something like `sharp`, but that's a sacrifice present me is willing to make!

```bash
# ~/.npmrc
ignore-scripts=true
```
