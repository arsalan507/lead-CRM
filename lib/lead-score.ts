import { LeadWithDetails, PurchaseTimeline, NotTodayReason } from './types';

/**
 * Calculate lead score based on multiple factors
 * Total score range: 0-100
 *
 * Scoring breakdown:
 * - Purchase Timeline: 40 points max
 * - Deal Size: 25 points max
 * - Not Today Reason: 20 points max
 * - Lead Rating (5-star): 15 points max
 */
export function calculateLeadScore(lead: LeadWithDetails): number {
  // Only calculate score for Lost leads
  if (lead.status !== 'lost') {
    return 0;
  }

  let score = 0;

  // 1. Purchase Timeline Score (40 points max)
  if (lead.purchase_timeline) {
    const timelineScores: Record<PurchaseTimeline, number> = {
      today: 40,
      '3_days': 30,
      '7_days': 20,
      '30_days': 10,
    };
    score += timelineScores[lead.purchase_timeline] || 0;
  }

  // 2. Deal Size Score (25 points max)
  if (lead.deal_size) {
    if (lead.deal_size >= 100000) {
      score += 25;
    } else if (lead.deal_size >= 50000) {
      score += 20;
    } else if (lead.deal_size >= 25000) {
      score += 15;
    } else {
      score += 10;
    }
  }

  // 3. Not Today Reason Score (20 points max)
  if (lead.not_today_reason) {
    const reasonScores: Record<NotTodayReason, number> = {
      need_family_approval: 20, // High intent, just needs approval
      price_high: 15, // Negotiable, medium intent
      want_more_options: 10, // Shopping around
      just_browsing: 5, // Low intent
      other: 10, // Variable, medium default
    };
    score += reasonScores[lead.not_today_reason] || 0;
  }

  // 4. Lead Rating Score (15 points max)
  if (lead.lead_rating) {
    const ratingScores: Record<number, number> = {
      5: 15,
      4: 12,
      3: 9,
      2: 6,
      1: 3,
    };
    score += ratingScores[lead.lead_rating] || 0;
  }

  return Math.min(score, 100); // Cap at 100
}

/**
 * Get lead score category and display info
 */
export function getLeadScoreCategory(score: number): {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  textColor: string;
} {
  if (score >= 80) {
    return {
      label: 'HOT',
      emoji: '🔥',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    };
  } else if (score >= 50) {
    return {
      label: 'WARM',
      emoji: '🌡️',
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
    };
  } else {
    return {
      label: 'COLD',
      emoji: '❄️',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    };
  }
}

/**
 * Format lead score for display
 */
export function formatLeadScore(lead: LeadWithDetails): {
  score: number;
  category: ReturnType<typeof getLeadScoreCategory>;
} {
  const score = calculateLeadScore(lead);
  const category = getLeadScoreCategory(score);

  return { score, category };
}
