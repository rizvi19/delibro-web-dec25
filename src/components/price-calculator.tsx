
"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { LocationCombobox } from '@/components/location-combobox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getDistance } from '@/lib/distance-matrix';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const parcelSizes = [
    { value: "1.5", label: "Small (e.g., documents, phone)" },
    { value: "2.5", label: "Medium (e.g., shoebox, small appliance)" },
    { value: "4", label: "Large (e.g., backpack, instrument)" },
    { value: "6", label: "Extra Large (e.g., small suitcase)" },
];

export function PriceCalculator() {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [size, setSize] = useState('1.5');
    const [price, setPrice] = useState<number | null>(null);
    const [error, setError] = useState('');

    const calculatePrice = () => {
        setError('');
        setPrice(null);

        if (!origin || !destination) {
            setError('Please select both an origin and a destination.');
            return;
        }

        if (origin === destination) {
            setError('Origin and destination cannot be the same.');
            return;
        }

        const distance = getDistance(origin, destination);
        if (distance === -1) {
            setError('Sorry, we could not calculate the distance for this route.');
            return;
        }

        const sizeValue = parseFloat(size);
        const deliveryCharge = (0.75 * distance + 10 * sizeValue);
        
        setPrice(Math.round(deliveryCharge));
    };


    return (
        <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-2xl border">
            <div className="grid gap-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="origin">From</Label>
                        <LocationCombobox name="origin" onValueChange={setOrigin} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="destination">To</Label>
                        <LocationCombobox name="destination" onValueChange={setDestination} />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="parcel-size">Parcel Size</Label>
                    <Select onValueChange={setSize} defaultValue={size} name="parcel-size">
                        <SelectTrigger id="parcel-size">
                            <SelectValue placeholder="Select parcel size" />
                        </SelectTrigger>
                        <SelectContent>
                            {parcelSizes.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
                <Button onClick={calculatePrice} size="lg">See Prices</Button>

                {error && (
                     <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {price !== null && (
                    <div className="text-center mt-4 p-4 bg-accent rounded-lg border border-primary/20">
                        <p className="text-muted-foreground">Estimated Delivery Charge</p>
                        <p className="text-3xl font-bold text-primary">৳{price}</p>
                        <p className="text-xs text-muted-foreground mt-1">*This is an estimate. Final price may vary.</p>
                        <Button asChild className="mt-4 w-full">
                            <Link href="/signup">
                                Sign Up to Continue <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
