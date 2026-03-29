# 🔒 SmartDrobe Security Guide

This document outlines security best practices, implemented protections, and deployment guidelines for SmartDrobe.

---

## 🚨 IMMEDIATE ACTION REQUIRED

### ⚠️ API Key Rotation

**IF YOU HAVE SHARED YOUR `.env.local` FILE OR API KEYS WITH ANYONE, ROTATE THEM IMMEDIATELY:**

1. **Supabase Keys**
   - Go to: https://supabase.com/dashboard
   - Navigate to: Project Settings → API
   - Click "Regenerate" for both Anon Key and Service Role Key
   - Update your `.env.local` file

2. **Google Gemini API Key**
   - Go to: https://aistudio.google.com/app/apikey
   - Delete the old key
   - Create a new API key
   - Update your `.env.local` file

3. **Cloudinary Credentials**
   - Go to: https://cloudinary.com/console
   - Navigate to: Settings → Security
   - Click "Regenerate API secret"
   - Update your `.env.local` file

4. **OpenWeatherMap API Key**
   - Go to: https://home.openweathermap.org/api_keys
   - Delete the old key
   - Generate a new one
   - Update your `.env.local` file

---

## ✅ Implemented Security Features

### 1. Authentication & Authorization
- ✅ **Supabase Auth** with JWT-based sessions
- ✅ **Row-Level Security (RLS)** on all database tables
- ✅ **Authentication checks** on all API routes (except health check and analytics)
- ✅ **Protected routes** via Next.js middleware
- ✅ **User ID verification** on all data operations

### 2. Input Validation & Sanitization
- ✅ **Zod schemas** for all API inputs
- ✅ **Type-safe validation** with detailed error messages
- ✅ **File type validation** on image uploads (images only)
- ✅ **File size limits** (10MB max for images)
- ✅ **URL validation** for image URLs

### 3. Rate Limiting
- ✅ **In-memory rate limiting** on all API routes
- ✅ **Different limits** per endpoint:
  - Upload & AI requests: 10/minute (strict)
  - Regular API calls: 30/minute (moderate)
  - Read operations: 100/minute (lenient)
  - Analytics: 200/minute (very lenient)
- ✅ **Per-user rate limiting** (not just IP-based)

### 4. Security Headers
- ✅ **Strict-Transport-Security (HSTS)**: Enforces HTTPS
- ✅ **X-Content-Type-Options**: Prevents MIME sniffing
- ✅ **X-Frame-Options**: Prevents clickjacking
- ✅ **X-XSS-Protection**: Enables browser XSS filter
- ✅ **Referrer-Policy**: Controls referrer information
- ✅ **Permissions-Policy**: Disables unnecessary browser features

### 5. Environment & Configuration
- ✅ **Environment validation** at startup
- ✅ **No hardcoded secrets** in code
- ✅ **Separate configs** for dev/production
- ✅ **`.gitignore`** properly configured
- ✅ **Build errors enabled** (no silent failures)

### 6. Error Handling & Logging
- ✅ **Centralized error handling** with Winston
- ✅ **Structured logging** for all API routes
- ✅ **No sensitive data** in error messages
- ✅ **Health check endpoint** for monitoring

### 7. Image Upload Security
- ✅ **Authentication required** for uploads
- ✅ **File type validation** (images only)
- ✅ **File size limits** (10MB max)
- ✅ **Cloudinary transformation** for optimization
- ✅ **Rate limiting** on upload endpoint

---

## 🛡️ Security Best Practices

### For Development

1. **NEVER commit `.env.local` to version control**
   ```bash
   # Already in .gitignore, but double-check:
   git status | grep .env
   # Should return nothing
   ```

2. **Use different API keys for dev/staging/production**
   - Create separate Supabase projects
   - Use separate Cloudinary folders
   - Rotate keys regularly

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

4. **Review code for security issues before committing**
   - No hardcoded secrets
   - No console.log with sensitive data
   - Proper error handling

### For Production Deployment

1. **Environment Variables**
   - Set all env vars in your hosting platform (Vercel, AWS, etc.)
   - NEVER use `.env.local` in production
   - Use secrets management (AWS Secrets Manager, Vercel Env Vars, etc.)

2. **Database Security**
   - Enable RLS on all Supabase tables
   - Use service role key ONLY in server-side code
   - Never expose service role key to client
   - Regularly review RLS policies

3. **API Keys**
   - Rotate keys every 90 days
   - Use API key restrictions where available:
     - Cloudinary: Set allowed domains
     - Gemini: Set usage quotas
     - OpenWeatherMap: Set rate limits

4. **Monitoring & Logging**
   - Monitor `/api/health` endpoint
   - Set up alerts for failed health checks
   - Review Winston logs regularly
   - Consider using error tracking (Sentry)

5. **HTTPS & Certificates**
   - Ensure HTTPS is enforced (Vercel does this automatically)
   - No mixed content (HTTP resources on HTTPS pages)
   - Keep TLS certificates up to date

6. **Rate Limiting**
   - For production, consider using Redis-based rate limiting:
     - Upstash Redis (recommended for Vercel)
     - AWS ElastiCache
     - Custom Redis instance
   - Current in-memory solution works but resets on server restart

---

## 🔍 Security Checklist Before Production

Use this checklist before every production deployment:

### Pre-Deployment
- [ ] All API keys are rotated and secure
- [ ] `.env.local` is NOT committed to git
- [ ] `npm audit` returns 0 vulnerabilities (or acceptable risk)
- [ ] TypeScript builds without errors
- [ ] ESLint passes without errors
- [ ] All tests pass (when implemented)

### Configuration
- [ ] `NODE_ENV=production` is set
- [ ] All required env vars are set in hosting platform
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Health check endpoint works

### Database
- [ ] RLS is enabled on all tables
- [ ] RLS policies are tested
- [ ] Service role key is only used server-side
- [ ] Database backups are configured

### Monitoring
- [ ] Health check endpoint is monitored
- [ ] Logging is working (Winston)
- [ ] Error tracking is set up (optional: Sentry)
- [ ] Alerts are configured for critical errors

---

## 🚨 Incident Response

If you discover a security vulnerability or breach:

1. **Immediate Actions**
   - Rotate ALL API keys immediately
   - Review access logs in Supabase
   - Check Cloudinary usage for anomalies
   - Disable compromised user accounts if needed

2. **Investigation**
   - Review Winston logs for suspicious activity
   - Check rate limiting logs
   - Identify affected users/data
   - Document the timeline

3. **Remediation**
   - Fix the vulnerability
   - Deploy the fix immediately
   - Notify affected users (if data was compromised)
   - Update this document with lessons learned

4. **Prevention**
   - Add tests to prevent recurrence
   - Update security policies
   - Review similar code paths
   - Consider security audit

---

## 📞 Security Contacts

- **Report Security Issues**: [Your Email]
- **Emergency Contact**: [Your Phone]

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Next.js Security Guidelines](https://nextjs.org/docs/advanced-features/security-headers)
- [Cloudinary Security](https://cloudinary.com/documentation/security_best_practices)

---

**Last Updated**: 2025-03-25
**Version**: 1.0.0
