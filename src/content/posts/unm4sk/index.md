---
title: "eps2.0_unm4sk-pt1.tc"
excerpt: "Metadata will unmask you. EXIF, document properties and browser fingerprints, and how to strip them."
date: "2026-09-29T15:23:18.000Z"
tags: ["privacy"]
featured: true
cover: "./cover.jpg"
---

You can hide your name and still be found. The photo you posted has GPS coordinates in it. The PDF you shared lists your full name, your employer's username format and the exact software you wrote it with. Your browser hands out enough small details to be recognized across sites without a single cookie. Metadata is data about data, and it's usually more revealing than the content itself. The good news: most of it is easy to see, and easy to remove.

## EXIF: your photos talk

Cameras and phones embed EXIF metadata in images: device make and model, lens, timestamps, sometimes the owner's name or serial number, and, if location is enabled, GPS coordinates precise to a few meters. Many big platforms strip EXIF on upload. Plenty of others don't: personal blogs, forums, direct file shares, email attachments, cloud folders.

```bash
# see everything embedded in a photo
exiftool IMG_2041.jpg

# just the interesting bits
exiftool -gps:all -model -datetimeoriginal -serialnumber IMG_2041.jpg
```

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/unm4sk/03-404.jpg" class="kg-image" alt="A photo with its metadata fields overlaid" loading="lazy"><figcaption>The picture is what you meant to share. The metadata is what you actually shared.</figcaption></figure>

## Documents remember who wrote them

Office files and PDFs carry author names, company, last-modified-by, creation tool and version, revision history, and sometimes tracked changes and comments you thought you'd deleted. In a corporate setting, author fields leak usernames, which reveal the naming convention for accounts. That's useful reconnaissance for anyone planning a phishing campaign, which is exactly why you should clean what you publish.

```bash
exiftool -a -G1 report.pdf | grep -Ei "author|creator|producer|company"
exiftool report.docx
```

Also check for content-level leaks that no metadata tool will catch: hidden sheets, hidden rows, speaker notes, and "redactions" made by drawing a black box over text that's still selectable underneath.

## How to strip it

`exiftool` can remove metadata in place. `mat2` (Metadata Anonymisation Toolkit) goes further, understanding many formats and cleaning them more thoroughly.

```bash
# remove all writable metadata from images (keeps an _original backup)
exiftool -all= *.jpg

# overwrite without backups, recursively
exiftool -all= -overwrite_original -r ./to-publish/

# mat2: inspect, then clean (writes file.cleaned.ext)
mat2 --show report.pdf
mat2 report.pdf photo.jpg slides.odp
```

Verify after cleaning by running `exiftool` again. For PDFs, re-exporting from a clean source is often more reliable than scrubbing. For phones, turn off location tagging in the camera app unless you actually want it.

## Browser fingerprinting

Even without cookies, a website can combine dozens of small signals into a fairly stable identifier: user agent, screen size, timezone, language, installed fonts, GPU details exposed by canvas and WebGL rendering, audio processing quirks, and more. No single value identifies you; the combination often does.

- **Blend in rather than stand out.** Ten privacy extensions can make you more unique, not less.
- **Use a browser with built-in protections.** Tor Browser makes every user look alike; Firefox's resist-fingerprinting mode and Brave's randomization reduce the signal.
- **Separate identities.** Different browser profiles or containers for work, personal and anything sensitive.
- **Test yourself** with the EFF's Cover Your Tracks to see how unique your browser looks.

## Habits worth keeping

1. Strip metadata before anything leaves your machine for a public place.
2. Add a metadata-cleaning step to the publishing pipeline of your site or docs.
3. Review documents for hidden content, not just metadata.
4. Assume anything you publish will be downloaded and inspected, byte by byte.

Privacy isn't one big secret. It's a thousand small details you chose not to leave behind.
