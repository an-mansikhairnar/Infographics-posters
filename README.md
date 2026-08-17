# Infographics Dashboard

A Next.js admin dashboard for managing infographic content, categories, article metadata, social links, and uploaded image assets.

## Overview

This project is designed for content administrators to:

- log in to an admin dashboard
- create and manage article entries
- organize articles by category
- update SEO metadata and social fields
- upload full-size and thumbnail images
- view infographic-related pages for design and client content

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- MySQL via `mysql2`
- Material UI
- Tailwind CSS
- JWT-based admin authentication

## Project Structure

```bash
app/
  api/                 # API routes for login, articles, categories, upload, etc.
  articles/            # Articles dashboard page
  category/            # Category management screen
  client-infographics/
  design-infographics/
  components/          # Reusable UI components
  hooks/               # Custom hooks
  interfaces/          # Type definitions
  lib/                 # Shared app logic and DB connection
  login/               # Login page
  page.tsx             # Root entry page
components/
public/images/         # Uploaded and stored image assets
middleware.ts
next.config.ts
package.json
```

## Features

- Admin login flow with JWT authentication
- Article CRUD via API routes
- Category handling
- Full image + thumbnail upload flow
- Metadata and social media field support
- Responsive dashboard layout
- Fixed local port configuration for running the app locally

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+
- npm
- MySQL server running

## Environment Variables

Create a `.env.local` file in the project root with values like:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=infographics_db
JWT_SECRET=your_secure_secret
```

The app reads these values from the environment when connecting to MySQL and generating JWT tokens.

## Installation

```bash
npm install
```

## Running the App

This project is configured to bind to a specific port for local development. The default port is set to `8080` unless `PORT` is overridden.

```bash
npm run dev
```

Or with an explicit port:

```bash
PORT=8080 npm run dev
```

## Default Local URL

The app is intended to run on:

```text
http://localhost:8080
```

If your environment uses a different host binding, adjust the host and port in the package script as needed.

## Database Notes

The connection is created in `app/lib/db.ts` and depends on these environment variables:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

If the database is not available, the API layer will fail while performing article or login actions.

## Scripts

```bash
npm run dev     # development server
```

