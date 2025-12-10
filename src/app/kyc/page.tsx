'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function KycPage() {
  const { toast } = useToast()
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setPending(true)
    try {
      const toBase64 = async (file: File | null) => file ? await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); }) : ''
      const payload: any = {
        fullName: fd.get('fullName'),
        phone: fd.get('phone'),
        nidNumber: fd.get('nidNumber'),
        vehicleType: fd.get('vehicleType') || '',
      }
      const f1 = (fd.get('nidFront') as File) || null
      const f2 = (fd.get('nidBack') as File) || null
      const f3 = (fd.get('selfie') as File) || null
      const f4 = (fd.get('driverLicense') as File) || null
      payload.nidFront = await toBase64(f1)
      payload.nidBack = await toBase64(f2)
      payload.selfie = await toBase64(f3)
      payload.driverLicense = await toBase64(f4)

      const res = await fetch('/api/kyc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit KYC')
      toast({ title: 'KYC submitted', description: 'We will review your information shortly.' })
      form.reset()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to submit KYC', variant: 'destructive' })
    } finally { setPending(false) }
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Identity Verification (KYC)</CardTitle>
            <CardDescription>Provide your details to unlock all features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input name="fullName" required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>NID Number</Label>
                <Input name="nidNumber" required />
              </div>
              <div>
                <Label>Vehicle Type (optional)</Label>
                <Input name="vehicleType" placeholder="car/bike/bus/train/plane" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>NID Front</Label>
                <Input type="file" name="nidFront" accept="image/*" />
              </div>
              <div>
                <Label>NID Back</Label>
                <Input type="file" name="nidBack" accept="image/*" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Selfie</Label>
                <Input type="file" name="selfie" accept="image/*" />
              </div>
              <div>
                <Label>Driver License (optional)</Label>
                <Input type="file" name="driverLicense" accept="image/*" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={pending} className="w-full">{pending ? 'Submitting...' : 'Submit for Review'}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

