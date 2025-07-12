
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Ship } from 'lucide-react';
import { LocationCombobox } from '@/components/location-combobox';

export default function PostTripPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-accent/50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <Ship className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">Post Your Travel Plans</CardTitle>
            <CardDescription>
            Share your journey details and earn by carrying parcels for others.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="origin">From</Label>
                    <LocationCombobox />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="destination">To</Label>
                    <LocationCombobox />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="date">Date of Travel</Label>
                <Input id="date" type="date" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="capacity">Available Capacity</Label>
                <Input id="capacity" placeholder="e.g., 5kg, 1 medium suitcase" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea id="notes" placeholder="e.g., I can only carry documents, no fragile items." />
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">Post Trip</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
