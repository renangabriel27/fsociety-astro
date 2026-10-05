---
title: "eps1.4_3xpl0its.wmv"
excerpt: "CVE, CVSS, KEV and SBOMs: how vulnerabilities are tracked, and a patch discipline that keeps up."
date: "2026-09-17T15:23:18.000Z"
tags: ["security"]
---

Every week a few hundred new vulnerabilities get published. You can't patch them all at once, and you shouldn't try to read them all. What you need is a system: know what you run, know which flaws matter, and fix the dangerous ones before someone uses them. Attackers don't need a zero-day when a two-year-old bug is still sitting unpatched on your edge. This post is about how vulnerabilities are tracked, and how to triage them without drowning.

## CVE: a name for every flaw

A CVE (Common Vulnerabilities and Exposures) ID is a unique identifier like `CVE-2021-44228`, the Log4Shell bug. It doesn't tell you how bad something is. It just makes sure everyone is talking about the same flaw. CVE IDs are assigned by CNAs (CVE Numbering Authorities), usually the vendor or project itself, and the records are enriched in databases such as the NVD and in vendor and distribution security trackers.

Your distribution's tracker is often the most useful view, because it tells you which package version in _your_ release fixes the issue. Backported fixes mean the version number may look old and still be patched.

## CVSS, KEV and EPSS: three different questions

<table>
<thead><tr><th>Signal</th><th>Answers</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td>CVSS</td><td>How severe is this in theory?</td><td>A 0–10 score from base metrics like attack vector, complexity and impact.</td></tr>
<tr><td>CISA KEV</td><td>Is it being exploited in the wild right now?</td><td>The Known Exploited Vulnerabilities catalog. If it's listed and you run it, it's urgent.</td></tr>
<tr><td>EPSS</td><td>How likely is exploitation soon?</td><td>A probability estimate from FIRST, useful for ranking a long backlog.</td></tr>
</tbody>
</table>

CVSS alone is a bad prioritization tool: a huge share of CVEs score "high" or "critical", and most of them will never be exploited. Combine signals. A 7.5 on an internet-facing service listed in KEV beats a 9.8 in a library function you never call.

## Know what you run: SBOMs and scanning

You can't patch what you don't know you have. A Software Bill of Materials (SBOM) is an inventory of every component in a build, direct and transitive, in a standard format like CycloneDX or SPDX. Generate one per release and keep it, so that next time a big CVE drops you can answer "are we affected?" in minutes instead of days.

```bash
# generate an SBOM for a container image or a directory
syft my-app:2.14.0 -o cyclonedx-json > sbom.json

# scan the SBOM (or the image directly) for known vulnerabilities
grype sbom:./sbom.json --only-fixed

# language-native audits
npm audit --omit=dev
pip-audit
bundle audit check --update
```

Run these in CI. Enable Dependabot or Renovate so updates arrive as small, reviewable pull requests instead of one terrifying quarterly upgrade.

## A patch discipline that actually works

1. **Inventory.** SBOMs for your apps, an asset list for your hosts. Unknown assets are where breaches live.
2. **Triage by exposure.** Internet-facing and in KEV first. Then high EPSS. Then everything else on a schedule.
3. **Set target windows.** For example: actively exploited and exposed within 48 hours, critical within 7 days, the rest in the next regular cycle. Write them down and measure them.
4. **Mitigate when you can't patch.** Disable the feature, restrict network access, add a WAF rule, rotate credentials. Mitigation buys time; it isn't a fix.
5. **Verify.** Rescan after patching. "We deployed it" and "it's fixed everywhere" are different statements.

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">⚠️</div><div class="kg-callout-text">"Not reachable" is a hypothesis, not a fact. Prove it, or patch anyway.</div></div>

## The point

Vulnerability management isn't glamorous. It's spreadsheets, scanners and small pull requests. But nearly every major breach story has the same line somewhere in the middle: a patch was available. Don't be that line.
