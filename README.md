<div align="center">

# 👗 SmartDrobe
### AI-Powered Digital Wardrobe & Outfit Recommendation SaaS

![SmartDrobe](https://img.shields.io/badge/SmartDrobe-v1.0-8B5CF6?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)

**Stop asking "What do I wear?" — Let AI answer it for you.**

[Report Bug](https://github.com/anushkatiwari0/Smartdrobe/issues) · [Request Feature](https://github.com/anushkatiwari0/Smartdrobe/issues)

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

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure email/password signup & login via Supabase Auth |
| 👗 **Virtual Closet** | Upload outfit photos with AI-powered auto-categorization + 20 curated starter items |
| 🤖 **AI Stylist** | Personalized outfit recommendations using Google Gemini based on real wardrobe data |
| ☁️ **Cloud Storage** | Images stored on Cloudinary with automatic optimization |
| 🗄️ **Database** | PostgreSQL via Supabase with Row-Level Security |
| 🌤️ **Weather Integration** | Real-time weather data for context-aware recommendations |
| 👤 **User Profiles** | Customizable preferences and style settings |
| 🎯 **5-Step Onboarding** | Guided setup flow for new users (Welcome → Profile → Preferences → Style → Wardrobe) |
| 📊 **Real Style Analytics** | Dynamic style breakdown based on actual wardrobe composition (Casual/Formal/Party/Activewear) |
| ♻️ **Sustainability Tracking** | Track cost-per-wear and wardrobe utilization metrics |

### Security & Quality
| Feature | Description |
|---------|-------------|
| 🔒 **Secure Authentication** | Supabase Auth with Row-Level Security |
| 🛡️ **Rate Limiting** | API abuse protection on all endpoints |
| ✅ **Input Validation** | Zod schemas preventing XSS and injection attacks |
| 📊 **Health Monitoring** | `/api/health` endpoint for uptime tracking |
| 🔑 **Environment Validation** | Startup checks for required configuration |
| 📝 **Structured Logging** | Winston-based logging for production debugging |

### Developer Experience
| Feature | Description |
|---------|-------------|
| 🐳 **Docker Ready** | Multi-stage Dockerfile for containerized deployment |
| 📱 **Fully Responsive** | Mobile-first design with Tailwind CSS |
| 🌙 **Dark/Light Mode** | System-aware theme switching |
| 📊 **Analytics** | Event tracking for user behavior analysis |
| ⚡ **Fast Performance** | Optimized Next.js 15 with App Router |
| 📖 **Complete Documentation** | Security, deployment, and API docs |

---

## 🛠️ Tech Stack

```
Frontend:     Next.js 15 (App Router) + React 18 + TypeScript
Styling:      Tailwind CSS + shadcn/ui + Framer Motion
AI Engine:    Google Genkit + Gemini Flash
Auth & DB:    Supabase (PostgreSQL + Auth + RLS)
Image CDN:    Cloudinary (upload, transform, optimize)
Weather:      OpenWeatherMap API
Logging:      Winston
Validation:   Zod
Security:     Rate limiting + Input sanitization + HTTPS headers
Deployment:   Docker + Vercel
```

---

## 🏗️ Architecture

```
Browser (React)
    │
    ├── Next.js App Router (src/app/)
    │       ├── Client Components  → UI, forms, state
    │       └── API Routes         → /api/* endpoints
    │
    ├── Supabase
    │       ├── Auth               → JWT sessions
    │       ├── PostgreSQL         → wardrobe, profiles
    │       └── RLS policies       → data isolation
    │
    ├── Cloudinary
    │       └── Image storage      → WebP optimization
    │
    ├── Google Gemini AI
    │       └── Outfit generation  → /api/recommend
    │
    └── OpenWeatherMap
            └── Real-time weather  → /api/recommend
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service key (server-side only) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `GOOGLE_API_KEY` | ✅ | Google API key (Genkit) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | ⚡ Optional | OpenWeatherMap key |
| `DEFAULT_CITY` | ⚡ Optional | Fallback city (defaults to London) |

> ⚠️ **Never commit `.env.local` to version control.** It is already in `.gitignore`.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account
- Cloudinary account
- Google AI Studio account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/anushkatiwari0/Smartdrobe.git
cd Smartdrobe

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Set up Supabase database
# Run the SQL schema in your Supabase SQL Editor (see below)

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Database Setup

Run this SQL in your Supabase project → SQL Editor:

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

-- RLS Policies
CREATE POLICY "Users own their profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users own their wardrobe"
  ON wardrobe_items FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t smartdrobe .
docker run -p 3000:3000 --env-file .env.local smartdrobe

# Check health
curl http://localhost:3000/api/health
```

---

## 🌐 Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Then add environment variables in **Vercel Dashboard → Settings → Environment Variables**.

### Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions for:
- AWS Elastic Beanstalk
- Netlify
- Self-hosted Docker
- Kubernetes

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PRD.md](./PRD.md) | Product Requirements Document |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Codebase architecture |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guides for all platforms |

---

## 🔒 Security

SmartDrobe implements standard security practices:

- ✅ **Authentication** on all API endpoints via Supabase Auth
- ✅ **Rate limiting** to prevent API abuse
- ✅ **Input validation** with Zod schemas
- ✅ **Row-Level Security** in database
- ✅ **Environment validation** at startup

To report a security issue, please use [GitHub Security Advisories](https://github.com/anushkatiwari0/Smartdrobe/security).

---

## 🎯 API Routes

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/health` | GET | Health check | No |
| `/api/wardrobe` | GET | Get user's wardrobe items | Yes |
| `/api/wardrobe` | POST | Add wardrobe item | Yes |
| `/api/wardrobe/[id]` | PUT | Update wardrobe item | Yes |
| `/api/wardrobe/[id]` | DELETE | Delete wardrobe item | Yes |
| `/api/recommend` | POST | Get AI outfit recommendation | Yes |
| `/api/upload` | POST | Upload image to Cloudinary | Yes |
| `/api/events` | POST | Log analytics event | No |

All authenticated routes include:
- ✅ Authentication checks
- ✅ Rate limiting (10-100 req/min depending on endpoint)
- ✅ Input validation with Zod
- ✅ Error handling & logging

---

## 📝 Recent Updates (v1.1 - March 2026)

### New Features
- ✨ **5-Step Onboarding Flow** - Improved user onboarding with Welcome → Digitize Closet → AI Suggestions → Weather Picks → Style Profile
- 👗 **20 Curated Starter Items** - Pre-loaded wardrobe with H&M, Amazon, and Myntra fashion items for instant testing
- 📊 **Real-Time Style Analytics** - Dynamic style breakdown (Casual/Formal/Party/Activewear) calculated from actual wardrobe
- 📈 **Enhanced Sustainability Tracking** - Streamlined metrics focusing on cost-per-wear and wardrobe utilization
- 🎨 **Smart Categorization** - AI intelligently categorizes items by analyzing both category and description

### Improvements
- 🚀 Removed "Try Sample Wardrobe" button - items now load automatically in guest mode
- 🎯 Removed redundant "Most Worn Items" section from sustainability page
- ⚡ Optimized image URLs with better quality parameters (800x800, auto format)
- 🔧 Fixed duplicate image issues in sample wardrobe
- 💾 Better local storage handling for guest users with automatic STARTER_ITEMS population

### Developer Experience
- 📝 Added comprehensive documentation (SECURITY.md, DEPLOYMENT.md, GITHUB_CHECKLIST.md)
- 🐳 Docker support with multi-stage builds
- 🔒 Enhanced security with rate limiting, input validation, and structured logging
- 🏥 Health check endpoint (`/api/health`) for monitoring

---

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**You are free to:**
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend & auth
- [Google Gemini](https://ai.google.dev/) - AI recommendations
- [Cloudinary](https://cloudinary.com/) - Image storage
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

<div align="center">

Built with ❤️ by **Anushka Tiwari**

[⭐ Star this repo](https://github.com/anushkatiwari0/Smartdrobe) · [🐛 Report issues](https://github.com/anushkatiwari0/Smartdrobe/issues)

**Production-ready · Secure · Scalable**

</div>
