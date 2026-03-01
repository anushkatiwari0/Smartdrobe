-- =========================================================
-- SmartDrobe Production Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- TABLE 1: Profiles (extends Supabase auth.users)
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  avatar_url      TEXT,
  location_city   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =========================================================
-- TABLE 2: User Preferences
-- =========================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  style_keywords  TEXT[] DEFAULT ARRAY['casual'],
  fav_colors      TEXT[] DEFAULT ARRAY[]::TEXT[],
  avoid_colors    TEXT[] DEFAULT ARRAY[]::TEXT[],
  occasions       TEXT[] DEFAULT ARRAY['everyday'],
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- TABLE 3: Wardrobe Items
-- =========================================================
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  category              TEXT NOT NULL,
  description           TEXT DEFAULT '',
  image_url             TEXT NOT NULL,
  ai_hint               TEXT DEFAULT '',
  color                 TEXT DEFAULT '',
  colors                TEXT[] DEFAULT ARRAY[]::TEXT[],
  wear_count            INT DEFAULT 0,
  last_worn             TIMESTAMPTZ,
  ai_suggestion_count   INT DEFAULT 0,
  is_favorite           BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- TABLE 4: Outfit Recommendations (AI History)
-- =========================================================
CREATE TABLE IF NOT EXISTS outfit_recommendations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_ids        UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  occasion        TEXT,
  weather_context JSONB,
  ai_reasoning    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- TABLE 5: Saved Outfits (User's Lookbook)
-- =========================================================
CREATE TABLE IF NOT EXISTS saved_outfits (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES outfit_recommendations(id),
  item_ids          UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  name              TEXT DEFAULT 'My Outfit',
  occasion          TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- TABLE 6: Outfit History & Feedback Loop
-- =========================================================
CREATE TABLE IF NOT EXISTS outfit_history (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_ids          UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  recommendation_id UUID REFERENCES outfit_recommendations(id),
  date_worn         DATE NOT NULL DEFAULT CURRENT_DATE,
  occasion          TEXT,
  feedback          TEXT CHECK (feedback IN ('loved', 'liked', 'neutral', 'disliked')),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY — Each user sees ONLY their own data
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users manage own wardrobe" ON wardrobe_items;
DROP POLICY IF EXISTS "Users manage own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users manage own recommendations" ON outfit_recommendations;
DROP POLICY IF EXISTS "Users manage own saved outfits" ON saved_outfits;
DROP POLICY IF EXISTS "Users manage own history" ON outfit_history;

-- Apply policies
CREATE POLICY "Users manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own wardrobe" ON wardrobe_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own recommendations" ON outfit_recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saved outfits" ON saved_outfits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own history" ON outfit_history FOR ALL USING (auth.uid() = user_id);

-- =========================================================
-- PERFORMANCE INDEXES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_wardrobe_user ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_category ON wardrobe_items(category);
CREATE INDEX IF NOT EXISTS idx_outfit_history_user ON outfit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_history_date ON outfit_history(date_worn DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON outfit_recommendations(user_id);
