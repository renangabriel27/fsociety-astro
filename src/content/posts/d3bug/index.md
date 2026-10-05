---
title: "eps1.2_d3bug.mkv"
excerpt: "A field guide to debugging in production: reproduce, read the logs, bisect, strace, find the root cause."
date: "2026-09-13T15:23:18.000Z"
tags: ["engineering"]
---

People think debugging is about fixing a mistake. It isn't. Debugging is about finding the root of the problem, and the fix is just what you do afterwards. In production, under pressure, with users waiting, the temptation is to change things until the error stops. That's how you end up with a fix you don't understand for a bug you never found. This is the method I use instead.

## Reproduce first, theorize second

A bug you can't reproduce is a rumor. Before touching code, pin down the exact conditions: which input, which user, which version, which host, what time. Narrow the blast radius.

- Does it happen for everyone or for one account?
- Did it start with a deploy, a config change, or a traffic spike?
- Does it happen on one node behind the load balancer but not the others?
- Can you trigger it locally with production-like data?

Write the reproduction down as a test case the moment you have it. It becomes your regression test later.

## Read the logs like evidence

Logs are a crime scene. Don't skim them for the first red line; build a timeline. Find the first anomaly, not the loudest one. The loud error at 03:14 is often a symptom of something quiet at 03:09.

```bash
# everything from one service since the deploy
journalctl -u api.service --since "2026-10-03 03:00" --no-pager

# follow one request across services by its ID
grep -r "req_id=8f3a2c" /var/log/app/ | sort

# what changed on disk recently?
find /etc -mmin -60 -type f
```

This is why **structured logging** matters. Plain strings are for humans; JSON lines with consistent fields are for humans with `jq`. Log a request ID, user ID, version and duration on every line, and correlation stops being guesswork:

```bash
jq -c 'select(.level == "error" and .version == "2.14.0")' app.log \
  | jq -r '.msg' | sort | uniq -c | sort -rn | head
```

## Let git bisect find the commit

If it worked last week and it's broken now, the answer is somewhere in the history. `git bisect` does a binary search over commits: a thousand commits take about ten steps.

```bash
git bisect start
git bisect bad HEAD
git bisect good v2.13.0

# automate it with your reproduction script (exit 0 = good)
git bisect run ./scripts/repro.sh

git bisect reset
```

Automated bisect plus a reliable reproduction is the closest thing to magic in this job.

## When the code looks fine: strace

Sometimes the application swears it's doing the right thing. `strace` shows what it actually asks the kernel to do: which files it opens, which sockets it connects to, which calls fail and why.

```bash
# attach to a running process, follow forks, show file and network calls
sudo strace -f -p 4242 -e trace=file,network -s 200

# summary of syscalls and errors
strace -c -f ./worker --once
```

An `ENOENT` on a config path, an `EACCES` on a socket, a `connect()` that hangs for 30 seconds on a DNS server that no longer exists. These are invisible from inside the app and obvious from outside. Use it on a staging host first; tracing adds overhead.

## Root cause vs symptom

When the error disappears, you're not done. Ask why five times. The disk filled up. Why? Logs weren't rotated. Why? The logrotate config was in the old image. Why? The new image was built from a different base. Why? Nobody owns the base image. That last answer is the root cause, and it's the one that keeps you from being paged again next month.

Fix the symptom to stop the bleeding. Fix the cause so it doesn't come back. Then write down what you learned, because future you will not remember.
