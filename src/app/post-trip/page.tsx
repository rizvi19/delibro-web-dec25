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
import { Ship, Loader2 } from 'lucide-react';
import { LocationCombobox } from '@/components/location-combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormState, useFormStatus } from 'react-dom';
import { postTripAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Posting...' : 'Post Trip'}
    </Button>
  );
}

export default function PostTripPage() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const initialState = {
    success: false,
    message: '',
    errors: null,
  };

  const [state, formAction] = useFormState(postTripAction, initialState);

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
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Ship className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
            Post Your Travel Plans
          </CardTitle>
          <CardDescription>
            Share your journey details and earn by carrying parcels for others.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="origin">From</Label>
                <LocationCombobox name="origin" />
                {state.errors?.origin && <p className="text-sm font-medium text-destructive">{state.errors.origin[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">To</Label>
                <LocationCombobox name="destination" />
                 {state.errors?.destination && <p className="text-sm font-medium text-destructive">{state.errors.destination[0]}</p>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="travelDate">Date of Travel</Label>
                <Input id="travelDate" name="travelDate" type="date" required />
                 {state.errors?.travelDate && <p className="text-sm font-medium text-destructive">{state.errors.travelDate[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input id="departureTime" name="departureTime" type="time" required />
                {state.errors?.departureTime && <p className="text-sm font-medium text-destructive">{state.errors.departureTime[0]}</p>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="transportMode">Mode of Transport</Label>
                 <Select name="transportMode" defaultValue='bus'>
                    <SelectTrigger id="transportMode">
                        <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="plane">Plane</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {state.errors?.transportMode && <p className="text-sm font-medium text-destructive">{state.errors.transportMode[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seatInfo">Seat/Ticket Number</Label>
                <Input id="seatInfo" name="seatInfo" placeholder="e.g., A1, CNB 12" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="availableCapacity">Available Capacity</Label>
              <Input
                id="availableCapacity"
                name="availableCapacity"
                placeholder="e.g., 5kg, 1 medium suitcase"
                required
              />
              {state.errors?.availableCapacity && <p className="text-sm font-medium text-destructive">{state.errors.availableCapacity[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="e.g., I can only carry documents, no fragile items."
              />
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
