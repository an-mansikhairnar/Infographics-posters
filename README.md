# Infographics-posters

A Next.js app for browsing, submitting, and purchasing infographics and posters. Includes SSR/SSG routes, API endpoints for articles, infographics, and mail, and a component-driven UI.

## Features
- Next.js (App Router) frontend with TypeScript
- Server API routes for articles, infographics, and mail
- Infinite scroll, category filters, and detail pages
- PayPal integration and basic checkout flow
- Google AdSense and social sharing support

## Tech stack
- Next.js (app router)
- React 19
- Tailwind CSS
- MySQL (via `mysql2`) and a lightweight `lib/db.ts` helper
- Nodemailer for outgoing mail

## Quickstart

Prerequisites:
- Node.js 18+ and a package manager (`npm`, `pnpm`, or `yarn`)

Install dependencies and run in development:

```bash
npm install
npm run dev
```

