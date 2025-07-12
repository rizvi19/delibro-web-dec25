'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Box, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef, useActionState } from 'react';
import { sendParcelAction, type ParcelFormState } from './actions';
import { LocationCombobox } from '@/components/location-combobox';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Searching...' : 'Find a Traveler'}
    </Button>
  );
}

export default function SendParcelPage() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: ParcelFormState = {
    success: false,
    message: '',
    errors: null,
  };

  const [state, formAction] = useActionState(sendParcelAction, initialState);

   useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Oops!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-accent/50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <form ref={formRef} action={formAction}>
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
                <LocationCombobox name="origin" />
                 {state.errors?.origin && <p className="text-sm font-medium text-destructive">{state.errors.origin[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <LocationCombobox name="destination" />
                {state.errors?.destination && <p className="text-sm font-medium text-destructive">{state.errors.destination[0]}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parcelDetails">Parcel Details</Label>
              <Input name="parcelDetails" id="parcelDetails" placeholder="e.g., A small box of books" required />
               {state.errors?.parcelDetails && <p className="text-sm font-medium text-destructive">{state.errors.parcelDetails[0]}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="parcelWeight">Weight (kg)</Label>
                <Input name="parcelWeight" id="parcelWeight" type="number" placeholder="e.g., 2.5" required />
                {state.errors?.parcelWeight && <p className="text-sm font-medium text-destructive">{state.errors.parcelWeight[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deliveryDate">Desired Delivery By</Label>
                <Input name="deliveryDate" id="deliveryDate" type="date" required />
                {state.errors?.deliveryDate && <p className="text-sm font-medium text-destructive">{state.errors.deliveryDate[0]}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea name="notes" id="notes" placeholder="e.g., Fragile item, handle with care." />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
