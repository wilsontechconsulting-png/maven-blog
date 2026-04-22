---
title: "Building a Membership Site with Hugo + Netlify Forms + Stripe Integration"
date: 2026-04-22T08:30:00-05:00
draft: false
tags: ["hugo", "netlify", "stripe", "static-sites", "web-development"]
---

Yesterday I built a complete membership site for a nonprofit organization using Hugo, Netlify Forms, and Stripe. The entire stack cost $0/month and deployed in under 2 hours. Here's how it works and why this stack is underrated.

## The Stack

**Hugo** (static site generator) + **Netlify** (hosting + forms) + **Stripe** (payments)

- **Cost:** $0/month (Netlify free tier: 100 form submissions/month)
- **Performance:** Instant page loads (static HTML)
- **Complexity:** Low (no database, no backend server)
- **Deployment:** Auto-deploy from GitHub

## Why This Stack?

The organization needed:
1. Public website (7 pages)
2. Membership application form
3. Payment processing ($195 assessment + $95/month membership)
4. Brand guidelines page with downloadable assets
5. Fast, simple, maintainable

**What we DIDN'T need:**
- User authentication (applications reviewed manually)
- Database (form submissions email to staff)
- Backend server (everything is static)
- Complex build pipeline (Hugo builds in seconds)

## The Architecture

### 1. Hugo Site Structure

```
content/
├── _index.md          # Homepage
├── about/
├── membership/
├── chapters/
├── brand-kit/
├── apply/             # Application form
└── membership-payment/ # Payment page

themes/
└── custom-theme/
    ├── layouts/
    │   ├── index.html
    │   ├── section/apply.html      # Form page
    │   └── partials/
    └── static/
        ├── css/
        └── images/
```

### 2. Netlify Forms Integration

The application form is pure HTML with one attribute:

```html
<form name="membership-application" 
      method="POST" 
      action="/membership-payment/" 
      netlify>
  
  <!-- Honeypot for spam -->
  <input type="hidden" name="form-name" value="membership-application" />
  <p hidden><label>Don't fill: <input name="bot-field" /></label></p>

  <!-- Form fields -->
  <input type="text" name="full_name" required />
  <input type="email" name="email" required />
  <textarea name="why_join" required></textarea>
  
  <button type="submit">Submit Application</button>
</form>
```

That's it. Netlify detects the `netlify` attribute and:
1. Captures form submissions
2. Emails them to configured address
3. Stores them in Netlify dashboard
4. Provides spam filtering

**No backend code needed.**

### 3. Stripe Payment Links

After form submission, users redirect to `/membership-payment/` with two Stripe links:

```html
<a href="https://buy.stripe.com/XXXXX" class="payment-button">
  Pay Assessment Fee ($195)
</a>

<a href="https://buy.stripe.com/YYYYY" class="payment-button">
  Set Up Monthly Membership ($95/month)
</a>
```

Stripe payment links are created in the Stripe dashboard (no code). They handle:
- One-time payments
- Recurring subscriptions
- Receipt emails
- Payment failures
- Customer portal

**Again, no backend code.**

## Implementation Details

### Clean Rebuild Process

Hugo's live reload sometimes fails when adding new sections. The fix:

```bash
cd project-dir
rm -rf public resources .hugo_build.lock
hugo --minify
hugo server --noHTTPCache --disableFastRender
```

This forces a complete rebuild and prevents stale cache issues.

### Brand Identity Integration

The site needed specific brand colors and typography. Hugo's CSS approach:

```css
:root {
  --primary-color: #0F111E;
  --accent-color: #22C55E;
  --secondary-color: #16A34A;
}

.hero-title {
  color: var(--primary-color);
  font-family: 'Inter', sans-serif;
}
```

Brand guidelines page includes:
- Color swatches with HEX/RGB/CMYK values
- Logo download links (Google Drive)
- Typography specimens
- Usage rules

### Handling HTML in Markdown

Hugo blocks raw HTML in markdown by default. Enable it:

```toml
# hugo.toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

This allows color swatches and download buttons in markdown content.

## Deployment

1. **GitHub repository** holds all code
2. **Netlify** connects to repo
3. **Build command:** `hugo --minify`
4. **Publish directory:** `public`
5. **Auto-deploy** on git push to `main`

Every push to GitHub triggers:
- Hugo build
- Deploy to CDN
- Live in ~30 seconds

## Cost Breakdown

**Free tier limits:**
- Netlify: 100 form submissions/month, 100GB bandwidth
- Stripe: 2.9% + $0.30 per transaction (standard)
- Hugo: Free (open source)
- GitHub: Free (public repos)

**When you outgrow free:**
- Netlify Pro: $19/month (1,000 submissions, priority support)
- Stripe: Same rates (no monthly fee)

For most small organizations, the free tier is enough.

## What I Learned

### 1. Static Sites Are Underrated for Forms

"Static" doesn't mean "can't accept input." Netlify Forms, Formspree, and Basin all provide form endpoints for static sites. You get:
- Spam filtering
- Email notifications
- Dashboard viewing
- CSV export

Without managing a database or server.

### 2. Stripe Payment Links Are Powerful

Before payment links, you needed:
- Backend server
- Stripe SDK
- Webhook handlers
- Customer portal
- Receipt logic

Now? Create a link in Stripe dashboard. Done.

### 3. Hugo's Template System Has Sharp Edges

Hugo is fast and simple, but:
- Live reload sometimes lies (shows old content)
- Template lookup is strict (section vs. list vs. single)
- Raw HTML blocked by default
- Cache invalidation requires manual intervention

**Solution:** Clean rebuild script (see above). Run it when things look wrong.

## When NOT to Use This Stack

This stack works for:
- Marketing sites
- Documentation
- Blogs
- Simple forms (contact, applications, surveys)
- Payment links (one-time or subscription)

This stack DOESN'T work for:
- User authentication (login/logout)
- Complex workflows (multi-step with state)
- Real-time features (chat, notifications)
- User-generated content (comments, forums)
- Database queries (search, filtering)

For those, you need a backend. But for membership sites where humans review applications? This stack is perfect.

## The Bottom Line

**Built in 2 hours:**
- 7-page static site
- Membership application form
- Payment integration
- Brand guidelines page
- Auto-deploy pipeline

**Cost:** $0/month (Netlify free tier)  
**Performance:** Instant (static HTML on CDN)  
**Maintenance:** Minimal (no database, no server)

If your site doesn't need user authentication or real-time features, consider going static. The simplicity pays dividends.

---

**Tech stack:** Hugo 0.159, Netlify Forms, Stripe Payment Links, GitHub Actions
