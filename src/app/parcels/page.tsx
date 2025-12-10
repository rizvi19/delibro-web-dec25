'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { LocationCombobox } from '@/components/location-combobox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

export default function ParcelsPage() {
  const { toast } = useToast()
  const [parcels, setParcels] = useState<any[]>([])
  const [trips, setTrips] = useState<any[]>([])
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedParcel, setSelectedParcel] = useState<any | null>(null)
  const [selectedTrip, setSelectedTrip] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParcels()
    fetchTrips()
  }, [])

  const fetchParcels = async () => {
    try {
      const params = new URLSearchParams({})
      if (origin) params.append('origin', origin)
      if (destination) params.append('destination', destination)
      const res = await fetch(`/api/parcels?${params.toString()}`)
      const data = await res.json()
      if (res.ok) setParcels((data.parcels || []).filter((p: any) => p.status === 'pending'))
    } finally { setLoading(false) }
  }

  const fetchTrips = async () => {
    try {
      const res = await fetch(`/api/trips?userOnly=true`)
      const data = await res.json()
      if (res.ok) setTrips(data.trips || [])
    } catch {}
  }

  const sendOffer = async () => {
    if (!selectedParcel || !selectedTrip) return
    try {
      const res = await fetch('/api/trip-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: selectedTrip,
          parcelId: selectedParcel.id,
          message: 'Offer to carry',
          priceOffered: price ? parseFloat(price) : null,
        })
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Offer sent', description: 'Waiting for sender response.' })
        setSelectedParcel(null)
        setSelectedTrip('')
        setPrice('')
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to send offer', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to send offer', variant: 'destructive' })
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Available Parcel Requests</h1>
        <p className="mt-2 text-lg text-muted-foreground">Travelers can offer to carry suitable parcels.</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>From</Label>
              <LocationCombobox name="origin" onValueChange={setOrigin} />
            </div>
            <div>
              <Label>To</Label>
              <LocationCombobox name="destination" onValueChange={setDestination} />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => { setLoading(true); fetchParcels() }}>Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcels.map(p => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{p.details}</CardTitle>
                <CardDescription>{p.origin} → {p.destination}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Weight: {p.weight_kg} kg</p>
                {p.price_estimate && (
                  <p className="text-sm text-muted-foreground">Est. Price: {p.price_estimate}</p>
                )}
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setSelectedParcel(p)}>Offer to Carry</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Offer to Carry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Choose Your Trip</Label>
                        <select className="w-full p-2 border rounded-md" value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
                          <option value="">Select trip...</option>
                          {trips.map((t:any) => (
                            <option key={t.id} value={t.id}>{t.origin} → {t.destination} on {t.travel_date}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Price Offer (optional)</Label>
                        <Input value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={sendOffer} disabled={!selectedTrip}>Send Offer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

