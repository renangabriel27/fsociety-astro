---
title: "eps2.2_init_1.asec"
excerpt: "The fsociety theme style guide: palette, typography, editor cards and every option you can flip in src/config.ts."
date: "2026-10-03T15:23:18.000Z"
tags: ["culture"]
cover: "./cover.jpg"
---

This post collects **the visual elements of the fsociety theme** and **the options you can change in `src/config.ts`**. Use it as a reference when writing: most of it is plain Markdown, and the cards further down are short HTML snippets you can paste into any post.

## Palette

The theme is built for the dark: near-black surfaces, warm off-white text, and one red that shows up only where it matters (cursor, links, buttons, focus and the occasional glitch). The blue comes from the Kali terminal prompt.

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;font-family:var(--font-mono);font-size:1.3rem;">
  <div><div style="height:56px;border-radius:2px;background:#0a0a0a;border:1px solid #2a2a2a"></div><div style="margin-top:6px;color:#e8e6e3">Background</div><div style="color:#8a8886">#0a0a0a</div></div>
  <div><div style="height:56px;border-radius:2px;background:#121212;border:1px solid #2a2a2a"></div><div style="margin-top:6px;color:#e8e6e3">Surface</div><div style="color:#8a8886">#121212</div></div>
  <div><div style="height:56px;border-radius:2px;background:#e8e6e3"></div><div style="margin-top:6px;color:#e8e6e3">Text</div><div style="color:#8a8886">#e8e6e3</div></div>
  <div><div style="height:56px;border-radius:2px;background:#8a8886"></div><div style="margin-top:6px;color:#e8e6e3">Muted</div><div style="color:#8a8886">#8a8886</div></div>
  <div><div style="height:56px;border-radius:2px;background:#e0182d"></div><div style="margin-top:6px;color:#e8e6e3">fsociety red</div><div style="color:#8a8886">#e0182d</div></div>
  <div><div style="height:56px;border-radius:2px;background:#4d8dff"></div><div style="margin-top:6px;color:#e8e6e3">Prompt: path</div><div style="color:#8a8886">#4d8dff</div></div>
</div>

The red comes from `site.accentColor` in `src/config.ts`. Recommended: `#E0182D`.

## Typography

Headings and body text are set in **Archivo**. Post titles, metadata, the terminal prompt and code are set in `JetBrains Mono`, so every title reads like a filename.

A paragraph with **bold**, _italic_, [a link](https://astro.build) and `inline code`. Body text sits slightly off pure white, which keeps long reads comfortable on a black background.

## Heading level 2

Use H2 for the main sections of a post.

### Heading level 3

Use H3 for subsections.

#### Heading level 4

Use H4 for smaller groups.

## Title your posts like episodes

fsociety works best when every post title is an episode filename: `epsS.E_name.ext`. Season and episode, an underscore, a name in leetspeak if you like, and an extension. The extension tells you the season:

- **Season 1** — video containers: `.mov` `.mpeg` `.mkv` `.mp4` `.wmv` `.asf` `.flv` `.m4v` `.qt` `.avi`.
- **Season 2** — encryption formats, like `.tc`, `.ksd` and `.asec`.
- **Season 3** — code and archive files.
- **Season 4** — HTTP 4xx status codes. The theme's 404 page mirrors this season.

This post itself is `eps2.2_init_1.asec`.

## Lists

- Unordered list item
- Second item with **bold**
- Third item

1. First step
2. Second step
    1. Sub-step
3. Third step

## Quotes

> Default quote: italic, light text and a red bar on the left.

<blockquote class="kg-blockquote-alt">Alternative quote: larger and without the bar. Use a <code>blockquote</code> with the <code>kg-blockquote-alt</code> class.</blockquote>

## Code

Code blocks use JetBrains Mono on a dark surface. Keep lines short; long lines scroll horizontally instead of wrapping.

```bash
sudo apt update && sudo apt upgrade -y
sudo ss -tulpn
```

```javascript
// Greeting with a template string
const greet = (name = "friend") => `Hello, ${name}.`;
```

```
root@fsociety:~# whoami
root
```

## Images

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/style-guide/05-logs.jpg" class="kg-image" alt="Image at text width" loading="lazy" width="1600" height="1000"><figcaption>Image at text width, with a caption.</figcaption></figure>

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/images/style-guide/06-fsociety.jpg" class="kg-image" alt="Wide image" loading="lazy" width="1600" height="900"><figcaption>Wide image (the image card's <em>Wide</em> option).</figcaption></figure>

<figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image"><img src="/images/style-guide/07-ones-zeroes.jpg" width="800" height="600" loading="lazy" alt=""></div><div class="kg-gallery-image"><img src="/images/style-guide/08-backup.jpg" width="800" height="600" loading="lazy" alt=""></div><div class="kg-gallery-image"><img src="/images/style-guide/01-root.jpg" width="800" height="600" loading="lazy" alt=""></div></div></div><figcaption>A gallery with three images.</figcaption></figure>

## Cards

Cards are HTML inside the Markdown. Copy one from this post's source (`src/content/posts/style-guide/index.md`) and change the text: the `kg-*` classes give them their styles, and toggles open and close on their own.

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">💡</div><div class="kg-callout-text">Accent callout, for tips and important notes.</div></div>

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📌</div><div class="kg-callout-text">Grey callout, for neutral remarks.</div></div>

<div class="kg-card kg-button-card kg-align-center"><a href="/rss.xml" class="kg-btn kg-btn-accent">Follow via RSS</a></div>

<div class="kg-card kg-toggle-card" data-kg-toggle-state="close"><div class="kg-toggle-heading"><h4 class="kg-toggle-heading-text">Frequently asked question (toggle)</h4><button class="kg-toggle-card-icon" aria-label="Expand toggle to read content"><svg id="Regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="cls-1" d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311"></path></svg></button></div><div class="kg-toggle-content">The answer stays hidden until the reader clicks.</div></div>

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://docs.astro.build/"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Astro — official documentation</div><div class="kg-bookmark-description">Bookmark card with a title, description, metadata and thumbnail.</div><div class="kg-bookmark-metadata"><span class="kg-bookmark-author">Astro</span><span class="kg-bookmark-publisher">docs.astro.build</span></div></div><div class="kg-bookmark-thumbnail"><img src="/images/style-guide/02-kernel-panic.jpg" alt="" onerror="this.style.display = 'none'"></div></a></figure>

<table><thead><tr><th>Element</th><th>Font</th><th>Color</th></tr></thead><tbody><tr><td>Post titles</td><td>JetBrains Mono</td><td><code>#e8e6e3</code></td></tr><tr><td>Body</td><td>Archivo</td><td><code>#e8e6e3</code></td></tr><tr><td>Metadata</td><td>JetBrains Mono</td><td><code>#8a8886</code></td></tr><tr><td>Prompt path</td><td>JetBrains Mono</td><td><code>#4d8dff</code></td></tr></tbody></table>

---

## Theme options

All of them live in **`src/config.ts`**: the `theme` object holds the look, `site` the title, menus and social links, and `newsletter` the signup block. Change a value and rebuild.

<table>
<thead><tr><th>Option</th><th>What it does</th><th>Default</th></tr></thead>
<tbody>
<tr><td><code>theme.terminalPrompt</code></td><td>user@host of the terminal prompt. The user <code>root</code> gets a <code>#</code> prompt; anyone else gets <code>$</code>.</td><td><code>root@fsociety</code></td></tr>
<tr><td><code>theme.promptSearch</code></td><td>Title search in the prompt on the home, tag and author pages: type after the prompt and the post list is filtered.</td><td><code>true</code></td></tr>
<tr><td><code>theme.showBlinkingCursor</code></td><td>Blinking red block cursor in the prompt.</td><td><code>true</code></td></tr>
<tr><td><code>theme.glitchEffects</code></td><td>RGB-split glitch on titles when hovered.</td><td><code>true</code></td></tr>
<tr><td><code>theme.crtScanlines</code></td><td>Faint CRT scanlines and vignette over the whole site.</td><td><code>true</code></td></tr>
<tr><td><code>theme.footerTagline</code></td><td>Line shown in the footer and quoted on the 404 page.</td><td>"Control is an illusion."</td></tr>
<tr><td><code>theme.showHomeIntro</code></td><td>Big greeting at the top of the home page.</td><td><code>true</code></td></tr>
<tr><td><code>theme.introGreeting</code></td><td>The greeting, typed like a terminal line.</td><td>"Hello, friend."</td></tr>
<tr><td><code>theme.homeIntroText</code></td><td>Text below the greeting.</td><td>Site description</td></tr>
<tr><td><code>theme.typingAnimation</code></td><td>Types the greeting letter by letter.</td><td><code>true</code></td></tr>
<tr><td><code>theme.episodeNumbers</code></td><td>Numbers posts like episodes, ten per season, oldest first: the oldest post is <code>eps1.0</code>.</td><td><code>true</code></td></tr>
<tr><td><code>theme.showAuthor</code></td><td>Author name in the post list.</td><td><code>true</code></td></tr>
<tr><td><code>theme.showReadingTime</code></td><td>Reading time in the post list.</td><td><code>true</code></td></tr>
<tr><td><code>theme.showPublishDate</code></td><td>Publish date in the post list.</td><td><code>true</code></td></tr>
<tr><td><code>theme.showBreadcrumb</code></td><td>Shell breadcrumb at the top of posts and pages.</td><td><code>true</code></td></tr>
<tr><td><code>theme.showRelatedArticles</code></td><td>Related posts that share tags with the current one.</td><td><code>true</code></td></tr>
<tr><td><code>newsletter.action</code></td><td>Form endpoint of your newsletter service (Buttondown, ConvertKit…). Empty hides the newsletter block.</td><td>Empty</td></tr>
<tr><td><code>newsletter.heading</code></td><td>Heading of the newsletter block (end of posts and footer).</td><td>"Join fsociety"</td></tr>
<tr><td><code>newsletter.subheading</code></td><td>Text of the newsletter block.</td><td>Site description</td></tr>
<tr><td><code>newsletter.showOnPosts</code></td><td>Newsletter block at the end of posts.</td><td><code>true</code></td></tr>
</tbody>
</table>

## Recommended setup

- **Accent color** (`site.accentColor`): `#E0182D`.
- **Primary navigation** (`site.navigation`): a few short items, such as Home, a couple of tags and whoami. Items that don't fit go into the `⋮` menu.
- **Secondary navigation** (`site.secondaryNavigation`): footer links, e.g. whoami and RSS.
- **Social links** (`site.social`): filled-in profiles show up as icons in the footer.
- **Site title** (`site.title`): set in mono after a red block. A short lowercase title like `fsociety` works best.
- **Tags** (`src/data/tags.json`): the first tag of a post is its primary tag, shown in the metadata and the breadcrumb; related posts use shared tags.
- **Authors** (`src/data/authors.json`): posts without `authors` in their frontmatter use `site.defaultAuthor`.
