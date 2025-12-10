import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function uploadBase64Image(dataUrl: string, userId: string): Promise<string | null> {
  try {
    const supabase = createSupabaseServerClient()
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
    if (!match) return null
    const contentType = match[1]
    const base64 = match[2]
    const buffer = Buffer.from(base64, 'base64')
    const ext = contentType.split('/')[1] || 'png'
    const filename = `${userId}/${Date.now()}.${ext}`

    const { data, error } = await supabase.storage.from('parcel-images').upload(filename, buffer, {
      contentType,
      upsert: false,
    })
    if (error) {
      console.error('Storage upload error', error)
      return null
    }
    const { data: pub } = await supabase.storage.from('parcel-images').getPublicUrl(data.path)
    return pub?.publicUrl || null
  } catch (e) {
    console.error('uploadBase64Image error', e)
    return null
  }
}

