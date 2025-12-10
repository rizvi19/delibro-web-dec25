import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const userOnly = searchParams.get('userOnly') === 'true';

  try {
    let query = supabase
      .from('parcels')
      .select(`
        *,
        profiles!parcels_user_id_fkey (
          name,
          phone,
          avatar_url
        ),
        trips!parcels_matched_trip_id_fkey (
          id,
          travel_date,
          departure_time,
          transport_mode
        )
      `)
      .in('status', ['pending', 'matched'])
      .gte('desired_delivery_date', new Date().toISOString().split('T')[0]); // Only future deliveries

    // If userOnly is true, filter by current user's parcels
    if (userOnly) {
      query = query.eq('user_id', user.id);
    }

    // Add search filters if provided
    if (origin) {
      query = query.ilike('origin', `%${origin}%`);
    }
    if (destination) {
      query = query.ilike('destination', `%${destination}%`);
    }

    const { data: parcels, error } = await query
      .order('desired_delivery_date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch parcels' },
        { status: 500 }
      );
    }

    return NextResponse.json({ parcels });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const parcelId = searchParams.get('id');

    if (!parcelId) {
      return NextResponse.json(
        { error: 'Parcel ID is required' },
        { status: 400 }
      );
    }

    // Update parcel status to cancelled instead of deleting
    const { error } = await supabase
      .from('parcels')
      .update({ status: 'cancelled' })
      .eq('id', parcelId)
      .eq('user_id', user.id); // Ensure user can only cancel their own parcels

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to cancel parcel' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
