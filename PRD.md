# Product Requirements Document
# SmartDrobe: AI-Powered Virtual Wardrobe

**Version:** 1.1
**Date:** March 2026
**Status:** Production Ready
**Maintainer:** Anushka Tiwari
**License:** MIT

---

## Overview

**SmartDrobe** is an AI-powered application that helps users get personalized outfit recommendations from their own wardrobe. By combining AI, real-time weather data, and user preferences, SmartDrobe eliminates the daily "What should I wear?" dilemma.

### The Problem

- People spend 15-30 minutes each morning deciding what to wear
- Most wardrobes are underutilized (people wear only 20% of their clothes regularly)
- Lack of outfit inspiration leads to impulse buying
- Weather and occasion planning is disconnected from clothing choices

### The Solution

SmartDrobe provides:
1. **Digital Wardrobe** - Upload and organize clothing items with photos
2. **AI Recommendations** - Get outfit suggestions based on weather, occasion, and mood
3. **Style Analytics** - Track wardrobe usage and style preferences
4. **Sustainability** - Maximize existing wardrobe value and reduce waste

---

## Core Features

### 1. Authentication & Onboarding
- Secure email/password authentication via Supabase
- 5-step onboarding flow (Welcome → Profile → Preferences → Style → Wardrobe)
- User profile with location, style preferences, and settings

### 2. Virtual Wardrobe
- Upload clothing items with photos (stored on Cloudinary)
- AI-powered categorization (tops, bottoms, shoes, accessories)
- Color detection and tagging
- 20 curated starter items for demo/testing
- Edit, favorite, and delete items

### 3. AI Outfit Recommendations
- Personalized outfit generation using Google Gemini AI
- Context-aware suggestions based on:
  - Real-time weather (OpenWeatherMap API)
  - User location
  - Occasion (work, casual, party, gym)
  - Personal style preferences
- Multiple outfit options per request
- Outfit history tracking

### 4. Style Analytics
- Dynamic style breakdown (Casual/Formal/Party/Activewear)
- Wardrobe composition insights
- Color distribution analysis
- Most worn items tracking

### 5. Sustainability Tracking
- Cost-per-wear calculations
- Wardrobe utilization metrics
- Outfit reuse tracking

---

## Technical Architecture

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion for animations

**Backend & Services:**
- Supabase (PostgreSQL + Auth + Row-Level Security)
- Google Gemini AI (outfit generation)
- Cloudinary (image storage & optimization)
- OpenWeatherMap API (weather data)

**Security & Quality:**
- Authentication on all API endpoints
- Rate limiting (10-100 req/min per endpoint)
- Input validation with Zod schemas
- Environment validation at startup
- Winston-based structured logging

### Database Schema

**profiles table:**
```sql
- id (UUID, primary key)
- display_name (TEXT)
- location_city (TEXT)
- onboarding_completed (BOOLEAN)
- created_at (TIMESTAMP)
```

**wardrobe_items table:**
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- name (TEXT)
- category (TEXT)
- color (TEXT)
- colors (TEXT[])
- description (TEXT)
- image_url (TEXT)
- wear_count (INT)
- is_favorite (BOOLEAN)
- created_at (TIMESTAMP)
```

**Row-Level Security (RLS):**
- Users can only access their own profile
- Users can only access their own wardrobe items

---

## User Flows

### First-Time User Flow
1. Land on homepage → Sign up
2. Complete 5-step onboarding:
   - Welcome screen
   - Set profile (name, location)
   - Choose style preferences
   - Understand how AI works
   - Add first wardrobe items (or use starter items)
3. Get first AI outfit recommendation
4. Explore wardrobe, analytics, and sustainability features

### Returning User Flow
1. Login → Dashboard
2. View recommended outfit for today
3. Get new recommendations by occasion/mood
4. Add/edit wardrobe items as needed
5. Track style analytics and sustainability metrics

---

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | No | Health check |
| `/api/wardrobe` | GET | Yes | Get user's wardrobe items |
| `/api/wardrobe` | POST | Yes | Add wardrobe item |
| `/api/wardrobe/[id]` | PUT | Yes | Update wardrobe item |
| `/api/wardrobe/[id]` | DELETE | Yes | Delete wardrobe item |
| `/api/recommend` | POST | Yes | Get AI outfit recommendation |
| `/api/upload` | POST | Yes | Upload image to Cloudinary |
| `/api/events` | POST | No | Log analytics event |

---

## Success Metrics

### Key Performance Indicators (KPIs)

**User Engagement:**
- Daily active users (DAU)
- Average wardrobe size per user
- Outfit recommendations generated per week
- Return user rate

**Product Performance:**
- AI recommendation acceptance rate
- Average time to first recommendation
- Wardrobe item upload success rate
- API response times (<2s for recommendations)

**Technical Health:**
- System uptime (target: 99.5%+)
- API error rates (<1%)
- Zero security vulnerabilities
- Build success rate (100%)

---

## Future Enhancements

Potential features for future versions:

1. **Social Features**
   - Share outfits with friends
   - Community style inspiration
   - Outfit ratings and feedback

2. **Advanced AI**
   - Learn from user outfit choices
   - Seasonal wardrobe suggestions
   - Shopping recommendations for wardrobe gaps

3. **Calendar Integration**
   - Plan outfits for upcoming events
   - Automated daily outfit scheduling
   - Travel capsule wardrobe builder

4. **Shopping Features**
   - Track where items were purchased
   - Price tracking and cost analysis
   - Affiliate shopping recommendations

---

## Development Notes

### Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# AI
GEMINI_API_KEY
GOOGLE_API_KEY

# Image Storage
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

# Weather (Optional)
NEXT_PUBLIC_OPENWEATHER_API_KEY
DEFAULT_CITY
```

### Security Considerations

- Never commit `.env.local` to version control
- Rotate API keys regularly
- Keep RLS policies enabled in Supabase
- Use service role key only in server-side code
- Validate all user inputs with Zod schemas
- Monitor rate limiting logs for abuse

---

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For major changes, please open an issue first to discuss proposed changes.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) file for details.

---

**Last Updated:** March 31, 2026
**Maintained by:** [Anushka Tiwari](https://github.com/anushkatiwari0)
