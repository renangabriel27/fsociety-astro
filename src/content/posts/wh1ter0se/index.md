---
title: "eps1.7_wh1ter0se.m4v"
excerpt: "Time is an attack surface: clock drift, NTP, TOTP windows, certificate validity and why logs live in UTC."
date: "2026-09-23T15:23:18.000Z"
tags: ["engineering"]
cover: "./cover.jpg"
---

Time is the dependency nobody lists. TLS checks it. Kerberos checks it. Your one-time codes are computed from it. Your logs are only as useful as the timestamps on them. When a clock drifts, things fail in ways that look like anything except a clock problem: "invalid certificate", "token expired", "signature not yet valid", an incident timeline that makes no sense. Time is an attack surface, and it's also a reliability problem hiding in plain sight.

## What breaks when clocks are wrong

- **TLS.** Certificates have `notBefore` and `notAfter` dates. A client whose clock is in the past rejects valid certificates; a clock far in the future accepts nothing.
- **TOTP.** Authenticator codes are derived from the current 30-second window. Most servers tolerate one step of drift; beyond that, codes silently fail.
- **Kerberos and Active Directory.** Default maximum skew is five minutes. Beyond that, authentication stops.
- **Signed tokens.** JWT `exp`, `nbf` and `iat` claims, presigned cloud URLs, webhook signatures with timestamps. All of them assume your clock agrees with the issuer's.
- **Distributed systems.** Ordering events by wall-clock time across hosts is fragile even with good NTP. Use logical clocks or sequence numbers where order truly matters.

## Keep clocks honest with NTP

Every machine should sync time continuously, not once at boot. On most modern Linux systems that's `systemd-timesyncd` or `chrony`.

```bash
# is the clock synchronized?
timedatectl status

# chrony: current offset and the sources in use
chronyc tracking
chronyc sources -v
```

Look for `System clock synchronized: yes` and an offset in milliseconds, not seconds. Use several sources so one bad server can be outvoted, and in VMs and containers make sure someone, the host or the guest, is actually keeping time. NTP traffic isn't authenticated by default; where it matters, chrony supports NTS (Network Time Security), which adds authentication on top of NTP.

## Log in UTC. Always.

Timezones are a presentation concern. Store and log in UTC, in ISO 8601 with an explicit offset, and convert only when you show a time to a human.

```bash
# set servers to UTC
sudo timedatectl set-timezone UTC

# ISO 8601 timestamps from the shell
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Why it matters: daylight saving time creates an hour that happens twice and an hour that never happens. If your logs are in local time, an incident that crosses a DST change, or spans servers in two regions, becomes a puzzle. During an investigation you will be correlating firewall logs, application logs and cloud audit trails. They need one timeline.

## Certificate expiry is a scheduled outage

Expired certificates are the most predictable outage in the industry, and it still happens to everyone. Automate renewal (ACME with Let's Encrypt or your CA), and monitor expiry independently of the renewal job, because the renewal job is the thing that will break.

```bash
# days until a certificate expires
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \
  | openssl x509 -noout -enddate

# fail if it expires within 14 days (exit code 1)
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \
  | openssl x509 -noout -checkend $((14*86400))
```

Certificate lifetimes are getting shorter across the industry, which makes manual renewal untenable. Treat that as a feature: short-lived certificates force you to automate, and automation doesn't forget.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/wh1ter0se/01-root.jpg" class="kg-image" alt="A wall clock in a dark server room" loading="lazy"><figcaption>Every machine has an opinion about what time it is. Make them agree.</figcaption></figure>

## A short checklist

1. NTP or chrony running and synchronized on every host.
2. Servers in UTC; logs in ISO 8601 with offsets.
3. Alerts on clock offset above a threshold.
4. Automated certificate renewal, plus independent expiry monitoring.
5. Token validation with a small, explicit clock-skew allowance.

Time won't announce itself as the problem. You have to check.
