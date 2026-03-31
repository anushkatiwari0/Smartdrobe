# 🚀 SmartDrobe Deployment Guide

This guide covers deploying SmartDrobe to various platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Rotated all API keys and kept them secure
- [ ] Set all environment variables in your hosting platform
- [ ] Enabled RLS policies in Supabase
- [ ] Tested the build locally: `npm run build`
- [ ] Verified all environment variables are set correctly
- [ ] Set up monitoring/alerting (optional but recommended)

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest and fastest way to deploy SmartDrobe.

#### Steps:

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd studio-master
   vercel
   ```

4. **Set Environment Variables**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Navigate to: Settings → Environment Variables
   - Add all variables from `.env.example`:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     GEMINI_API_KEY
     GOOGLE_API_KEY
     CLOUDINARY_CLOUD_NAME
     CLOUDINARY_API_KEY
     CLOUDINARY_API_SECRET
     NEXT_PUBLIC_OPENWEATHER_API_KEY
     DEFAULT_CITY
     ```

5. **Deploy Production**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

The `vercel.json` file is already configured with:
- ✅ Security headers
- ✅ Environment variable references
- ✅ Build settings

---

### Option 2: Docker (Self-Hosted)

Deploy SmartDrobe using Docker for full control.

#### Prerequisites:
- Docker installed
- Docker Compose installed (optional)

#### Steps:

1. **Build the Docker image**
   ```bash
   cd studio-master
   docker build -t smartdrobe:latest .
   ```

2. **Create a `.env` file** (for Docker)
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   Or run directly:
   ```bash
   docker run -d \
     --name smartdrobe \
     -p 3000:3000 \
     --env-file .env \
     smartdrobe:latest
   ```

4. **Check health**
   ```bash
   curl http://localhost:3000/api/health
   ```

#### Production Docker Setup

For production, use Docker Swarm or Kubernetes:

**Docker Swarm:**
```bash
docker stack deploy -c docker-compose.yml smartdrobe
```

**Kubernetes:**
```bash
# Create secrets
kubectl create secret generic smartdrobe-secrets \
  --from-env-file=.env

# Apply deployment
kubectl apply -f k8s/deployment.yml
```

---

### Option 3: AWS (Elastic Beanstalk)

#### Steps:

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   eb init
   ```

3. **Create environment**
   ```bash
   eb create production
   ```

4. **Set environment variables**
   ```bash
   eb setenv \
     NEXT_PUBLIC_SUPABASE_URL=your-url \
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
     # ... add all env vars
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

---

### Option 4: Netlify

#### Steps:

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```

4. **Set environment variables**
   - Go to: Netlify Dashboard → Site Settings → Environment Variables
   - Add all variables from `.env.example`

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## 🔧 Post-Deployment Configuration

### 1. Database Setup (First Deploy Only)

Run the following SQL in your Supabase SQL Editor:

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
  last_worn TIMESTAMPTZ,
  ai_suggestion_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_events table (analytics)
CREATE TABLE IF NOT EXISTS user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users own their profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users own their wardrobe"
  ON wardrobe_items FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users own their events"
  ON user_events FOR ALL
  USING (auth.uid() = user_id);
```

### 2. Supabase Authentication Settings

1. Go to: Supabase Dashboard → Authentication → Settings
2. For **development**: Disable email confirmation
3. For **production**: Enable email confirmation
4. Set up redirect URLs:
   - Add your production URL: `https://your-domain.com`
   - Add auth callback: `https://your-domain.com/auth/callback`

### 3. Cloudinary Configuration

1. Go to: Cloudinary Dashboard → Settings → Security
2. Set **Allowed fetch domains** to your production domain
3. Enable **Secure URLs** for production

### 4. Rate Limiting (Optional - Production)

For production, consider upgrading from in-memory to Redis-based rate limiting:

```bash
npm install @upstash/redis @upstash/ratelimit
```

Update `src/lib/rate-limit.ts` to use Redis (see code comments).

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint

Monitor `/api/health` for system status:

```bash
curl https://your-domain.com/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "All systems operational",
  "checks": {
    "api": "up",
    "database": "up",
    "timestamp": "2025-03-25T12:00:00.000Z"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

### Monitoring Setup

1. **Vercel Analytics** (if using Vercel)
   - Automatically enabled
   - View at: https://vercel.com/dashboard/analytics

2. **Uptime Monitoring** (Recommended)
   - Use: UptimeRobot, Pingdom, or similar
   - Monitor: `/api/health` every 5 minutes
   - Alert if status != 200

3. **Error Tracking** (Optional but recommended)
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

4. **Log Aggregation** (Optional)
   - For Docker: Use Loki, Elasticsearch, or CloudWatch
   - For Vercel: Use Vercel Logs or Datadog

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          # Add other env vars from secrets

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🆘 Troubleshooting

### Build Fails

**Issue**: TypeScript or ESLint errors

**Solution**:
```bash
npm run typecheck
npm run lint
# Fix errors, then rebuild
npm run build
```

### Environment Variables Not Found

**Issue**: App fails with "Missing required environment variables"

**Solution**:
- Verify all env vars are set in hosting platform
- Check spelling matches `.env.example` exactly
- Restart the deployment after setting vars

### Database Connection Fails

**Issue**: Health check shows `database: 'down'`

**Solution**:
- Verify Supabase URL and keys are correct
- Check Supabase project is not paused
- Ensure RLS policies are set up correctly
- Check network connectivity

### Images Not Loading

**Issue**: Uploaded images return 404

**Solution**:
- Verify Cloudinary credentials are correct
- Check CORS settings in Cloudinary
- Ensure image URLs use `https://`
- Verify Next.js `remotePatterns` in `next.config.ts`

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Need Help?** For security-related issues, use [GitHub Security Advisories](https://github.com/anushkatiwari0/Smartdrobe/security) or open an issue on GitHub.

**Last Updated**: 2025-03-25
**Version**: 1.0.0
