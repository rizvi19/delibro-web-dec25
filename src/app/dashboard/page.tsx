
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Box, Ship, Bell, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AcceptRejectButtons } from '@/components/delivery/accept-reject-buttons';
import { DeliveryStatusButtons } from '@/components/delivery/delivery-status-buttons';

export default async function DashboardPage() {
    const supabase = createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user's trips
    const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    // Fetch user's parcels
    const { data: parcels, error: parcelsError } = await supabase
        .from('parcels')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'matched'])
        .order('created_at', { ascending: false });

    // Fetch trip requests received (for user's trips)
    const { data: receivedRequests, error: receivedError } = await supabase
        .from('trip_requests')
        .select(`
            *,
            parcels (
                id,
                details,
                weight_kg,
                origin,
                destination,
                status
            ),
            trips (
                id,
                origin,
                destination,
                travel_date
            ),
            profiles!trip_requests_sender_id_fkey (
                name,
                phone
            )
        `)
        .eq('traveler_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    // Fetch trip requests sent (user requesting to send parcels)
    const { data: sentRequests, error: sentError } = await supabase
        .from('trip_requests')
        .select(`
            *,
            parcels (
                id,
                details,
                weight_kg,
                origin,
                destination,
                status
            ),
            trips (
                id,
                origin,
                destination,
                travel_date
            ),
            profiles!trip_requests_traveler_id_fkey (
                name,
                phone
            )
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch accepted requests where the user is the traveler (active deliveries)
    const { data: activeDeliveries } = await supabase
        .from('trip_requests')
        .select(`
            id,
            parcel_id,
            trip_id,
            parcels (
                id,
                details,
                origin,
                destination,
                status
            ),
            trips (
                id,
                origin,
                destination,
                travel_date
            )
        `)
        .eq('traveler_id', user.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

    // Fetch unread notifications
    const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);

    if (tripsError || parcelsError || receivedError || sentError || notificationsError) {
        console.error('Error fetching dashboard data:', {
            tripsError,
            parcelsError,
            receivedError,
            sentError,
            notificationsError
        });
    }

    return (
        <div className="container mx-auto max-w-7xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Your Dashboard</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Manage your trips and parcel deliveries.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Ship className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">Active Trips</p>
                                <p className="text-2xl font-bold">{trips?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Box className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">Pending Parcels</p>
                                <p className="text-2xl font-bold">{parcels?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">Trip Requests</p>
                                <p className="text-2xl font-bold">{receivedRequests?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Bell className="h-8 w-8 text-orange-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                                <p className="text-2xl font-bold">{notifications?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Trip Requests */}
            {receivedRequests && receivedRequests.length > 0 && (
              <section className="mb-12">
                    <h2 className="text-2xl font-bold font-headline mb-4">Pending Trip Requests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {receivedRequests.slice(0, 4).map(request => (
                            <Card key={request.id} className="border-l-4 border-l-yellow-500">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="font-headline">
                                            {request.parcels?.details}
                                        </CardTitle>
                                        <Badge variant="secondary">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Pending
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        {request.parcels?.origin} to {request.parcels?.destination}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        From: {request.profiles?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Weight: {request.parcels?.weight_kg} kg
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Your trip: {request.trips?.origin} to {request.trips?.destination}
                                    </p>
                                    {request.message && (
                                        <p className="text-sm italic text-muted-foreground">
                                            "{request.message}"
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <AcceptRejectButtons requestId={request.id} />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Your Posted Trips */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold font-headline mb-4">Your Posted Trips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips && trips.length > 0 ? (
                        trips.map(trip => (
                            <Card key={trip.id} className="flex flex-col">
                                <CardHeader>
                                    <div className='flex items-center gap-4'>
                                        <Ship className="h-8 w-8 text-primary" />
                                        <div>
                                            <CardTitle className="font-headline">{trip.origin} to {trip.destination}</CardTitle>
                                            <CardDescription>
                                                {new Date(trip.travel_date).toLocaleDateString()} at {trip.departure_time}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">Transport: {trip.transport_mode}</p>
                                    <p className="text-sm text-muted-foreground">Capacity: {trip.available_capacity}</p>
                                    {trip.seat_info && (
                                        <p className="text-sm text-muted-foreground">Seat: {trip.seat_info}</p>
                                    )}
                                    <Badge className="mt-2" variant="outline">
                                        {trip.status}
                                    </Badge>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline">
                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                       <p className="text-muted-foreground col-span-full">You haven't posted any trips yet.</p>
                    )}
                     <Link href="/post-trip" className="flex flex-col items-center justify-center border-2 border-dashed bg-accent rounded-lg hover:border-primary transition-colors min-h-[200px]">
                        <div className="text-center p-6">
                            <Ship className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <CardTitle className="font-headline mb-2">Post a New Trip</CardTitle>
                            <p className="text-muted-foreground mb-4">Share your travel plans and earn by carrying parcels.</p>
                            <Button>Post a Trip</Button>
                        </div>
                     </Link>
                </div>
            </section>

            {/* Offers from Travelers on Your Parcels */}
            {sentRequests && sentRequests.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-2xl font-bold font-headline mb-4">Offers on Your Parcels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sentRequests.filter(r => r.status === 'pending').map(request => (
                            <Card key={request.id} className="border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="font-headline">
                                            {request.parcels?.details}
                                        </CardTitle>
                                    </div>
                                    <CardDescription>
                                        {request.parcels?.origin} to {request.parcels?.destination} — Offer from {request.profiles?.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {request.price_offered && (
                                        <p className="text-sm text-muted-foreground">Price offered: ৳{request.price_offered}</p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <AcceptRejectButtons requestId={request.id} />
                                </CardFooter>
                            </Card>
                        ))}
                        {sentRequests.filter(r => r.status === 'pending').length === 0 && (
                            <p className="text-muted-foreground">No pending offers at the moment.</p>
                        )}
                    </div>
                </section>
            )}
            
            {/* Your Parcel Requests */}
            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">Your Parcel Requests</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parcels && parcels.length > 0 ? (
                        parcels.map(parcel => (
                            <Card key={parcel.id} className="flex flex-col">
                                <CardHeader>
                                    <div className='flex items-center gap-4'>
                                        <Box className="h-8 w-8 text-primary" />
                                        <div>
                                            <CardTitle className="font-headline">{parcel.details}</CardTitle>
                                            <CardDescription>{parcel.origin} to {parcel.destination}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">Weight: {parcel.weight_kg} kg</p>
                                    <p className="text-sm text-muted-foreground">
                                        Deliver by: {new Date(parcel.desired_delivery_date).toLocaleDateString()}
                                    </p>
                                    <Badge className="mt-2" variant={parcel.status === 'matched' ? 'default' : parcel.status === 'in_transit' || parcel.status === 'picked_up' ? 'default' : parcel.status === 'delivered' ? 'outline' : 'secondary'}>
                                        {parcel.status === 'matched' && 'Matched!'}
                                        {parcel.status === 'picked_up' && 'Picked Up'}
                                        {parcel.status === 'in_transit' && 'In Transit'}
                                        {parcel.status === 'delivered' && 'Delivered'}
                                        {parcel.status === 'pending' && 'Searching...'}
                                        {parcel.status === 'cancelled' && 'Cancelled'}
                                    </Badge>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline">
                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-full">You haven't requested any parcel deliveries yet.</p>
                    )}
                    <Link href="/send-parcel" className="flex flex-col items-center justify-center border-2 border-dashed bg-accent rounded-lg hover:border-primary transition-colors min-h-[200px]">
                        <div className="text-center p-6">
                            <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <CardTitle className="font-headline mb-2">Send a New Parcel</CardTitle>
                            <p className="text-muted-foreground mb-4">Need something delivered? Find a traveler.</p>
                            <Button variant="outline">Send a Parcel</Button>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Active Deliveries (as Traveler) */}
            {activeDeliveries && activeDeliveries.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-2xl font-bold font-headline mb-4">Active Deliveries</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeDeliveries.map(d => (
                            <Card key={d.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="font-headline">{d.parcels?.details}</CardTitle>
                                    <CardDescription>
                                        {d.parcels?.origin} → {d.parcels?.destination}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Status: {d.parcels?.status}</p>
                                </CardContent>
                                <CardFooter>
                                    {d.parcels?.id && (
                                        <DeliveryStatusButtons parcelId={d.parcels.id} status={d.parcels.status} />
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
