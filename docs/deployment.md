# SmartDrobe — Production Deployment Guide

This guide walks you through deploying SmartDrobe to **Vercel** (hosting) with **Supabase** (database + auth) and **Cloudinary** (image storage). All three have generous free tiers.

---

## Prerequisites

Before you start, make sure you have accounts on:

| Service | Free Tier | Sign Up |
|---------|-----------|---------|
| Vercel | Unlimited hobby projects | [vercel.com](https://vercel.com) |
| Supabase | 2 free projects, 500MB DB | [supabase.com](https://supabase.com) |
| Cloudinary | 25GB storage, 25GB bandwidth/month | [cloudinary.com](https://cloudinary.com) |
| Google AI Studio | Free Gemini API quota | [aistudio.google.com](https://aistudio.google.com) |
| OpenWeatherMap | 1,000 calls/day free | [openweathermap.org/api](https://openweathermap.org/api) |

---

## Step 1 — Set Up Supabase

### 1a. Create a Project
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, region (pick one nearest your users), and a strong database password
3. Wait ~2 minutes for the project to initialize

### 1b. Run the Database Schema
Go to **SQL Editor** → **New Query** and run the following:

```sql
-- Profiles (one per authenticated user)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  location_city TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User style preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  style_keywords TEXT[],
  fav_colors TEXT[],
  avoid_colors TEXT[],
  occasions TEXT[],
  gender_style TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wardrobe items
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
  last_worn TIMESTAMPTZ,
  ai_suggestion_count INT DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  event TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users own their profile"
  ON profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users own their preferences"
  ON user_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their wardrobe"
  ON wardrobe_items FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their events"
  ON user_events FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1c. Get Your API Keys
Go to **Project Settings** → **API**:
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ The service role key bypasses RLS. Keep it server-side only and never expose it to the browser.

### 1d. Configure Auth for Production
Go to **Authentication** → **URL Configuration**:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

Go to **Authentication** → **Settings**:
- **Enable email confirmations**: Turn **ON** for production
- (Optional) Configure a custom SMTP provider like [Resend](https://resend.com) for better email deliverability

---

## Step 2 — Set Up Cloudinary

1. Log in to [cloudinary.com](https://cloudinary.com/console)
2. Go to **Dashboard** and copy:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

> **Optional:** Create an upload preset for extra control over file transformations.

---

## Step 3 — Get Google Gemini API Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy it → `GEMINI_API_KEY` and `GOOGLE_API_KEY`

---

## Step 4 — Deploy to Vercel

### Option A — Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# From your project root:
vercel

# Follow the prompts — it will detect Next.js automatically
```

### Option B — Vercel Dashboard

1. Push your code to **GitHub**
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Next.js — click **Deploy**

### Adding Environment Variables

In **Vercel Dashboard** → your project → **Settings** → **Environment Variables**, add all of these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` |
| `GEMINI_API_KEY` | `AIza...` |
| `GOOGLE_API_KEY` | `AIza...` |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | `123456789` |
| `CLOUDINARY_API_SECRET` | `abc123...` |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | `abc123...` |

> Set all variables for **Production**, **Preview**, and **Development** environments.

After adding env vars → **Redeploy** the project.

---

## Step 5 — Verify Deployment

After deploying, verify these flows work end-to-end:

- [ ] Landing page loads at `https://your-app.vercel.app`
- [ ] Sign up with a new email → redirected to `/dashboard`
- [ ] Onboarding flow appears for new user
- [ ] Upload a wardrobe item → image appears in closet
- [ ] Generate an AI outfit recommendation
- [ ] Profile saves city + style preferences
- [ ] Check Supabase → `wardrobe_items` table has data

---

## Custom Domain (Optional)

1. Vercel Dashboard → **Settings** → **Domains**
2. Add your domain (e.g., `smartdrobe.app`)
3. Update Supabase **Site URL** and **Redirect URLs** to your custom domain
4. Update Cloudinary CNAME if using custom delivery domain

---

## Environment Variable Checklist

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ GEMINI_API_KEY
✅ GOOGLE_API_KEY
✅ CLOUDINARY_CLOUD_NAME
✅ CLOUDINARY_API_KEY
✅ CLOUDINARY_API_SECRET
⚡ NEXT_PUBLIC_OPENWEATHER_API_KEY  (optional but recommended)
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Images not loading | Check Cloudinary env vars; verify `res.cloudinary.com` is in `next.config.ts` remotePatterns |
| Auth redirect fails | Update Supabase redirect URLs to your Vercel domain |
| AI not generating | Verify `GEMINI_API_KEY` is set in Vercel env vars |
| 500 errors on API routes | Check Vercel function logs (Vercel Dashboard → Deployments → Functions) |
| Email not sending | Configure a custom SMTP provider in Supabase Auth settings |
