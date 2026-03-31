# SmartDrobe — Project Structure Guide

This document explains the purpose of each folder and key file in the SmartDrobe codebase. It is intended to help new contributors and developers get oriented quickly.

---

## Root Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration — image domains (Cloudinary, Unsplash), headers |
| `vercel.json` | Vercel deployment config — region (Mumbai), env var references, security headers |
| `.env.example` | Template for all required environment variables |
| `.env.local` | ⚠️ Your actual secrets — **never commit this file** |
| `tailwind.config.ts` | Tailwind CSS design tokens and theme |
| `tsconfig.json` | TypeScript config — includes `@/` path alias for `src/` |
| `PRD.md` | Product Requirements Document |
| `PROJECT_STRUCTURE.md` | This file — codebase architecture guide |
| `LICENSE` | MIT License |

---

## `src/app/` — Pages & API Routes

Next.js App Router. Every folder here becomes a URL route.

### Pages

| Folder | URL | Description |
|--------|-----|-------------|
| `app/page.tsx` | `/` | Landing page (public) |
| `app/dashboard/` | `/dashboard` | Main dashboard — style tips, features overview |
| `app/closet/` | `/closet` | Virtual wardrobe — add, view, delete items |
| `app/what-to-wear/` | `/what-to-wear` | AI outfit generation form + results |
| `app/profile/` | `/profile` | User profile — name, city, style preferences |
| `app/auth/login/` | `/auth/login` | Login form |
| `app/auth/signup/` | `/auth/signup` | Signup form |
| `app/auth/callback/` | `/auth/callback` | Supabase OAuth redirect handler |
| `app/auth/forgot-password/` | `/auth/forgot-password` | Password reset request |

### API Routes (`src/app/api/`)

All API routes are **server-side only** — they handle Supabase Service Role calls and never expose secrets to the browser.

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/wardrobe` | GET, POST | Fetch all wardrobe items / Add a new item |
| `/api/wardrobe/[id]` | DELETE | Remove a specific wardrobe item |
| `/api/upload` | POST | Upload image to Cloudinary |
| `/api/recommend` | POST | Generate AI outfit recommendation |
| `/api/user/preferences` | GET, PUT | Fetch/save style preferences |
| `/api/events` | POST | Log analytics events (silent) |

---

## `src/components/` — UI Components

### `components/layout/`
| File | Description |
|------|-------------|
| `app-shell.tsx` | Main app wrapper — sidebar navigation, mobile header, user info |

### `components/ui/`
shadcn/ui base components plus custom additions:
| File | Description |
|------|-------------|
| `loader.tsx` | Reusable loading components: `Loader`, `PageLoader`, `CardSkeleton`, `DashboardSkeleton`, `WardrobeGridSkeleton`, `OutfitSkeleton` |
| `button.tsx`, `card.tsx`, etc. | shadcn/ui primitives |

### Key Components

| File | Description |
|------|-------------|
| `onboarding-flow.tsx` | 5-step full-screen onboarding for new users (welcome → city → style → occasions → upload) |
| `closet-view.tsx` | Full wardrobe UI — grid view, "Add Item" dialog, AI analysis, color detection |
| `what-to-wear.tsx` | AI outfit generator — form inputs + animated result cards |
| `error-boundary.tsx` | React class component that catches render errors + shows recovery UI |
| `feedback-widget.tsx` | Floating bottom-right star rating + message form |
| `onboarding-dialog.tsx` | Simple first-visit dialog (legacy, shown inside closet) |

---

## `src/hooks/` — Custom React Hooks

| File | Description |
|------|-------------|
| `use-auth.tsx` | `AuthProvider` + `useAuth()` — manages Supabase session, signIn, signOut, signUp |
| `use-closet-store.tsx` | `ClosetProvider` + `useCloset()` — wardrobe state, fetches from `/api/wardrobe` |
| `use-toast.ts` | shadcn/ui toast hook |
| `use-language.tsx` | Optional language/i18n context |

---

## `src/lib/` — Shared Utilities & Services

| File | Description |
|------|-------------|
| `supabase/client.ts` | Supabase browser client (uses anon key) |
| `supabase/server.ts` | Supabase server client (uses service role key — never in browser) |
| `error-handler.ts` | `apiError()`, `withErrorHandling()`, `friendlyAuthError()`, `getToastError()`, `detectErrorType()` |
| `analytics.ts` | `trackEvent()` — fire-and-forget event logging to `/api/events` |
| `env-check.ts` | Validates all required env vars at startup |
| `image-upload.ts` | `uploadImage()` — sends file to `/api/upload`, returns Cloudinary URL |
| `weather.ts` | `getWeather(city)` — OpenWeatherMap API with 10-min in-memory cache |
| `utils.ts` | `cn()` — Tailwind class merger (from shadcn) |

---

## `src/ai/` — Genkit AI Flows

| Folder / File | Description |
|---------------|-------------|
| `flows/quick-outfit-generator.ts` | Takes occasion + weather + mood + closet items → returns 3 outfit suggestions |
| `flows/analyze-image.ts` | Takes uploaded image → returns category, color, description |
| `genkit.ts` | Genkit instance configuration with Gemini model |

---

## `src/types/` — TypeScript Definitions

| File | Key Types |
|------|-----------|
| `index.ts` | `WardrobeItem`, `WardrobeCategory`, `UserProfile`, `UserPreferences`, `OutfitItem`, `AnalyticsEvent`, `ApiError` |

Import anywhere with:
```ts
import type { WardrobeItem } from '@/types';
```

---

## `src/middleware.ts` — Route Protection

Runs on every request **before** it reaches the page. Redirects:
- Unauthenticated users → `/auth/login`
- Authenticated users accessing `/auth/*` → `/dashboard`

Uses Supabase SSR session cookies for server-side auth.

---

## Data Flow: Adding a Wardrobe Item

```
User selects photo
    │
    ▼
uploadImage() in lib/image-upload.ts
    │  POST /api/upload (multipart)
    ▼
/api/upload/route.ts
    │  Validates file type/size
    │  Uploads to Cloudinary
    ▼
Returns { url: "https://res.cloudinary.com/..." }
    │
    ▼
AI Analysis: POST /api/analyze (Gemini Vision)
    │  Returns { category, color, description, colors[] }
    │
    ▼
User confirms / edits form fields
    │
    ▼
POST /api/wardrobe
    │  Supabase INSERT into wardrobe_items
    │  Row includes: user_id (from session), name, category,
    │                color, colors, description, image_url, ai_hint
    ▼
useCloset() state refreshes → item appears in grid
```
