---
title: "eps2.1_k3rnel-pan1c.ksd"
excerpt: "Reading a kernel panic before you reboot: dmesg, journalctl -k, kdump and what to save first."
date: "2026-10-01T15:23:18.000Z"
tags: ["linux"]
---

The screen freezes. A wall of hex scrolls past, ending in `Kernel panic - not syncing`. The instinct is to reboot and hope. Resist it, at least for a minute. A kernel panic or oops is the kernel's own crash report, and it usually tells you exactly where things went wrong, if you capture it before it's gone. This is a practical guide to reading one, and to collecting what you'll need to find the cause.

## Oops vs panic

An **oops** is the kernel detecting a serious error, like a bad pointer dereference in a driver, logging it, and killing the offending task. The system often keeps running, but in an unknown state. Treat it as tainted. A **panic** is fatal: the kernel decides it can't continue safely and halts (or reboots, if `kernel.panic` is set). Many panics start life as an oops that hit something critical, or a system configured with `panic_on_oops=1`.

## Reading the report

A typical oops has the same anatomy. Read it top to bottom:

```
BUG: kernel NULL pointer dereference, address: 0000000000000008
#PF: supervisor read access in kernel mode
Oops: 0000 [#1] PREEMPT SMP NOPTI
CPU: 3 PID: 1187 Comm: kworker/3:2 Tainted: P           O      6.8.0-45-generic
Hardware name: ...
RIP: 0010:foo_driver_poll+0x2a/0x90 [foo_driver]
Call Trace:
 <TASK>
 process_one_work+0x16f/0x350
 worker_thread+0x2f5/0x410
 kthread+0xe8/0x120
 </TASK>
```

- **The first line** is the reason: a NULL dereference, a general protection fault, a soft lockup, out of memory.
- **Comm and PID** tell you which task was running.
- **Tainted** flags matter: `P` means a proprietary module was loaded, `O` an out-of-tree module, `E` an unsigned one. Upstream developers will ask you to reproduce without them.
- **RIP** is the instruction that faulted. `function+offset/length [module]` points straight at the culprit, here an out-of-tree driver.
- **Call Trace** is how execution got there, most recent first.

## What to collect before rebooting

If the machine is still alive after an oops, grab everything now. After a reboot, the ring buffer is gone.

```bash
# the kernel ring buffer, with readable timestamps
sudo dmesg -T > ~/oops-$(date -u +%FT%H%M).txt

# kernel messages from the previous boot (needs persistent journal)
journalctl -k -b -1 --no-pager

# context: exact kernel, loaded modules, taint value
uname -a
lsmod > ~/lsmod.txt
cat /proc/sys/kernel/tainted
```

Make sure the journal persists across reboots, or `-b -1` will be empty: create `/var/log/journal` or set `Storage=persistent` in `journald.conf`. Also note what changed recently: a kernel update, a new driver, a firmware upgrade, new hardware.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/k3rnel-pan1c/04-illusion.jpg" class="kg-image" alt="A terminal showing a kernel stack trace" loading="lazy"><figcaption>It looks like noise. It's actually a very precise bug report.</figcaption></figure>

## kdump: catch the full crash

For a full panic, nothing survives in RAM unless you planned for it. `kdump` reserves memory for a small crash kernel; when the main kernel panics, the crash kernel boots and writes a `vmcore` to disk for later analysis with the `crash` utility.

```bash
# Debian/Ubuntu
sudo apt install kdump-tools
# Fedora/RHEL
sudo dnf install kexec-tools && sudo systemctl enable --now kdump

# after a reboot, verify it's armed
kdump-config show      # Debian/Ubuntu
kdumpctl status        # Fedora/RHEL
```

Dumps land in `/var/crash/`. On production servers, enable kdump before you need it. It's the difference between "it crashed" and "here is the exact state of memory when it crashed".

## Common causes

1. **Drivers**, especially out-of-tree and proprietary ones (GPU, Wi-Fi, storage controllers).
2. **Bad RAM.** Random panics in unrelated places point to hardware. Run `memtest86+` overnight.
3. **Kernel regressions** after an update. Boot the previous kernel from the bootloader menu to confirm.
4. **Filesystem or storage errors**, often preceded by I/O errors in the log.
5. **Overheating and power issues**, which look random until you check the sensors.

A panic feels like the end of the world. It's just the kernel being honest about something it couldn't handle. Listen to it.
