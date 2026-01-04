# Lead Analytics & Scoring Implementation Plan

## Overview
Comprehensive implementation of customer tracking, lead scoring, and analytics features.

---

## Implementation Phases

### ✅ Phase 1: Foundation (COMPLETED)
**Status:** Done
**Files Created:**
- `supabase/migrations/add-lead-rating-and-score.sql`
- `lib/lead-score.ts`
- Updated `lib/types.ts`

**What Was Done:**
- Added `lead_rating` column (1-5 stars) for Lost leads
- Created scoring algorithm (0-100 points):
  - Timeline: 40 points max
  - Deal Size: 25 points max
  - Reason: 20 points max
  - Rating: 15 points max
- Score categories: 🔥 HOT (80-100), 🌡️ WARM (50-79), ❄️ COLD (0-49)

---

### ✅ Phase 2: Customer Duplicate Detection & History (COMPLETED)
**Status:** Complete
**Goal:** Detect existing customers and show their history

**Tasks:**
- [✅] Create API endpoint: `/api/customers/check-phone` - Check if phone exists
- [✅] Update Step1 component to check for duplicates when typing phone
- [✅] Show "Already exists - Lead (X)" message with link
- [✅] Create Customer History Page: `/app/customer/[phone]/page.tsx`
- [✅] Create API endpoint: `/api/customers/[phone]/route.ts` - Get customer history
- [✅] Display customer timeline with all previous leads
- [✅] Add "Repeat Customer" badge logic
- [✅] Fixed organization ID issue (handle both snake_case and camelCase)
- [✅] Fixed 404 issue by restarting dev server
- [✅] Verified duplicate detection works correctly

**Files to Create/Modify:**
- `app/api/customers/check-phone/route.ts` (NEW)
- `app/api/customers/[phone]/route.ts` (NEW)
- `app/customer/[phone]/page.tsx` (NEW)
- `components/LeadForm/Step1.tsx` (UPDATE)

---

### ✅ Phase 3: 5-Star Rating UI (Lost Flow) (COMPLETED)
**Status:** Complete
**Goal:** Add rating input in Lost lead submission

**Tasks:**
- [✅] Update `LostStep4.tsx` - Add 5-star rating component after reason selection
- [✅] Add state for rating (1-5)
- [✅] Validate rating is selected before submission
- [✅] Pass rating to parent component
- [✅] Update `/app/lead/new/page.tsx` - Include rating in API call
- [✅] Update `/app/api/leads/create/route.ts` - Save rating to database
- [✅] Added visual feedback with emojis for each rating level
- [✅] Interactive star UI with hover effects

**Files to Modify:**
- `components/LeadForm/LostStep4.tsx`
- `app/lead/new/page.tsx`
- `app/api/leads/create/route.ts`

---

### ✅ Phase 4: Lead Score Display (COMPLETED)
**Status:** Complete
**Goal:** Show lead scores in dashboards

**Tasks:**
- [✅] Create `LeadScoreBadge` component
- [✅] Update Sales Rep Dashboard - Add score column (Lost leads only)
- [✅] Update Admin Dashboard - Add score column (Lost leads only)
- [✅] Show score badge with color coding (HOT/WARM/COLD)
- [✅] Add score to CSV export
- [⏭️] Enable sorting by score (skipped - not critical for MVP)

**Files to Create/Modify:**
- `components/LeadScoreBadge.tsx` (NEW)
- `app/dashboard/page.tsx` (UPDATE)
- `app/admin/dashboard/page.tsx` (UPDATE)

---

### 🔄 Phase 5: Win/Lost Analytics Section
**Status:** Pending
**Goal:** Show performance metrics in admin dashboard

**Tasks:**
- [ ] Add analytics section to admin dashboard
- [ ] Calculate Win/Lost ratio per sales rep
- [ ] Display metrics:
  - Total Leads
  - Win Count
  - Lost Count
  - Win Percentage
- [ ] Add date range filter (This Month, Last Month, All Time)
- [ ] Make metrics sortable
- [ ] Update sales rep cards to show "Total: X | Win: Y | Lost: Z"

**Files to Modify:**
- `app/admin/dashboard/page.tsx`

---

### 🔄 Phase 6: Repeat Customer Badge
**Status:** Pending
**Goal:** Show badge for returning customers

**Tasks:**
- [ ] Create utility function to check if customer is repeat
- [ ] Add "Repeat Customer" badge in dashboards
- [ ] Show previous visit count
- [ ] Link badge to customer history page

**Files to Create/Modify:**
- `lib/customer-utils.ts` (NEW)
- `components/RepeatCustomerBadge.tsx` (NEW)
- `app/dashboard/page.tsx` (UPDATE)
- `app/admin/dashboard/page.tsx` (UPDATE)

---

## Database Migrations Needed

### Migration 1: Lead Rating (DONE)
```sql
ALTER TABLE leads ADD COLUMN lead_rating INTEGER CHECK (lead_rating >= 1 AND lead_rating <= 5);
```

### Migration 2: Update Constraint (DONE - from previous work)
```sql
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_not_today_reason_check;
ALTER TABLE leads ADD CONSTRAINT leads_not_today_reason_check
  CHECK (not_today_reason IN ('need_family_approval', 'price_high', 'want_more_options', 'just_browsing', 'other'));
```

---

## API Endpoints to Create

### 1. Check Phone Duplicate
**Endpoint:** `GET /api/customers/check-phone?phone=xxx&orgId=xxx`
**Response:**
```json
{
  "exists": true,
  "leadCount": 3,
  "latestLead": { ... }
}
```

### 2. Customer History
**Endpoint:** `GET /api/customers/[phone]`
**Response:**
```json
{
  "customer": {
    "phone": "9876543210",
    "name": "John Doe",
    "leadCount": 3,
    "totalValue": 150000,
    "leads": [...]
  }
}
```

---

## UI Components to Create

### 1. LeadScoreBadge
```tsx
<LeadScoreBadge score={85} />
// Displays: 🔥 HOT 85
```

### 2. StarRating
```tsx
<StarRating value={4} onChange={(rating) => {...}} />
// Displays: ★★★★☆
```

### 3. RepeatCustomerBadge
```tsx
<RepeatCustomerBadge count={3} phone="9876543210" />
// Displays: 🔁 Repeat (3 visits)
```

### 4. CustomerHistoryCard
```tsx
<CustomerHistoryCard lead={lead} />
// Shows timeline entry for each lead
```

---

## Testing Checklist

### Phase 2: Duplicate Detection
- [ ] Enter existing phone number - should show "Already exists" message
- [ ] Click on "Lead (X)" link - should open customer history page
- [ ] Customer history page shows all previous leads
- [ ] Can still create new lead for existing customer

### Phase 3: Rating
- [ ] Lost lead Step 4 shows 5-star rating
- [ ] Cannot submit without selecting rating
- [ ] Rating saves to database correctly
- [ ] Rating displays in admin dashboard

### Phase 4: Lead Score
- [ ] Lost leads show score badge
- [ ] Win leads show no score
- [ ] Score colors correct: HOT (red), WARM (orange), COLD (blue)
- [ ] Can sort by score
- [ ] CSV export includes score

### Phase 5: Analytics
- [ ] Analytics section shows in admin dashboard
- [ ] Win/Lost ratios calculate correctly
- [ ] Date filters work properly
- [ ] Sales rep cards show split: "Total: 25 | Win: 10 | Lost: 15"

### Phase 6: Repeat Customer
- [ ] Badge shows for customers with multiple leads
- [ ] Badge shows correct visit count
- [ ] Clicking badge opens customer history

---

## Deployment Steps

1. **Run Database Migration:**
   ```sql
   -- In Supabase SQL Editor
   -- Run: supabase/migrations/add-lead-rating-and-score.sql
   ```

2. **Build and Test:**
   ```bash
   npm run build
   ```

3. **Commit and Push:**
   ```bash
   git add -A
   git commit -m "Implement lead analytics and scoring system"
   git push origin main
   ```

4. **Verify Deployment:**
   - Check Vercel deployment status
   - Test all features in production

---

## Progress Tracking

**Current Status:** Phase 4 Complete, Moving to Phase 5

**Phase Completion:**
- Phase 1: ✅ Complete (Foundation)
- Phase 2: ✅ Complete (Customer duplicate detection & history)
- Phase 3: ✅ Complete (5-star rating UI)
- Phase 4: ✅ Complete (Score display)
- Phase 5: 0% (Analytics)
- Phase 6: 0% (Repeat badge)

**Overall Progress:** 66.67% (4/6 phases complete)

---

**Last Updated:** January 2, 2026
**Next Session:** Start Phase 4 - Implement lead score badges in dashboards
