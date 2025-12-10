import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function isDataUrl(s?: string | null) { return !!s && /^data:.*;base64,/.test(s) }

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const { fullName, phone, nidNumber, nidFront, nidBack, selfie, vehicleType, driverLicense } = body
    if (!fullName || !phone || !nidNumber) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    // Upload images if present
    const upload = async (dataUrl?: string | null) => {
      if (!isDataUrl(dataUrl)) return null
      const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
      if (!match) return null
      const contentType = match[1]
      const base64 = match[2]
      const buffer = Buffer.from(base64, 'base64')
      const ext = contentType.split('/')[1] || 'png'
      const filename = `kyc/${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('parcel-images').upload(filename, buffer, { contentType })
      if (error) throw error
      const { data: pub } = await supabase.storage.from('parcel-images').getPublicUrl(data.path)
      return pub?.publicUrl || null
    }

    const nid_front_url = await upload(nidFront)
    const nid_back_url = await upload(nidBack)
    const selfie_url = await upload(selfie)
    const driver_license_url = await upload(driverLicense)

    const { data, error } = await supabase
      .from('kyc_submissions')
      .insert([{
        user_id: user.id,
        full_name: fullName,
        phone,
        nid_number: nidNumber,
        nid_front_url,
        nid_back_url,
        selfie_url,
        vehicle_type: vehicleType || null,
        driver_license_url: driver_license_url || null,
        status: 'pending',
      }])
      .select('*')
      .single()
    if (error) throw error
    return NextResponse.json({ success: true, submission: data })
  } catch (e: any) {
    console.error('KYC submit error', e)
    return NextResponse.json({ error: 'Failed to submit KYC' }, { status: 500 })
  }
}

