import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Box } from 'lucide-react';

export default function SendParcelPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-accent/50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <Box className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">Send a Parcel</CardTitle>
            <CardDescription>
            Fill in the details below to find a traveler for your delivery.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input id="origin" placeholder="e.g., Dhaka" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input id="destination" placeholder="e.g., Chittagong" required />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="parcel-details">Parcel Details</Label>
                <Input id="parcel-details" placeholder="e.g., A small box of books" required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="parcel-weight">Weight (kg)</Label>
                    <Input id="parcel-weight" type="number" placeholder="e.g., 2.5" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="delivery-date">Desired Delivery By</Label>
                    <Input id="delivery-date" type="date" required />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea id="notes" placeholder="e.g., Fragile item, handle with care." />
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">Find a Traveler</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
