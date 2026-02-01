# GetPersonalBrand MVP Design

**Date:** 2026-01-28
**Status:** Approved

## Overview

GetPersonalBrand is a web app that lets professionals create a branded personal website combining link-in-bio, about page, and portfolio into one tool. Users manually enter their information and use a drag-and-drop editor to build their site.

## Key Decisions

- **Target:** Product/startup with paying customers (eventually)
- **Team:** Solo founder - prioritize speed and simplicity
- **Data Entry:** Manual entry (no LinkedIn API complexity)
- **Value Prop:** All-in-one consolidation (replace Linktree + Bio site + Portfolio)
- **MVP Scope:** Links + Bio + Portfolio (3-in-1)
- **Monetization:** Free-only MVP, validate first
- **Domains:** Subdomain + custom domain support from day one
- **Editor:** Full drag-and-drop builder
- **Analytics:** Full dashboard with views, clicks, referrers, charts

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Database:** PostgreSQL (Vercel Postgres or Supabase)
- **Storage:** Vercel Blob or S3 for images
- **Auth:** NextAuth.js (email/password + Google OAuth)
- **Drag-and-Drop:** dnd-kit
- **Charts:** Recharts
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Architecture

### Multi-tenant Site Serving

```
username.getpersonalbrand.com  →  renders user's site
customdomain.com               →  renders mapped user's site
app.getpersonalbrand.com       →  dashboard/editor
```

### Data Model

```sql
users:
  - id (uuid, primary key)
  - email (unique)
  - password_hash
  - name
  - username (unique, for subdomain)
  - created_at

sites:
  - id (uuid, primary key)
  - user_id (foreign key)
  - content (jsonb - blocks array)
  - theme (jsonb - colors, fonts)
  - published (boolean)
  - created_at
  - updated_at

domains:
  - id (uuid, primary key)
  - site_id (foreign key)
  - domain (unique)
  - status (pending_verification, verified, failed)
  - verified_at

analytics_events:
  - id (uuid, primary key)
  - site_id (foreign key)
  - event_type (page_view, link_click)
  - link_id (nullable)
  - referrer
  - country
  - device_type
  - timestamp
```

## Block Types

1. **Hero** - Photo, name, headline, short bio
2. **About** - Longer text section, markdown support
3. **Links** - List of social/external links with icons
4. **Portfolio Grid** - Project cards with image, title, description, link
5. **Contact** - Email button, calendar link, contact form
6. **Divider/Spacer** - Visual separation

## Site Content Structure

```json
{
  "theme": {
    "primaryColor": "#2563eb",
    "font": "inter",
    "template": "modern"
  },
  "blocks": [
    {
      "id": "block-1",
      "type": "hero",
      "data": {
        "name": "Eric Smith",
        "headline": "Founder & Developer",
        "bio": "Building tools for creators",
        "imageUrl": "/uploads/profile.jpg"
      }
    },
    {
      "id": "block-2",
      "type": "links",
      "data": {
        "links": [
          { "id": "l1", "label": "Twitter", "url": "https://twitter.com/...", "icon": "twitter" },
          { "id": "l2", "label": "LinkedIn", "url": "https://linkedin.com/...", "icon": "linkedin" }
        ]
      }
    }
  ]
}
```

## User Flow

1. Sign up (email or Google OAuth)
2. Choose username (subdomain)
3. Pick template
4. Quick setup wizard (photo, headline, bio, links)
5. Land in editor with pre-populated content
6. Publish - site live instantly
7. Optionally add custom domain

## Analytics Dashboard

- Overview cards: total views, unique visitors, top referrer
- Time-series chart: views over time
- Top links: click counts per link
- Referrers table
- Device breakdown (mobile/desktop)

## Custom Domain Flow

1. User enters domain in dashboard
2. Show DNS instructions (CNAME to cname.getpersonalbrand.com)
3. Poll for DNS verification
4. Call Vercel API to add domain
5. SSL auto-provisioned
6. Domain goes live

## Templates

Start with 3 templates:
1. **Modern** - Clean, minimal, lots of white space
2. **Bold** - Darker theme, stronger typography
3. **Classic** - Traditional professional look

Templates are pre-populated block arrays with different theme settings.

## File Structure

```
/app
  /(app)                    # Dashboard routes (app.getpersonalbrand.com)
    /dashboard
    /editor
    /settings
    /analytics
  /(site)                   # Published site routes (subdomains/custom domains)
    /[...slug]
  /api
    /auth
    /sites
    /domains
    /analytics
    /upload
/components
  /editor                   # Drag-and-drop editor components
  /blocks                   # Block renderers (Hero, Links, etc.)
  /dashboard                # Dashboard UI components
  /site                     # Published site components
/lib
  /db                       # Database client and queries
  /auth                     # Auth configuration
  /analytics                # Analytics helpers
/middleware.ts              # Route based on hostname
```
