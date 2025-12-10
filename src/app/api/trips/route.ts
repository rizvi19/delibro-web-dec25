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
  const date = searchParams.get('date');
  const userOnly = searchParams.get('userOnly') === 'true';

  try {
    let query = supabase
      .from('trips')
      .select(`
        *,
        profiles!trips_user_id_fkey (
          name,
          phone,
          avatar_url
        )
      `)
      .eq('status', 'active')
      .gte('travel_date', new Date().toISOString().split('T')[0]); // Only future trips

    // If userOnly is true, filter by current user's trips
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
    if (date) {
      query = query.eq('travel_date', date);
    }

    const { data: trips, error } = await query
      .order('travel_date', { ascending: true })
      .order('departure_time', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch trips' },
        { status: 500 }
      );
    }

    return NextResponse.json({ trips });
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
    const tripId = searchParams.get('id');

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    // Update trip status to cancelled instead of deleting
    const { error } = await supabase
      .from('trips')
      .update({ status: 'cancelled' })
      .eq('id', tripId)
      .eq('user_id', user.id); // Ensure user can only cancel their own trips

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to cancel trip' },
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
