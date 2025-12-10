import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;
    const body = await request.json();
    const { status } = body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "rejected"' },
        { status: 400 }
      );
    }

    // Get the trip request and verify the user is the traveler
    const { data: tripRequest, error: fetchError } = await supabase
      .from('trip_requests')
      .select(`
        *,
        parcels (id, user_id),
        trips (id, user_id)
      `)
      .eq('id', id)
      .single();

    if (fetchError || !tripRequest) {
      return NextResponse.json(
        { error: 'Trip request not found or unauthorized' },
        { status: 404 }
      );
    }

    // Ensure current user is involved (either traveler or sender)
    if (tripRequest.traveler_id !== user.id && tripRequest.sender_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this request' },
        { status: 403 }
      );
    }

    // Update the trip request status
    const { error: updateError } = await supabase
      .from('trip_requests')
      .update({ status })
      .eq('id', id);

    if (updateError) {
      console.error('Supabase error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update trip request' },
        { status: 500 }
      );
    }

    // If accepted, update the parcel status to matched
    if (status === 'accepted') {
      await supabase
        .from('parcels')
        .update({ 
          status: 'matched',
          matched_trip_id: tripRequest.trip_id
        })
        .eq('id', tripRequest.parcel_id);
    }

    // Create notification for the sender
    const notificationTitle = status === 'accepted' 
      ? 'Trip Request Accepted!' 
      : 'Trip Request Rejected';
    
    const notificationMessage = status === 'accepted'
      ? 'Your parcel delivery request has been accepted. The traveler will contact you soon.'
      : 'Your parcel delivery request has been rejected. Try finding another traveler.';

    await supabase
      .from('notifications')
      .insert([
        {
          user_id: tripRequest.sender_id,
          title: notificationTitle,
          message: notificationMessage,
          type: status === 'accepted' ? 'request_accepted' : 'request_rejected',
          related_trip_id: tripRequest.trip_id,
          related_parcel_id: tripRequest.parcel_id,
          related_request_id: tripRequest.id,
        },
      ]);

    return NextResponse.json({ 
      success: true,
      status,
      tripRequest: { ...tripRequest, status }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
