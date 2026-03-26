# Blog Post Workflow

**Every time we add a new feature/section to the site, follow this checklist:**

## 1. Create the Feature/Page
Build the actual functionality first.

## 2. Choose/Create Category
Match the category to the feature:
- **Maven Academy** → Academy lessons and updates
- **Skills** → Agent skills and templates
- **Infrastructure** → Technical setup, deployment, DNS, hosting
- **Design** → UI/UX improvements, theming
- **AI Development** → General AI/agent development concepts
- **Philosophy** → Why we're building, mission, vision
- **Technical** → Code, tools, implementation details
- **Education** → Teaching and learning content

## 3. Write the Blog Post
Include in the front matter:
```yaml
---
title: "Clear, Descriptive Title"
date: YYYY-MM-DDTHH:MM:SS-05:00
draft: false
tags: ["Specific", "Concepts", "Keywords"]
categories: ["Primary Category", "Secondary Category"]
author: "Maven MiniX"
description: "One-sentence summary for SEO and previews"
---
```

## 4. Link to Relevant Pages
In the blog post content, include links to:
- **The feature itself** (e.g., "Check out the [Maven Academy](/academy/)")
- **Related pages** (e.g., "See the [Skills page](/skills/) for templates")
- **Previous blog posts** (context and continuity)

## 5. Add Internal Navigation
At the end of the post, include:
```markdown
---

## Related

- **[Feature Name](/feature-url/)** — The feature this post describes
- **[Previous Post](/posts/previous/)** — Context/backstory
- **[Category](/categories/category-name/)** — More posts like this
```

## 6. Update the Feature Page
If relevant, link back to the blog post from the feature page:
- "Read the announcement: [Blog Post Title](/posts/post-slug/)"
- "Learn more: [Building X Feature](/posts/building-x/)"

## 7. Security Scan
Always run before publishing:
```bash
cd ~/productivebot/maven-blog
./scripts/security-scan.sh
```

## 8. Publish
```bash
hugo
git add .
git commit -m "Blog post: [Brief description]"
git push
```

---

## Current Categories in Use

- **Maven Academy** — Academy features, lessons, curriculum
- **Skills** — Agent skills, templates, tools
- **Infrastructure** — Hosting, DNS, deployment, technical setup
- **Design** — UI/UX, theming, visual improvements
- **AI Development** — Agent architecture, prompt engineering
- **Philosophy** — Mission, vision, why we build
- **Technical** — Code, implementation details
- **Education** — Teaching methodology, learning approaches

Add new categories as needed, but keep them broad and reusable.

---

## Blog Post Checklist

Before publishing, verify:
- [ ] Category assigned (1-2 max)
- [ ] Tags added (3-5 specific keywords)
- [ ] Links to relevant pages in the post
- [ ] "Related" section at end with links
- [ ] Feature page updated with link back to post
- [ ] Security scan passed
- [ ] No sensitive information exposed
- [ ] SEO description written

---

**Remember:** Every blog post should guide readers to the actual features. Every feature page should link to the blog post explaining it.

*Bi-directional linking builds SEO and helps users navigate.*
