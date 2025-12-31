import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { APIResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.headers.get('x-organization-id');

    if (!organizationId) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: organization, error } = await supabaseAdmin
      .from('organizations')
      .select('logo_url')
      .eq('id', organizationId)
      .single();

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
