'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Ship, Search, MapPin, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { LocationCombobox } from '@/components/location-combobox';
import { useToast } from '@/hooks/use-toast';

interface Trip {
  id: string;
  origin: string;
  destination: string;
  travel_date: string;
  departure_time: string;
  transport_mode: string;
  seat_info?: string;
  available_capacity: string;
  notes?: string;
  status: string;
  profiles: {
    name: string;
    phone?: string;
    avatar_url?: string;
  };
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [priceOffered, setPriceOffered] = useState('');
  const [selectedParcel, setSelectedParcel] = useState('');
  const [userParcels, setUserParcels] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrips();
    fetchUserParcels();
  }, []);

  const fetchTrips = async () => {
    try {
      const params = new URLSearchParams();
      if (searchOrigin) params.append('origin', searchOrigin);
      if (searchDestination) params.append('destination', searchDestination);
      if (searchDate) params.append('date', searchDate);

      const response = await fetch(`/api/trips?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTrips(data.trips || []);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch trips',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch trips',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserParcels = async () => {
    try {
      const response = await fetch('/api/parcels?userOnly=true');
      const data = await response.json();
      
      if (response.ok) {
        setUserParcels(data.parcels?.filter((p: any) => p.status === 'pending') || []);
      }
    } catch (error) {
      console.error('Failed to fetch user parcels:', error);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchTrips();
  };

  const handleRequestTrip = async () => {
    if (!selectedTrip || !selectedParcel) return;

    try {
      const response = await fetch('/api/trip-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: selectedTrip.id,
          parcelId: selectedParcel,
          message: requestMessage,
          priceOffered: priceOffered ? parseFloat(priceOffered) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Trip request sent successfully',
        });
        setSelectedTrip(null);
        setRequestMessage('');
        setPriceOffered('');
        setSelectedParcel('');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to send trip request',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send trip request',
        variant: 'destructive'
      });
    }
  };

  const formatTransportMode = (mode: string) => {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-12 px-4">
        <div className="text-center">Loading trips...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Available Trips</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find travelers going your way and send your parcels with them.
        </p>
      </div>

      {/* Search Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="origin">From</Label>
              <LocationCombobox 
                name="origin" 
                onValueChange={setSearchOrigin}
              />
            </div>
            <div>
              <Label htmlFor="destination">To</Label>
              <LocationCombobox 
                name="destination" 
                onValueChange={setSearchDestination}
              />
            </div>
            <div>
              <Label htmlFor="date">Travel Date</Label>
              <Input
                id="date"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.length > 0 ? (
          trips.map(trip => (
            <Card key={trip.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Ship className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="font-headline text-lg">
                        {trip.origin} → {trip.destination}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {trip.profiles.name}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {formatTransportMode(trip.transport_mode)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(trip.travel_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {trip.departure_time}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Capacity: {trip.available_capacity}
                  </div>
                  {trip.seat_info && (
                    <div className="text-sm text-muted-foreground">
                      Seat: {trip.seat_info}
                    </div>
                  )}
                  {trip.notes && (
                    <div className="text-sm text-muted-foreground italic">
                      "{trip.notes}"
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedTrip(trip)}
                      disabled={userParcels.length === 0}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Trip
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Trip</DialogTitle>
                      <DialogDescription>
                        Send a request to {trip.profiles.name} to carry your parcel on their trip from {trip.origin} to {trip.destination}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="parcel">Select Parcel</Label>
                        <select
                          id="parcel"
                          className="w-full p-2 border rounded-md"
                          value={selectedParcel}
                          onChange={(e) => setSelectedParcel(e.target.value)}
                        >
                          <option value="">Choose a parcel...</option>
                          {userParcels.map(parcel => (
                            <option key={parcel.id} value={parcel.id}>
                              {parcel.details} ({parcel.weight_kg}kg) - {parcel.origin} to {parcel.destination}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Add a personal message..."
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price Offered (Optional)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          value={priceOffered}
                          onChange={(e) => setPriceOffered(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleRequestTrip}
                        disabled={!selectedParcel}
                      >
                        Send Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
          </div>
        )}
      </div>

      {userParcels.length === 0 && (
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">No parcels to send</h3>
                <p className="text-yellow-700">
                  You need to post a parcel first before you can request trips. 
                  <a href="/send-parcel" className="underline ml-1">Post a parcel now</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
