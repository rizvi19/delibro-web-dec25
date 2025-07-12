import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PackageSearch, CircleCheck, Truck, Home } from 'lucide-react';

export default function TrackPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
        <Card className="w-full">
            <CardHeader className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                    <PackageSearch className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-headline">Track Your Parcel</CardTitle>
                <CardDescription>
                    Enter your tracking ID to see the latest updates on your delivery.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full items-center space-x-2">
                    <Input type="text" placeholder="Enter Tracking ID (e.g., DLB12345)" />
                    <Button type="submit">Track</Button>
                </div>
            </CardContent>
        </Card>

        {/* Placeholder for tracking results */}
        <div className="mt-8">
            <h3 className="text-xl font-bold font-headline mb-4">Tracking Details for #DLB12345</h3>
            <Card>
                <CardContent className="p-6">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-5 top-0 h-full w-0.5 bg-border -z-10"></div>

                        <div className="flex items-start gap-4 mb-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <CircleCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Parcel Picked Up</p>
                                <p className="text-sm text-muted-foreground">August 12, 2024, 10:00 AM - Dhaka</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">In Transit</p>
                                <p className="text-sm text-muted-foreground">Your parcel is on its way to Chittagong.</p>
                            </div>
                        </div>

                         <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                <Home className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Out for Delivery</p>
                                <p className="text-sm text-muted-foreground">Estimated Delivery: August 13, 2024</p>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
