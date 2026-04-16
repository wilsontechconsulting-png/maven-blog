---
title: "GitHub Pages vs Netlify: Why We Switched Mid-Deploy"
date: 2026-04-16T08:15:00-05:00
draft: false
tags: ["deployment", "netlify", "github pages", "hugo", "web hosting"]
---

We started deploying a Hugo site to GitHub Pages yesterday. CSS wouldn't load. Images were broken. Path issues everywhere.

Switched to Netlify. Everything worked immediately.

Here's why.

## The GitHub Pages Problem

GitHub Pages is free and works great for simple static sites. But Hugo generates sites in a subdirectory by default (`public/`), and GitHub Pages expects files at the repo root.

You can configure around this—set a custom base URL, adjust Hugo's config, use GitHub Actions to move files—but it's friction.

**The symptoms:**
- Site loads but CSS is missing
- Images return 404s
- Internal links break
- Everything works locally, fails in production

**The root cause:** Path configuration mismatch between Hugo's output structure and GitHub Pages' expectations.

You can fix it. But why?

## The Netlify Solution

**Step 1:** Create a `netlify.toml` file:

```toml
[build]
  command = "hugo"
  publish = "public"

[build.environment]
  HUGO_VERSION = "0.159.1"
```

**Step 2:** Push to GitHub.

**Step 3:** There is no step 3.

Netlify auto-detects the Hugo site, runs the build command, serves from the `public` directory, and enables forms automatically.

No path issues. No configuration wrestling. Just works.

## Form Handling

GitHub Pages doesn't handle forms. You need a third-party service (Formspree, Google Forms, custom backend).

Netlify has **Netlify Forms** built in. Add `netlify` or `data-netlify="true"` to your form tag. Netlify detects it during build, handles submissions, and sends email notifications.

We had three forms on the site (contact + two job applications). All three worked immediately after switching to Netlify.

## SSL and Custom Domains

Both GitHub Pages and Netlify offer free SSL with custom domains.

**GitHub Pages:** Add a CNAME file, configure DNS, wait for SSL to provision.

**Netlify:** Add the domain in the dashboard, update DNS, SSL provisions automatically.

Netlify's UX is slightly cleaner, but both work fine here.

## Build Control

**GitHub Pages:** Limited build control. You can use GitHub Actions for custom workflows, but it's extra setup.

**Netlify:** Explicit build configuration in `netlify.toml`. Set environment variables, specify build commands, control caching. Everything's in one place.

For Hugo sites (or any static generator with specific version requirements), this matters.

## Cost

Both are free for basic static sites.

**GitHub Pages:** Free for public repos. Private repos work too if you're on a paid GitHub plan.

**Netlify:** Free tier includes 100GB bandwidth/month and 300 build minutes/month. More than enough for most small sites.

Neither charges for SSL or CDN delivery.

## When to Use Each

**Use GitHub Pages if:**
- You want the simplest possible setup
- Your site is just HTML/CSS/JS (no build step)
- You're already hosting code on GitHub
- You don't need forms or serverless functions

**Use Netlify if:**
- You're using a static site generator (Hugo, Jekyll, Gatsby, etc.)
- You need forms without a backend
- You want more control over the build process
- You might add serverless functions later

For Hugo specifically? **Netlify.**

## The Real Lesson

We wasted about 30 minutes trying to debug GitHub Pages path issues before switching to Netlify.

In hindsight, we should've started with Netlify. Hugo + Netlify is the well-worn path for a reason.

**Use the tools that are designed to work together.** You'll spend less time debugging and more time shipping.

---

**Takeaway:** GitHub Pages is great for simple static sites. Netlify is better for static site generators like Hugo—especially when you need forms. Don't fight the tooling; pick the stack that matches your workflow.
