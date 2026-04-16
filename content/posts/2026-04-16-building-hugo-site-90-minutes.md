---
title: "We Built and Deployed a Complete Hugo Website in 90 Minutes"
date: 2026-04-16T08:00:00-05:00
draft: false
tags: ["web development", "hugo", "netlify", "automation", "ai-assisted development"]
---

Yesterday we took a home services business from "we need a website" to live production in about 90 minutes.

Not a landing page. A complete website: homepage, contact forms, service pages, legal pages, custom theme, mobile-responsive design, SEO optimization, and auto-deploy pipeline.

Here's what that looked like.

## The Stack

**Hugo** for the static site generator. Fast, simple, no database needed.

**Netlify** for hosting and deployment. We tried GitHub Pages first—ran into CSS path issues with Hugo's subdirectory structure. Switched to Netlify and everything just worked.

**GitHub** for version control and the deployment trigger.

The whole thing auto-deploys from the main branch. Push code, site rebuilds automatically.

## What We Built

- Homepage with hero section and service highlights
- 3 service pages (HVAC, Plumbing, Lawn Care)
- Contact page with working form
- "Looking for Work" page with two forms (contractor + employee applications)
- Privacy policy and terms of service
- Custom Hugo theme (not just a template)
- 17 images downloaded and integrated
- Email notifications for form submissions

All mobile-responsive. All SEO-optimized with proper meta tags, sitemap, and robots.txt.

## The Hard Parts

**Image icons were broken on the original site.** Replaced them with modern emoji icons:
- ✓ Vetted Professionals  
- 📅 Seamless Scheduling  
- 🤝 No-Stress Coordination  
- 💬 Ongoing Local Support  

Clean, works everywhere, no HTTP requests.

**GitHub Pages path issues.** Hugo generates sites in a subdirectory by default. GitHub Pages doesn't love that without extra config. CSS and images wouldn't load.

**Solution:** Switched to Netlify. Added a `netlify.toml` with build command and publish directory. Done.

**Netlify Forms detection.** Forms only work if Netlify builds from source (not from a pre-built folder). Once we pointed it at the Hugo source directory, forms were auto-detected.

## The Fast Parts

**AI-assisted development.** We didn't hand-code every page. We described what we wanted, generated the Hugo templates, refined them, and moved on.

**Hugo's speed.** The entire site builds in under a second. No webpack. No node_modules hell. Just fast.

**Netlify's deployment.** Push to GitHub, Netlify rebuilds, site is live. Zero manual steps.

## Why This Matters

Most small businesses don't need complex CMSs or heavy frameworks. They need:
- A fast site that works on mobile
- Contact forms that actually work
- Easy updates (Markdown files, not database queries)
- SSL and hosting that doesn't require a DevOps team

Hugo + Netlify delivers all of that in under two hours.

## What's Next

Domain needs to be pointed to Netlify (currently on `fantastic-yeot-a44fa9.netlify.app`). SSL is automatic once the domain is configured.

Form submissions need to be tested in production to confirm email notifications work.

But the site is live. It's fast. It works.

That's a good place to be 90 minutes in.

---

**Takeaway:** You don't need a week to build a website. You need the right stack and clear requirements. Hugo + Netlify + AI-assisted development = production-ready sites in hours, not days.
