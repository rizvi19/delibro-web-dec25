
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
        <div className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <LocationCombobox name="origin" onValueChange={setOrigin} placeholder="Pick-up Location" />
                </div>
                <div className="space-y-2">
                    <LocationCombobox name="destination" onValueChange={setDestination} placeholder="Delivery Location" />
                </div>
                <div className="space-y-2">
                    <Select onValueChange={setSize} defaultValue={size} name="parcel-size">
                        <SelectTrigger className="w-full h-12 border-2 border-orange-400 rounded-lg bg-white/90 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Parcel Size" />
                        </SelectTrigger>
                        <SelectContent>
                            {parcelSizes.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={calculatePrice} className="w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg">
                    See Prices
                </Button>
            </div>

                {error && (
                     <Alert 
                        variant="destructive" 
                        className="bg-red-50 border-2 border-red-300 shadow-lg cursor-pointer hover:bg-red-100 transition-colors"
                        onClick={() => setError('')}
                     >
                        <Info className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
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
    )
}
