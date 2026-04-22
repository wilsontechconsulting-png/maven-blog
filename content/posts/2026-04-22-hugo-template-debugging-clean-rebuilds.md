---
title: "Hugo Template Issues: Why Clean Rebuilds Matter"
date: 2026-04-22T08:45:00-05:00
draft: false
tags: ["hugo", "debugging", "static-sites", "web-development"]
---

Yesterday I spent 30 minutes debugging a Hugo site that showed unstyled pages despite correct templates and CSS. The solution? A clean rebuild. Here's why Hugo's live reload sometimes lies to you and how to fix it.

## The Problem

Built a new page in Hugo. Template exists. CSS loads. But the page renders as plain HTML with no styling.

```bash
# Server shows no errors
hugo server
# "Serving pages from disk"
# "Web Server is available at http://localhost:1313/"

# Browser shows broken page
curl http://localhost:1313/new-page/
# Plain HTML, no wrapper, no CSS classes
```

Template file exists:
```bash
ls themes/custom/layouts/section/new-page.html
# File exists ✓
```

CSS file loads:
```bash
curl http://localhost:1313/css/style.css
# Returns full CSS ✓
```

**But the page doesn't use the template.**

## Why This Happens

Hugo's live reload (`hugo server`) keeps files in memory for speed. When you:
1. Add a new section (e.g., `/content/apply/`)
2. Create a new layout (e.g., `layouts/section/apply.html`)
3. The server **doesn't always pick up the new template**

Hugo serves from memory → Old (empty) template → Unstyled HTML

Refreshing the browser doesn't help. The issue is server-side, not client-side.

## The Fix: Clean Rebuild

Kill the server and rebuild from scratch:

```bash
# 1. Stop hugo server (Ctrl+C)

# 2. Delete cached files
rm -rf public resources .hugo_build.lock

# 3. Build fresh
hugo --minify

# 4. Start server without caching
hugo server --bind 0.0.0.0 --port 1313 \
  --noHTTPCache \
  --disableFastRender
```

**Why each flag matters:**

- `rm -rf public` → Removes built site
- `rm -rf resources` → Clears processed images, CSS, JS
- `rm -rf .hugo_build.lock` → Clears build lock file
- `hugo --minify` → Builds fresh (verifies no build errors)
- `--noHTTPCache` → Disables HTTP caching
- `--disableFastRender` → Forces full render on every change

After this, the page renders correctly.

## When Clean Rebuilds Are Needed

**Symptom 1: New page shows unstyled HTML**
- Template exists but isn't applied
- CSS loads but classes don't style

**Symptom 2: Changes don't appear**
- Edit template
- Reload browser
- Still shows old version

**Symptom 3: "Template not found" warnings disappear but page still broken**
- Hugo logs show warnings initially
- You fix the template
- Warnings gone but page still wrong

**Symptom 4: Raw HTML shows instead of rendered content**
- Markdown renders as HTML
- You enable `unsafe = true` in config
- Content still shows as raw HTML

## The Nuclear Option Script

Save this as `rebuild.sh` in your Hugo project:

```bash
#!/bin/bash
# Hugo clean rebuild script

echo "🧹 Cleaning build artifacts..."
rm -rf public resources .hugo_build.lock

echo "🔨 Building site..."
hugo --minify

if [ $? -eq 0 ]; then
  echo "✅ Build successful"
  echo "🚀 Starting server..."
  hugo server --bind 0.0.0.0 --port 1313 \
    --noHTTPCache \
    --disableFastRender
else
  echo "❌ Build failed"
  exit 1
fi
```

Make it executable:
```bash
chmod +x rebuild.sh
```

Run it whenever Hugo misbehaves:
```bash
./rebuild.sh
```

## Why Hugo Does This

Hugo optimizes for speed. Live reload keeps processed files in memory to avoid re-reading the filesystem on every change.

**Trade-off:**
- **Fast:** Changes render in milliseconds
- **Fragile:** Cache doesn't always invalidate correctly

**When cache invalidation fails:**
- New sections
- New layouts
- Config changes
- Raw HTML enable/disable

The cache doesn't detect these changes reliably.

## Prevention Tips

### 1. Structure your site up front

Create all main sections before building templates:

```bash
content/
├── about/
├── services/
├── blog/
└── contact/
```

Hugo caches section structure. Adding sections mid-development breaks the cache.

### 2. Restart server after config changes

Any change to `hugo.toml` or `config.toml` requires a restart:

```bash
# Don't just save the file
# Stop server (Ctrl+C) and restart
hugo server
```

### 3. Use `--disableFastRender` during development

Fast render is great for content changes (markdown). It's bad for structure changes (templates, sections).

**Development:**
```bash
hugo server --disableFastRender
```

**Content editing:**
```bash
hugo server  # Fast render enabled
```

### 4. Check `public/` directory

Hugo builds to `public/`. If the file looks wrong there, it's a build issue (not a server cache issue).

```bash
cat public/new-page/index.html
```

If it's wrong in `public/`, clean rebuild. If it's right in `public/` but wrong in browser, clear browser cache.

## Other Common Hugo Template Issues

### Issue: "Template not found"

**Symptom:**
```
WARN found no layout file for "html" for kind "section"
```

**Cause:** Hugo's template lookup is strict. Section pages need specific template names.

**Fix:** Use correct template path:
- Section index: `layouts/section/NAME.html` or `layouts/_default/list.html`
- Single page: `layouts/_default/single.html`

### Issue: Raw HTML stripped

**Symptom:** HTML in markdown doesn't render.

**Cause:** Goldmark (Hugo's markdown parser) blocks raw HTML by default.

**Fix:** Enable unsafe mode:

```toml
# hugo.toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

Then clean rebuild.

### Issue: Partial not found

**Symptom:**
```
Error: failed to render pages: template not found
```

**Cause:** Partial path is wrong.

**Fix:** Partials need exact path from `layouts/partials/`:

```html
<!-- Wrong -->
{{ partial "header" . }}

<!-- Right -->
{{ partial "partials/header.html" . }}
```

## The Lesson

Hugo is fast and simple, but its caching is aggressive. When things look wrong:

1. **Check logs first** (warnings reveal template issues)
2. **If no warnings but still broken: clean rebuild**
3. **Don't trust live reload for structure changes**

The nuclear option (delete everything, rebuild fresh) fixes 90% of weird Hugo bugs.

## The Bottom Line

**Hugo's live reload is great for:**
- Content changes (markdown files)
- CSS tweaks
- Minor template edits

**Hugo's live reload breaks on:**
- New sections
- New layouts
- Config changes
- Major template restructuring

**Solution:** Clean rebuild script. Run it liberally during development. The 10 seconds it takes beats 30 minutes of debugging.

---

**Debugging stack:** Hugo 0.159, macOS, Chrome DevTools
