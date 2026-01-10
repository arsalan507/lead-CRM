import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { APIResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.headers.get('x-organization-id');

    // If no organization ID is provided, try to get the first organization's logo
    let query = supabaseAdmin.from('organizations').select('logo_url');

    if (organizationId) {
      query = query.eq('id', organizationId);
    } else {
      console.log('⚠️ No organization ID provided, fetching first organization logo');
    }

    const { data: organization, error } = await query.single();

    if (error) {
      console.error('Error fetching organization logo:', error);
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Failed to fetch logo' },
        { status: 500 }
      );
    }

    return NextResponse.json<APIResponse>({
      success: true,
      data: {
        logo_url: organization?.logo_url || null,
      },
    });
  } catch (error) {
    console.error('Get logo error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
