---
title: "eps1.9_zer0-day.avi"
excerpt: "A zero-day just dropped. Triage, contain, communicate, patch, and write the postmortem nobody gets blamed in."
date: "2026-09-27T15:23:18.000Z"
tags: ["security"]
featured: true
cover: "./cover.jpg"
---

It always arrives the same way. A link in a group chat, a vendor advisory with no patch yet, a headline with a catchy name. A zero-day is a vulnerability that's being exploited before a fix is available, or before you've had time to apply it. You can't prevent it from existing. What you control is the next 72 hours: how fast you know whether you're exposed, how well you contain it, and how calmly you communicate. Panic is not a plan. This is.

## Hour 0: triage

Open an incident channel, name an incident commander, and start a timestamped log. Then answer three questions, in order:

1. **Do we run it?** Search your SBOMs, asset inventory, container images and cloud resources. This is where all that boring inventory work pays off.
2. **Is it exposed?** Internet-facing, reachable from untrusted networks, or only internal? Which version, which configuration?
3. **Is there evidence it was used against us?** Check logs for the indicators published in the advisory, going back to before the disclosure date. Exploitation usually starts before the news.

```bash
# which releases ship the affected component? (CycloneDX SBOMs)
for f in sboms/*.json; do
  jq -r --arg f "$f" '.components[]? | select(.name == "affected-package") | "\($f)  \(.version)"' "$f"
done

# which hosts have it installed?
ansible all -m shell -a "dpkg -l affected-package 2>/dev/null | tail -n1"
```

## Contain before you cure

If there's no patch yet, reduce exposure. Containment is about buying time without destroying evidence.

- Apply the vendor's mitigation: a config flag, a disabled module, an environment variable.
- Restrict network access: pull the service off the internet, allowlist source IPs, add a WAF rule for the known request pattern.
- Isolate suspected compromised hosts from the network, but **don't wipe them yet**. Snapshot disks and capture memory if you can.
- Rotate credentials and tokens the affected system could access. Assume anything it could read is now known.

## Communicate on a schedule

Silence breeds rumors. Post updates at a fixed cadence, every hour early on, even if the update is "no change". Keep separate audiences in mind:

<table>
<thead><tr><th>Audience</th><th>What they need</th></tr></thead>
<tbody>
<tr><td>Responders</td><td>Current status, owners, next actions, what not to touch.</td></tr>
<tr><td>Leadership</td><td>Exposure, business impact, decisions needed, next update time.</td></tr>
<tr><td>Customers</td><td>What's affected, what you're doing, what they should do. Facts only.</td></tr>
<tr><td>Legal and compliance</td><td>Whether personal data may be involved; notification deadlines may apply.</td></tr>
</tbody>
</table>

Never speculate in external communications. "We are investigating" is honest. "No data was accessed" before you've checked is a liability.

## Patch, verify, watch

When the fix ships, roll it out by exposure: internet-facing first. Verify each system actually runs the fixed version, then rescan. Keep heightened monitoring for weeks. Early patches are sometimes incomplete, and a follow-up CVE for the same component is common. If you found evidence of compromise, patching closes the door; it doesn't remove whoever already walked in. Rebuild affected systems from known-good images.

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">⚠️</div><div class="kg-callout-text">Patching a compromised host is not remediation. Rebuild it, rotate its secrets, and keep the evidence.</div></div>

## The blameless postmortem

Within a week, while memories are fresh, write it down. Blameless doesn't mean nobody is accountable; it means you assume people made reasonable decisions with the information they had, and you fix the system that gave them bad information.

- A timeline: detection, decisions, actions, with timestamps in UTC.
- What went well. Repeat it on purpose next time.
- Where you were slow: finding assets, getting approvals, reaching people.
- Action items with owners and dates, not "be more careful".

Control is an illusion. Preparation isn't. The teams that handle zero-days well aren't faster typists; they just did the inventory before they needed it.
