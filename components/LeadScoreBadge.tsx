'use client';

import { LeadWithDetails } from '@/lib/types';
import { calculateLeadScore, getLeadScoreCategory } from '@/lib/lead-score';

interface LeadScoreBadgeProps {
  lead: LeadWithDetails;
  showScore?: boolean; // Whether to show the numeric score
}

export default function LeadScoreBadge({ lead, showScore = true }: LeadScoreBadgeProps) {
  // Only show score for Lost leads
  if (lead.status !== 'lost') {
    return null;
  }

  const score = calculateLeadScore(lead);
  const category = getLeadScoreCategory(score);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${category.bgColor} ${category.textColor}`}
    >
      <span>{category.emoji}</span>
      <span>{category.label}</span>
      {showScore && <span>({score})</span>}
    </span>
  );
}
