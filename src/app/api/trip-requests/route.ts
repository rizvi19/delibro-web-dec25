import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { tripId, parcelId, message, priceOffered } = body;

    if (!tripId || !parcelId) {
      return NextResponse.json(
        { error: 'Trip ID and Parcel ID are required' },
        { status: 400 }
      );
    }

    // Get trip details to find the traveler
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Get parcel owner as the sender
    const { data: parcel, error: parcelError } = await supabase
      .from('parcels')
      .select('user_id')
      .eq('id', parcelId)
      .single();

    if (parcelError || !parcel) {
      return NextResponse.json(
        { error: 'Parcel not found' },
        { status: 404 }
      );
    }

    // Create trip request
    const { data: tripRequest, error } = await supabase
      .from('trip_requests')
      .insert([
        {
          trip_id: tripId,
          parcel_id: parcelId,
          sender_id: parcel.user_id,
          traveler_id: trip.user_id,
          message,
          price_offered: priceOffered,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'You have already requested this trip for this parcel' },
          { status: 409 }
        );
      }
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create trip request' },
        { status: 500 }
      );
    }

    // Create notification for the traveler
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: trip.user_id,
          title: 'New Trip Request',
          message: `Someone wants to send a parcel on your trip${message ? `: ${message}` : '.'}`,
          type: 'trip_request',
          related_trip_id: tripId,
          related_parcel_id: parcelId,
          related_request_id: tripRequest.id,
        },
      ]);

    return NextResponse.json({ tripRequest });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
  const type = searchParams.get('type'); // 'sent' or 'received'

  try {
    let query = supabase
      .from('trip_requests')
      .select(`
        *,
        trips (
          id,
          origin,
          destination,
          travel_date,
          departure_time,
          transport_mode,
          available_capacity
        ),
        parcels (
          id,
          origin,
          destination,
          details,
          weight_kg,
          desired_delivery_date
        ),
        sender:profiles!trip_requests_sender_id_fkey (
          name,
          phone,
          avatar_url
        ),
        traveler:profiles!trip_requests_traveler_id_fkey (
          name,
          phone,
          avatar_url
        )
      `);

    if (type === 'sent') {
      query = query.eq('sender_id', user.id);
    } else if (type === 'received') {
      query = query.eq('traveler_id', user.id);
    } else {
      // Get all requests where user is either sender or traveler
      query = query.or(`sender_id.eq.${user.id},traveler_id.eq.${user.id}`);
    }

    const { data: requests, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch trip requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
