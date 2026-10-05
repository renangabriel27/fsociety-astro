---
title: "eps1.6_v1ew-s0urce.flv"
excerpt: "What your front end leaks: secrets in bundles, public source maps, comments and an exposed .git."
date: "2026-09-21T15:23:18.000Z"
tags: ["security"]
cover: "./cover.jpg"
---

Right-click, View Source. It's the oldest trick on the web, and it still works, because everything you ship to the browser belongs to whoever is using it. Your JavaScript, your source maps, your HTML comments, sometimes your whole Git history. Minification isn't secrecy; it's compression. Before someone else reads your front end with bad intentions, read it yourself. Here's what to look for, and how to stop leaking it.

## Secrets in JavaScript bundles

Bundlers inline environment variables at build time. That's the feature. It's also how a private API key ends up in `main.4f9a1c.js` for the entire internet to download. Frameworks try to protect you with prefixes (`NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`), but the rule is simpler than any prefix: **if the browser can read it, it's public**.

Publishable keys (a Stripe `pk_` key, a Maps key restricted by referrer, a Firebase config) are designed to be public. Secret keys, database URLs, admin tokens and signing secrets are not. Those belong on a server, behind an endpoint that checks who's asking.

```bash
# grep your own production build for things that shouldn't be there
grep -rEo "(sk_live_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)" dist/

# better: run a secret scanner over the build output and the repo
gitleaks dir dist/
trufflehog filesystem dist/ --only-verified
```

If you find a real secret, deleting it isn't enough. It's been cached, mirrored and maybe scraped. **Rotate it first**, then remove it.

## Source maps

Source maps turn minified code back into your original files, comments and all. Great for debugging, generous to everyone else. If `app.js` ends with `//# sourceMappingURL=app.js.map` and that file is served, your readable source is a click away in DevTools.

- Generate maps, but upload them privately to your error tracker instead of deploying them.
- In webpack, use `devtool: 'hidden-source-map'`; in Vite, `build.sourcemap: 'hidden'`. Both create maps without the public reference.
- Make sure the server returns 404 for `*.map` in production.

## Comments, debug routes and forgotten files

HTML comments with internal hostnames, TODOs like `<!-- temp admin login, remove before launch -->`, feature flags for unreleased products. Also the classics that end up in the web root by accident:

- `/.git/` — an exposed Git directory can let anyone reconstruct your repository, history and all.
- `/.env`, `/config.php.bak`, `/backup.zip`, `/.DS_Store`.
- `/phpinfo.php`, debug toolbars, verbose error pages with stack traces.

## Check your own site

Run these against sites you own and nothing else:

```bash
SITE=https://example.com

# exposed git metadata and env files should be 404 (or 403)
for p in .git/HEAD .env .DS_Store app.js.map; do
  printf '%s  %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$SITE/$p")" "$p"
done

# list the scripts the page loads, then inspect them
curl -s "$SITE" | grep -Eo 'src="[^"]+\.js"'
```

Then open DevTools: check the Sources panel for readable original files, and the Network panel for API responses that return more fields than the UI shows. Over-fetching is a leak too. If the profile page displays a name but the JSON includes the email, the role and a password reset token, the browser has all of it.

## Prevent it in the pipeline

1. Keep secrets in a secret manager or server-side environment, never in front-end env files.
2. Run a secret scanner as a pre-commit hook and in CI, over the repo and the build output.
3. Deploy from a build artifact, not by copying the project directory. The web root should contain only what you meant to publish.
4. Deny dotfiles at the web server: in nginx, `location ~ /\. { deny all; }` (allowing `/.well-known/` if you need it).
5. Strip HTML comments and disable debug output in production builds.

Assume everything you send is read. Then send less.
