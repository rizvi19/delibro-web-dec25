import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED = ['picked_up','in_transit','delivered'] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  try {
    const body = await request.json()
    const status = body?.status as string
    if (!ALLOWED.includes(status as any)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Verify that current user is the accepted traveler for this parcel
    const { data: accepted, error: qErr } = await supabase
      .from('trip_requests')
      .select('id, traveler_id, parcel_id')
      .eq('parcel_id', id)
      .eq('status', 'accepted')
      .single()

    if (qErr || !accepted || accepted.traveler_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to update this parcel' }, { status: 403 })
    }

    const { error: updErr } = await supabase
      .from('parcels')
      .update({ status })
      .eq('id', id)

    if (updErr) {
      console.error('Failed to update parcel status', updErr)
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    }

    // If delivered, credit traveler wallet once based on price_offered
    if (status === 'delivered') {
      // find request + price
      const { data: req } = await supabase
        .from('trip_requests')
        .select('id, price_offered, traveler_id')
        .eq('parcel_id', id)
        .eq('status', 'accepted')
        .single()

      if (req && req.traveler_id === user.id) {
        const price = Number(req.price_offered || 0)
        if (price > 0) {
          const commission = Number(process.env.NEXT_PUBLIC_PLATFORM_COMMISSION || 0.25)
          const net = Math.round((price * (1 - commission)) * 100) / 100

          // ensure not credited already
          const { data: existing } = await supabase
            .from('wallet_transactions')
            .select('id')
            .eq('user_id', user.id)
            .eq('related_request_id', req.id)
            .limit(1)
          if (!existing || existing.length === 0) {
            // upsert wallet
            await supabase
              .from('wallets')
              .upsert({ user_id: user.id, balance: 0 })
            // insert txn
            await supabase
              .from('wallet_transactions')
              .insert([{ user_id: user.id, amount: net, type: 'credit', description: 'Delivery payout', related_request_id: req.id }])
            // update balance
            const { data: w } = await supabase
              .from('wallets')
              .select('balance')
              .eq('user_id', user.id)
              .single()
            const bal = Number(w?.balance || 0) + net
            await supabase
              .from('wallets')
              .update({ balance: bal, updated_at: new Date().toISOString() })
              .eq('user_id', user.id)
          }
        }
      }
    }

    return NextResponse.json({ success: true, status })
  } catch (e) {
    console.error('status update error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
