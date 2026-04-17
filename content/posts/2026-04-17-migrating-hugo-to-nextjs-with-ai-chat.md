---
title: "Migrating from Hugo to Next.js: Adding AI Chat to a Service Business Site"
date: 2026-04-17T08:00:00-05:00
draft: false
tags: ["next.js", "ai", "groq", "supabase", "web-development"]
---

We rebuilt a home services website from static Hugo to Next.js 15 with integrated AI chat in one afternoon. Here's what we learned about migration strategy, API integration, and the cache problems that almost derailed deployment.

## Why Migrate from Hugo?

Hugo is fantastic for static sites—fast, simple, deploy anywhere. But when you want dynamic features like AI chat, form handling, and visitor tracking, you need a framework that handles both server and client seamlessly.

Next.js 15 with App Router gives you:
- Server components for performance
- API routes for backend logic
- Streaming for real-time AI responses
- Easy deployment to Vercel

## The Migration Strategy

Rather than trying to convert Hugo templates directly, we:

1. **Ported content first** - Copied homepage, services pages, contact page content
2. **Built components** - Created React components for each section (Hero, Services, Trust, etc.)
3. **Added dynamic features** - Integrated chat widget, form handling, analytics hooks
4. **Deployed incrementally** - Tested on Vercel subdomain before switching custom domain

Total migration time: ~3 hours of focused work.

## Integrating Groq for AI Chat

We chose Groq's API for the chat widget because:
- Fast inference (LLaMA 3.3 70B responds in ~1-2 seconds)
- Simple REST API
- Affordable pricing
- Streaming support for real-time responses

### The Implementation

```typescript
// app/api/chat/route.ts
import Groq from "groq-sdk";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const stream = await groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    stream: true,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(new TextEncoder().encode(content));
        }
        controller.close();
      },
    })
  );
}
```

Client-side, we fetch with streaming and update the UI as tokens arrive:

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ messages }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  setMessages(prev => [...prev, { role: "assistant", content: text }]);
}
```

Users see responses appear word-by-word, just like ChatGPT.

## Logging Conversations with Supabase

We added Supabase to log every chat conversation for later review:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Log each message
await supabase.from("chat_conversations").insert({
  session_id: sessionId,
  role: message.role,
  content: message.content,
  metadata: { page: window.location.pathname }
});
```

This gives us:
- Full conversation history per visitor
- Ability to identify common questions
- Data for improving chat responses
- Lead qualification insights

## The Cache Problem That Almost Killed Us

After deploying to Vercel, the custom domain (fixxitpros.com) kept showing old Hugo content even after multiple deployments. The `.vercel.app` URL always showed fresh content, but the custom domain was aggressively cached.

### What Didn't Work

- Clearing Vercel's deployment cache
- Adding cache-control headers in `vercel.json`
- Setting `revalidate: 0` in page configs
- Meta tags for no-cache

### What Finally Worked

Aggressive no-cache headers at **every level**:

**vercel.json:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        { "key": "Pragma", "value": "no-cache" },
        { "key": "Expires", "value": "0" }
      ]
    }
  ]
}
```

**next.config.ts:**
```typescript
const nextConfig = {
  generateBuildId: async () => {
    return `build-${Date.now()}`; // Force unique build ID
  }
};
```

**layout.tsx:**
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

Even with all this, we still needed to wait for DNS/CDN propagation (15-30 minutes) before the custom domain reflected changes consistently.

## Key Learnings

1. **Migration over rewrite** - Port content first, rebuild features second
2. **Test on subdomain** - Always verify on `.vercel.app` before switching custom domains
3. **Cache is the enemy** - Custom domains with CDNs require aggressive cache-busting
4. **Streaming matters** - Real-time AI responses feel significantly better than waiting for full completion
5. **Log everything** - Chat conversations are gold for understanding customer intent

## What's Next

Now that the foundation is built, we're adding:
- Visitor tracking (page views, time on site, interaction patterns)
- Lead capture and scoring
- Email automation triggered by chat conversations
- Admin dashboard for managing leads and reviewing chats

The goal: turn the website into a self-contained CRM that tracks every touchpoint and automatically qualifies leads before they ever pick up the phone.

---

**Tech Stack:** Next.js 15, Groq API (LLaMA 3.3 70B), Supabase, Vercel, TypeScript

**Time to Build:** ~3 hours for migration + chat integration

**Cost:** ~$30/month (Vercel Pro + Supabase free tier + Groq pay-as-you-go)
