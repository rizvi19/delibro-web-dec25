'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMeetingPointSuggestion } from '@/app/actions';
import { useState } from 'react';
import type { SuggestMeetingPointOutput } from '@/ai/flows/suggest-meeting-point';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, MapPin, BrainCircuit } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  travelerLocation: z.string().min(2, 'Traveler location is required.'),
  recipientLocation: z.string().min(2, 'Recipient location is required.'),
  travelRoute: z.string().min(5, 'Travel route is required.'),
  travelDate: z.string().min(1, 'Travel date is required.'),
  availableCapacity: z.string().min(1, 'Available capacity is required.'),
  trafficConditions: z.string().min(1, 'Traffic conditions are required.'),
});

export default function AIAssistantForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] =
    useState<SuggestMeetingPointOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travelerLocation: 'Gulshan, Dhaka',
      recipientLocation: 'Dhanmondi, Dhaka',
      travelRoute: 'Dhaka to Chittagong',
      travelDate: new Date().toISOString().split('T')[0],
      availableCapacity: '1 small box',
      trafficConditions: 'Moderate',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);

    const result = await getMeetingPointSuggestion(values);

    if (result.success) {
      setSuggestion(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }

    setIsLoading(false);
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="travelerLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traveler's Current Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gulshan, Dhaka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient's Current Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dhanmondi, Dhaka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="travelRoute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Route</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dhaka to Chittagong" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="travelDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5kg or 1 medium box" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="trafficConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Traffic Conditions</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Heavy, Moderate, Light" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? 'Thinking...' : 'Get Suggestion'}
            </Button>
          </form>
        </Form>

        {(isLoading || suggestion) && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">
              AI Suggestion
            </h3>
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ) : (
              suggestion && (
                <Card className="bg-accent border-primary/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Suggested Meeting Point</h4>
                        <p className="text-muted-foreground">{suggestion.suggestedMeetingPoint}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Suggested Time</h4>
                        <p className="text-muted-foreground">{suggestion.suggestedMeetingTime}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <BrainCircuit className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Reasoning</h4>
                        <p className="text-muted-foreground">{suggestion.reasoning}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
