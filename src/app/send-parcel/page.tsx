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
import { Box, Loader2, Camera, Upload } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef, useActionState, useState } from 'react';
import { sendParcelAction, type ParcelFormState } from './actions';
import { LocationCombobox } from '@/components/location-combobox';
import Image from 'next/image';
import { CameraView } from '@/components/camera-view';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [size, setSize] = useState<'small'|'medium'|'large'|'xl'>('medium');
  const [pickupStart, setPickupStart] = useState('')
  const [pickupEnd, setPickupEnd] = useState('')
  const [deliveryStart, setDeliveryStart] = useState('')
  const [deliveryEnd, setDeliveryEnd] = useState('')


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
        setImagePreview(null);
      }
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoTaken = (dataUri: string) => {
    setImagePreview(dataUri);
    setShowCamera(false);
  }

  if (showCamera) {
      return <CameraView onPhotoTaken={handlePhotoTaken} onBack={() => setShowCamera(false)} />
  }


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
                <Input name="parcelWeight" id="parcelWeight" type="number" placeholder="e.g., 2.5" required step="0.1" />
                {state.errors?.parcelWeight && <p className="text-sm font-medium text-destructive">{state.errors.parcelWeight[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deliveryDate">Desired Delivery By</Label>
                <Input name="deliveryDate" id="deliveryDate" type="date" required />
                {state.errors?.deliveryDate && <p className="text-sm font-medium text-destructive">{state.errors.deliveryDate[0]}</p>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pickupStart">Pickup Window Start</Label>
                <Input name="pickupStart" id="pickupStart" type="time" value={pickupStart} onChange={e=>setPickupStart(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pickupEnd">Pickup Window End</Label>
                <Input name="pickupEnd" id="pickupEnd" type="time" value={pickupEnd} onChange={e=>setPickupEnd(e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deliveryStart">Delivery Window Start</Label>
                <Input name="deliveryStart" id="deliveryStart" type="time" value={deliveryStart} onChange={e=>setDeliveryStart(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deliveryEnd">Delivery Window End</Label>
                <Input name="deliveryEnd" id="deliveryEnd" type="time" value={deliveryEnd} onChange={e=>setDeliveryEnd(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Parcel Size</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  {key:'small', label:'Small'},
                  {key:'medium', label:'Medium'},
                  {key:'large', label:'Large'},
                  {key:'xl', label:'XL'},
                ].map(opt => (
                  <label key={opt.key} className={`flex items-center justify-center border rounded-md py-2 cursor-pointer ${size===opt.key ? 'border-primary' : 'border-muted'}`}>
                    <input type="radio" name="size" value={opt.key} className="hidden" onChange={() => setSize(opt.key as any)} defaultChecked={opt.key==='medium'} />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Parcel Image</Label>
              <div className="w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                {imagePreview ? (
                    <div className="relative w-full max-w-sm">
                      <Image
                        src={imagePreview}
                        alt="Parcel preview"
                        width={400}
                        height={300}
                        className="rounded-md object-cover"
                      />
                       <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setImagePreview(null)}>Remove</Button>
                    </div>
                ) : (
                  <div className='flex flex-col items-center gap-4'>
                    <p className="text-sm text-muted-foreground">Add a photo of your parcel.</p>
                    <div className="flex gap-4">
                       <Button type="button" onClick={() => setShowCamera(true)}>
                         <Camera className="mr-2 h-4 w-4" />
                         Take Photo
                       </Button>
                       <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                         <Upload className="mr-2 h-4 w-4" />
                         Upload File
                       </Button>
                    </div>
                  </div>
               )}
              </div>
               <Input type="file" name="parcelImage" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               {imagePreview && <input type="hidden" name="parcelImageData" value={imagePreview} />}
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
