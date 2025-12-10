import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AdminKycPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: submissions } = await supabase
    .from('kyc_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  async function Action({ id, status }: { id: string; status: 'approved'|'rejected' }) {
    'use server'
    const supa = createSupabaseServerClient()
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/kyc/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      cache: 'no-store'
    })
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <h1 className="text-3xl font-headline font-bold mb-6">KYC Submissions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(submissions || []).map((s: any) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="font-headline">{s.full_name} — {s.status}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Phone: {s.phone}</div>
              <div className="text-sm text-muted-foreground">NID: {s.nid_number}</div>
              <div className="flex gap-2 mt-3">
                {s.nid_front_url && <a className="underline" href={s.nid_front_url} target="_blank">NID Front</a>}
                {s.nid_back_url && <a className="underline" href={s.nid_back_url} target="_blank">NID Back</a>}
                {s.selfie_url && <a className="underline" href={s.selfie_url} target="_blank">Selfie</a>}
                {s.driver_license_url && <a className="underline" href={s.driver_license_url} target="_blank">Driver License</a>}
              </div>
              {s.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <form action={async () => {
                    'use server'
                    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/kyc/${s.id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ status: 'approved' }) })
                  }}>
                    <Button type="submit">Approve</Button>
                  </form>
                  <form action={async () => {
                    'use server'
                    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/kyc/${s.id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ status: 'rejected' }) })
                  }}>
                    <Button type="submit" variant="outline">Reject</Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

