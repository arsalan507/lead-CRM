import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const organizationId = request.headers.get('x-organization-id');

    console.log('🔍 DEBUG - Headers:', { userId, organizationId });

    // Fetch ALL leads for this user to see what exists
    const { data: allLeads, error: allError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('sales_rep_id', userId)
      .eq('organization_id', organizationId);

    console.log('📊 All leads for user:', allLeads);

    // Fetch only WIN leads
    const { data: winLeads, error: winError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('sales_rep_id', userId)
      .eq('organization_id', organizationId)
      .eq('status', 'win');

    console.log('✅ WIN leads:', winLeads);

    // Fetch only REVIEWED WIN leads
    const { data: reviewedLeads, error: reviewedError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('sales_rep_id', userId)
      .eq('organization_id', organizationId)
      .eq('status', 'win')
      .eq('review_status', 'reviewed');

    console.log('⭐ REVIEWED WIN leads:', reviewedLeads);

    return NextResponse.json({
      success: true,
      debug: {
        userId,
        organizationId,
        allLeadsCount: allLeads?.length || 0,
        winLeadsCount: winLeads?.length || 0,
        reviewedWinLeadsCount: reviewedLeads?.length || 0,
        allLeads: allLeads,
        winLeads: winLeads,
        reviewedLeads: reviewedLeads,
      },
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
