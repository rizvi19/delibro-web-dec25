import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BaggageClaim, ArrowRight } from 'lucide-react';

// This is a placeholder component.
// In a real app, this data would come from an API.
const sampleMatches = [
    {
        id: '1',
        parcel: 'Important Documents',
        traveler: 'Arif Hossain',
        route: 'Dhaka to Sylhet',
        status: 'Matched',
        date: '2024-08-15'
    },
    {
        id: '2',
        parcel: 'Laptop Charger',
        traveler: 'Fatima Ahmed',
        route: 'Chittagong to Dhaka',
        status: 'In Transit',
        date: '2024-08-12'
    },
];

export default function DashboardPage() {
    return (
        <div className="container mx-auto max-w-7xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Your Dashboard</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Manage your trips and parcel deliveries.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleMatches.map(match => (
                    <Card key={match.id} className="flex flex-col">
                        <CardHeader>
                            <div className='flex items-center gap-4'>
                                <BaggageClaim className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="font-headline">{match.parcel}</CardTitle>
                                    <CardDescription>Trip: {match.route}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">Traveler: {match.traveler}</p>
                            <p className="text-sm text-muted-foreground">Date: {match.date}</p>
                            <p className="text-sm font-medium mt-2">Status: <span className="text-primary">{match.status}</span></p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                 <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-accent">
                    <CardHeader>
                        <CardTitle className="font-headline">Looking for more? </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                         <p className="text-muted-foreground mb-4">Post a new trip or parcel request.</p>
                         <div className='flex gap-2'>
                            <Button variant="outline">Send a Parcel</Button>
                            <Button>Post a Trip</Button>
                         </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
