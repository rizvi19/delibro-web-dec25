
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Box, Ship } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
<<<<<<< HEAD
    const supabase = createSupabaseServerClient();
=======
    const supabase = await createSupabaseServerClient();
>>>>>>> cf5971e (signup login backend)

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const { data: parcels, error: parcelsError } = await supabase
        .from('parcels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (tripsError || parcelsError) {
        console.error('Error fetching dashboard data:', tripsError || parcelsError);
        // You might want to show an error message to the user
        
    }

    return (
        <div className="container mx-auto max-w-7xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Your Dashboard</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Manage your trips and parcel deliveries.
                </p>
            </div>

            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">Your Posted Trips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {trips && trips.length > 0 ? (
                        trips.map(trip => (
                            <Card key={trip.id} className="flex flex-col">
                                <CardHeader>
                                    <div className='flex items-center gap-4'>
                                        <Ship className="h-8 w-8 text-primary" />
                                        <div>
                                            <CardTitle className="font-headline">{trip.origin} to {trip.destination}</CardTitle>
                                            <CardDescription>On: {new Date(trip.travel_date).toLocaleDateString()}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">Transport: {trip.transport_mode}</p>
                                    <p className="text-sm text-muted-foreground">Capacity: {trip.available_capacity}</p>
                                    <p className="text-sm font-medium mt-2">Status: <span className="text-primary">Open</span></p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" disabled>
                                        View Matches <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                       <p className="text-muted-foreground col-span-full">You haven't posted any trips yet.</p>
                    )}
                     <Link href="/post-trip" className="flex flex-col items-center justify-center border-2 border-dashed bg-accent rounded-lg hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle className="font-headline">Post a New Trip</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground mb-4">Click here to share your travel plans.</p>
                            <Button>Post a Trip</Button>
                        </CardContent>
                     </Link>
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">Your Parcel Requests</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    <p className="text-sm text-muted-foreground">Deliver by: {new Date(parcel.desired_delivery_date).toLocaleDateString()}</p>
                                     <p className="text-sm font-medium mt-2">Status: <span className="text-primary">Searching</span></p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" disabled>
                                        View Matches <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-full">You haven't requested any parcel deliveries yet.</p>
                    )}
                    <Link href="/send-parcel" className="flex flex-col items-center justify-center border-2 border-dashed bg-accent rounded-lg hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle className="font-headline">Send a New Parcel</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground mb-4">Need something delivered? Post it here.</p>
                            <Button variant="outline">Send a Parcel</Button>
                        </CardContent>
                    </Link>
                </div>
            </section>
        </div>
    );
}
