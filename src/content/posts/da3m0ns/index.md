---
title: "eps1.3_da3m0ns.mp4"
excerpt: "Know your daemons. Audit what runs and listens on your Linux box, and turn off what you don't need."
date: "2026-09-15T15:23:18.000Z"
tags: ["linux"]
cover: "./cover.jpg"
---

Every Linux box runs things you didn't start. Daemons: background processes that come up at boot, listen on ports, and wait. Most are harmless. Some are leftovers from a package you installed once and forgot. A few are listening on every interface for no reason at all. Each one is code with privileges and a potential door. If you don't know what's running on your machine, someone else might find out first.

## What is running

On any systemd distribution, start with the service manager. It knows what it launched and why.

```bash
# services running right now
systemctl list-units --type=service --state=running

# services enabled to start at boot
systemctl list-unit-files --type=service --state=enabled

# timers are daemons too, just scheduled ones
systemctl list-timers --all
```

For each name you don't recognize, ask systemd what it is and where it came from:

```bash
systemctl status cups.service
systemctl cat cups.service          # the unit file, including overrides
dpkg -S /usr/sbin/cupsd             # which package owns it (rpm -qf on Fedora/RHEL)
```

## Who is listening

A daemon that only talks to localhost is a much smaller risk than one bound to `0.0.0.0`. `ss` replaced `netstat` years ago and tells you exactly what's listening and which process owns it.

```bash
sudo ss -tulpn
```

Read the `Local Address:Port` column carefully:

- `127.0.0.1:5432` or `[::1]:5432` — reachable only from this machine.
- `0.0.0.0:5432` or `*:5432` or `[::]:5432` — reachable from any network the host is on.
- `192.168.1.10:8080` — bound to one specific interface.

A database listening on all interfaces on a laptop that joins café Wi-Fi is a classic. So is a dev server someone started with `--host 0.0.0.0` and never stopped. Then double-check from the outside, from another machine you own, with `nmap` against your own host only.

## Processes systemd didn't start

Not everything is a unit. Look at the process tree for things that run outside the service manager: user crontabs, shells left in `tmux`, containers, or something worse.

```bash
ps -eo pid,user,etime,cmd --forest | less

# per-user cron jobs and system-wide ones
sudo ls /var/spool/cron/crontabs/ /etc/cron.d/

# open network connections per process
sudo lsof -i -P -n | grep -v LISTEN
```

A process with a strange name running from `/tmp` or `/dev/shm`, owned by your web server user, deserves your full attention. Isolate the host before you poke at it.

## Disable what you don't need

The most secure service is the one that isn't running. On a server, ask of every daemon: does this machine's job require it? If not:

```bash
# stop it now and keep it from starting at boot
sudo systemctl disable --now avahi-daemon.service

# make sure nothing else can start it, either
sudo systemctl mask avahi-daemon.service avahi-daemon.socket

# or just remove the package
sudo apt purge avahi-daemon
```

Note the socket unit. Socket activation means a service can be started on demand by a connection, so disabling only the `.service` isn't always enough.

For daemons you do need, bind them to localhost or a private interface, put a host firewall in front (`ufw` or `nftables`, default deny inbound), and look at systemd's sandboxing options: `systemd-analyze security nginx.service` scores a unit and lists hardening directives like `ProtectSystem=`, `NoNewPrivileges=` and `PrivateTmp=`.

## Make it a routine

Save the output of `ss -tulpn` and `systemctl list-unit-files --state=enabled` to a file. Diff it next month. Anything new should have a reason you can explain. If you can't explain it, that's your answer.
