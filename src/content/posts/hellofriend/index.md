---
title: "eps1.0_hellofriend.mov"
excerpt: "Why this blog exists, and a personal threat model you can build in fifteen minutes."
date: "2026-09-09T15:23:18.000Z"
tags: ["culture"]
featured: true
cover: "./cover.jpg"
---

Hello, friend. Maybe I should give you a name, but that's a slippery slope. So let's skip the introductions and talk about why this blog exists: most people secure the wrong things. They buy a VPN and reuse one password across forty sites. They tape over the webcam and never install updates. Security isn't a product you buy. It's a set of decisions about what you're protecting, from whom, and how much effort it's worth. That's called a threat model, and you can build a useful one in fifteen minutes.

## Why this blog exists

I write about security, Linux and the systems everyone depends on but nobody looks at. Not the movie version. The boring version: patches, logs, backups, clocks, the stuff that actually decides whether a bad day becomes a disaster. Everything here is defensive. If you came for exploits, there's nothing for you. If you came to understand your own machines better, stay.

## A threat model in 15 minutes

Grab a text file. Answer four questions honestly.

1. **What do I have?** Email (the master key to every password reset), your password manager, phone, laptop, cloud storage, bank, work accounts, photos you'd hate to lose.
2. **Who wants it?** Realistically: automated credential-stuffing bots, opportunistic scammers, a thief who grabs your laptop at a café. Maybe an ex or a nosy coworker. Probably not a nation-state.
3. **How likely is each scenario?** Reused passwords leaking in a breach: very likely. Phishing email: certain. Targeted hardware implant: no.
4. **What happens if it goes wrong?** Losing email is catastrophic. Losing a forum account is an inconvenience. Spend your effort where likelihood and impact are both high.

That's it. You now know more about your risk than most organizations with a compliance binder.

## The boring fixes that stop most attacks

For a typical person, three habits cover the overwhelming majority of real-world compromises.

### Use a password manager

Every account gets a unique, random password. When a site gets breached, and it will, the damage stops at that site. Pick a reputable manager, protect it with a long passphrase, and let it generate everything else.

### Turn on 2FA, prefer passkeys

Start with email, then your password manager, bank and code hosting. Passkeys and hardware security keys are phishing-resistant because the credential is bound to the real domain; a fake login page simply can't use it. Authenticator apps (TOTP) are a solid second choice. SMS is better than nothing, but SIM swaps are real.

### Install updates

Most attacks use known, already-patched vulnerabilities. Turn on automatic updates for your OS, browser and phone. On Debian or Ubuntu, unattended upgrades take two commands:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades

# check what's pending right now
apt list --upgradable
```

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">⚠️</div><div class="kg-callout-text">Store your 2FA recovery codes somewhere offline. Locking yourself out is also a security failure.</div></div>

## What comes next

Revisit the threat model once a year, or whenever your life changes: a new job, a move, a public profile. The answers shift, and so should your defenses. The rest of this blog goes deeper, one system at a time: bits and bytes, debugging, daemons, vulnerabilities, backups, incidents, metadata, kernels. Read in any order.

And remember: the goal isn't to be unhackable. Nobody is. The goal is to be expensive enough that the attacker moves on to someone who didn't read this.
