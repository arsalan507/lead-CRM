# Deployment Checklist for Vercel

## ✅ Pre-Deployment Steps

### 1. Environment Variables
Ensure these are set in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### 2. Database Migrations
Run the SQL migration on your **production** Supabase database:

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `referral-earnings-updates.sql`
3. Execute the SQL
4. Verify no errors

### 3. Git Status
```bash
# Check all changes are committed
git status

# Check current branch
git branch

# View recent commits
git log --oneline -5
```

## 🚀 Deployment Options

### Option 1: Deploy Current Branch (Recommended)
```bash
# Push current branch to trigger Vercel preview deployment
git push origin feature/google-review-qr-and-category-management
```

### Option 2: Merge to Main and Deploy
```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Merge feature branch
git merge feature/google-review-qr-and-category-management

# Push to trigger production deployment
git push origin main
```

### Option 3: Manual Redeploy from Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

## 🔍 Common Deployment Errors & Fixes

### Error: "Failed to update review status"
**Cause**: Missing environment variables or middleware not running
**Fix**:
1. Verify all environment variables are set in Vercel
2. Check middleware.ts is present (not proxy.ts)
3. Redeploy

### Error: SQL Syntax Error (Line 82)
**Cause**: PostgreSQL doesn't support `CREATE POLICY IF NOT EXISTS`
**Fix**:
- Already fixed in `referral-earnings-updates.sql`
- Use `DROP POLICY IF EXISTS` then `CREATE POLICY`

### Error: Build Failed - TypeScript Errors
**Cause**: Type errors in code
**Fix**:
```bash
# Run build locally first
npm run build

# Fix any errors shown
# Then commit and push
```

### Error: Runtime Error - Headers Not Set
**Cause**: Middleware not executing properly
**Fix**:
1. Ensure `middleware.ts` exists (not `proxy.ts`)
2. Check matcher config in middleware.ts
3. Verify cookies are being set on login

## ✅ Post-Deployment Verification

### 1. Test Authentication
- [ ] Login works
- [ ] Cookies are set correctly
- [ ] Redirects work properly

### 2. Test Lead Creation
- [ ] Create new lead
- [ ] Mark as WIN
- [ ] Check QR code appears
- [ ] Test review status buttons

### 3. Test API Routes
- [ ] `/api/leads/my-leads` returns data
- [ ] `/api/leads/update-review-status` works
- [ ] `/api/referral-earnings/my-earnings` works

### 4. Test SEM Modal
- [ ] Open "Apply for SEM" modal
- [ ] Check "I Accept" button appears
- [ ] Requirements list slides down after accepting

### 5. Check Logs
- Go to Vercel Dashboard → Deployments → Latest → Functions
- Check for any runtime errors

## 🐛 Debugging Tips

### View Vercel Logs
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login
vercel login

# View logs
vercel logs
```

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on failed deployment
3. View "Build Logs" tab
4. Look for specific error messages

### Test Production Build Locally
```bash
# Build production version
npm run build

# Start production server
npm run start

# Test at http://localhost:3000
```

## 📝 Notes

- Build completed successfully locally ✅
- No TypeScript errors ✅
- Middleware file is correct ✅
- SQL migration file fixed ✅

## 🆘 If Deployment Still Fails

1. **Share the exact error message** from Vercel deployment logs
2. Check if it's a **build error** or **runtime error**
3. Verify **environment variables** are set correctly
4. Try **clearing build cache** in Vercel settings
5. Check **Supabase RLS policies** are not blocking requests

---

**Last Updated**: 2026-01-10
**Status**: Ready for deployment ✅
