'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function AcceptRejectButtons({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'accept'|'reject'|null>(null)

  const act = async (status: 'accepted' | 'rejected') => {
    setLoading(status === 'accepted' ? 'accept' : 'reject')
    try {
      const res = await fetch(`/api/trip-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed')
      router.refresh()
    } catch (e) {
      console.error(e)
      alert('Failed to update request')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <Button size="sm" className="flex-1" onClick={() => act('accepted')} disabled={loading!==null}>
        {loading==='accept' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
        Accept
      </Button>
      <Button size="sm" variant="outline" className="flex-1" onClick={() => act('rejected')} disabled={loading!==null}>
        {loading==='reject' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
        Reject
      </Button>
    </div>
  )
}

