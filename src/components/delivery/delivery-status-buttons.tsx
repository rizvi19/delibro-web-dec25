'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ParcelStatus = 'pending'|'matched'|'picked_up'|'in_transit'|'delivered'|'cancelled'

export function DeliveryStatusButtons({ parcelId, status }: { parcelId: string; status: ParcelStatus }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const nextAction = () => {
    if (status === 'matched') return { label: 'Mark Picked Up', send: 'picked_up' }
    if (status === 'picked_up') return { label: 'Mark In Transit', send: 'in_transit' }
    if (status === 'in_transit') return { label: 'Mark Delivered', send: 'delivered' }
    return null
  }
  const na = nextAction()

  const submit = async () => {
    if (!na) return
    setPending(true)
    try {
      const res = await fetch(`/api/parcels/${parcelId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: na.send }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      router.refresh()
    } catch (e) {
      console.error(e)
      alert('Failed to update delivery status')
    } finally {
      setPending(false)
    }
  }

  if (!na) {
    return <div className="text-sm text-muted-foreground">{status === 'delivered' ? 'Delivered' : 'Awaiting update'}</div>
  }

  return (
    <Button size="sm" onClick={submit} disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
      {na.label}
    </Button>
  )
}

