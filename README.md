<div align="center">

# 👗 SmartDrobe
### AI-Powered Digital Wardrobe & Outfit Recommendation SaaS

![SmartDrobe](https://img.shields.io/badge/SmartDrobe-v1.0-8B5CF6?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Stop asking "What do I wear?" — Let AI answer it for you.**

[Live Demo](#) · [Report Bug](https://github.com/yourusername/smartdrobe/issues) · [Request Feature](https://github.com/yourusername/smartdrobe/issues)

</div>

---

## 📌 Project Overview

SmartDrobe is a **production-ready SaaS application** that digitizes your physical wardrobe and uses Google Gemini AI to generate personalized daily outfit recommendations based on:

- 🌤️ **Real-time weather** in your city (OpenWeatherMap)
- 👗 **Your actual clothing** items (uploaded photos stored on Cloudinary)
- 🎨 **Your personal style preferences** (casual, minimal, Y2K, formal…)
- 📅 **The occasion** (work, date night, party, gym)
- 🔐 **Your private account** (Supabase Auth + Row-Level Security)

Every user gets their own private, secure wardrobe with cloud-stored images and AI recommendations that improve as they use the app.

---

## 📸 Screenshots

> _Add screenshots here after first deployment_

| Landing Page | Dashboard | Virtual Closet | AI Recommendations |
|---|---|---|---|
| `screenshot-landing.png` | `screenshot-dashboard.png` | `screenshot-closet.png` | `screenshot-ai.png` |

---

## ✨ Features

### Core
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Email/password signup & login via Supabase Auth |
| 👗 **Virtual Closet** | Upload outfit photos → AI auto-detects category, color & description |
| 🤖 **AI Stylist** | Weather + occasion + mood → personalized outfit recommendations |
| ☁️ **Cloud Storage** | Images stored on Cloudinary with auto-optimization |
| 🗄️ **Per-user Database** | PostgreSQL via Supabase with Row-Level Security |
| 👤 **Profile & Preferences** | City, style keywords, favorite colors, occasions |
| 🎯 **Onboarding Flow** | 5-step guided setup for new users |

### UX & Developer
| Feature | Description |
|---------|-------------|
| 💬 **Feedback Widget** | Floating star-rating feedback form on every page |
| 📊 **Analytics** | Silent event tracking (login, upload, generate, save) |
| 🛡️ **Error Handling** | Centralized error boundary + friendly toast messages |
| ⏳ **Loading States** | Skeleton loaders + spinners across all async operations |
| 📱 **Responsive** | Full mobile + desktop support |
| 🌙 **Dark/Light Mode** | System-aware theme switching |

---

## 🛠️ Tech Stack

```
Frontend:     Next.js 15 (App Router) + React 18 + TypeScript
Styling:      Tailwind CSS + shadcn/ui + Framer Motion
AI Engine:    Google Genkit + Gemini Flash
Auth & DB:    Supabase (PostgreSQL + Auth + RLS)
Image CDN:    Cloudinary (upload, transform, optimize)
Weather:      OpenWeatherMap API
Analytics:    Custom event table → Supabase user_events
Deployment:   Vercel (recommended)
```

---

## 🏗️ Architecture

```
Browser (React)
    │
    ├── Next.js App Router (src/app/)
    │       ├── Client Components  → UI, forms, state
    │       └── Route Handlers     → API endpoints (/api/*)
    │
    ├── Supabase
    │       ├── Auth               → sessions, JWT
    │       ├── PostgreSQL         → wardrobe, profiles, preferences
    │       └── RLS policies       → per-user data isolation
    │
    ├── Cloudinary
    │       └── Image upload, transform, CDN delivery
    │
    ├── Google Gemini AI (via Genkit)
    │       ├── Outfit generation  → /api/recommend
    │       └── Image analysis     → AI color + category detection
    │
    └── OpenWeatherMap
            └── Real-time weather → outfit context
```

---

## 📂 Folder Structure

```
smartdrobe/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/                # Server-side route handlers
│   │   │   ├── events/         # Analytics event logging
│   │   │   ├── recommend/      # AI outfit recommendation
│   │   │   ├── upload/         # Cloudinary image upload
│   │   │   ├── user/           # Profile & preferences
│   │   │   └── wardrobe/       # CRUD for wardrobe items
│   │   ├── auth/               # Login, signup, callback pages
│   │   ├── closet/             # Virtual closet page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── profile/            # User profile & preferences
│   │   └── what-to-wear/       # AI outfit generator page
│   │
│   ├── components/             # Reusable React components
│   │   ├── layout/             # AppShell, sidebar navigation
│   │   ├── ui/                 # shadcn/ui base components + Loader
│   │   ├── onboarding-flow.tsx # 5-step new user onboarding
│   │   ├── closet-view.tsx     # Main wardrobe management UI
│   │   ├── what-to-wear.tsx    # AI outfit recommendation UI
│   │   ├── feedback-widget.tsx # Floating feedback button
│   │   └── error-boundary.tsx  # React error boundary
│   │
│   ├── hooks/
│   │   ├── use-auth.tsx        # Auth context + Supabase session
│   │   └── use-closet-store.tsx# Wardrobe state management
│   │
│   ├── lib/
│   │   ├── supabase/           # Client & server Supabase instances
│   │   ├── analytics.ts        # Fire-and-forget event tracking
│   │   ├── error-handler.ts    # API errors + friendly messages
│   │   ├── env-check.ts        # Startup env validation
│   │   ├── image-upload.ts     # Cloudinary upload helper
│   │   └── weather.ts          # OpenWeatherMap with caching
│   │
│   ├── ai/                     # Genkit AI flows
│   │   └── flows/              # Outfit generation, image analysis
│   │
│   ├── types/
│   │   └── index.ts            # Global TypeScript interfaces
│   │
│   └── middleware.ts           # Route protection (auth guard)
│
├── docs/                       # Product documentation
│   ├── deployment.md
│   ├── case-study.md
│   └── personas.md
│
├── .env.example                # Environment variable template
├── vercel.json                 # Vercel deployment config
└── scripts/                    # Utility scripts
    ├── seed-wardrobe.js        # Starter data seeding script
    ├── seed-aesthetic.js       # Aesthetic seeding script
    └── run-schema.js           # Schema application script

> See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for a detailed explanation of each folder.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service key (server-side only) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `GOOGLE_API_KEY` | ✅ | Google API key (Genkit) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | ⚡ Optional | OpenWeatherMap key (enables weather features) |

> ⚠️ **Never commit `.env.local` to version control.** It is already in `.gitignore`.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+ ([download](https://nodejs.org))
- A Supabase account ([supabase.com](https://supabase.com))
- A Cloudinary account ([cloudinary.com](https://cloudinary.com))
- A Google AI Studio account ([aistudio.google.com](https://aistudio.google.com))

### Step-by-step

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/smartdrobe.git
cd smartdrobe
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your real keys
```

**4. Set up the Supabase database**

Go to your Supabase project → SQL Editor → New Query and run:
```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  location_city TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wardrobe_items table
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  color TEXT,
  colors TEXT[],
  description TEXT,
  image_url TEXT,
  ai_hint TEXT,
  wear_count INT DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users own their profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own their wardrobe" ON wardrobe_items FOR ALL USING (auth.uid() = user_id);
```

**5. Disable email confirmation** (for development)
> Supabase Dashboard → Authentication → Settings → Enable email confirmations → **OFF**

**6. Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deployment

See [DEPLOYMENT.md](./docs/deployment.md) for full deployment instructions.

**Quick deploy to Vercel:**
```bash
npm i -g vercel
vercel
```

Then add all environment variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

---

## � Product Documentation

Full Product Management documentation is available here:

👉 [SmartDrobe Notion Product Hub](https://www.notion.so/SMARTDROBE-3162d293895f802990fecc1d229abb3d?source=copy_linkk)

Includes:
- Product Requirement Document (PRD)
- Product Positioning
- Success Metrics
- Decision Log
- Product Roadmap

---

## �🗺️ Roadmap

### v1.1 — Social & Community
- [ ] Community outfit feed (share looks with others)
- [ ] Follow other users & get inspired
- [ ] Outfit likes and saves

### v1.2 — Smart Planning
- [ ] Outfit calendar with weekly planning
- [ ] Travel capsule wardrobe generator
- [ ] "Pack for a trip" AI feature

### v1.3 — Sustainability
- [ ] Cost-per-wear tracking
- [ ] Carbon footprint estimates
- [ ] "Rewear score" gamification

### v2.0 — Mobile & Premium
- [ ] React Native mobile app
- [ ] Premium tier (unlimited items, priority AI)
- [ ] Brand partnerships & affiliate shopping

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ by **Anushka Tiwari**

[⭐ Star this repo](https://github.com/yourusername/smartdrobe) if SmartDrobe helped you!

</div>
