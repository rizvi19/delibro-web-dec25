import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // For now, we'll just return a success message
    // In a real implementation, you would upload to Supabase Storage
    // const fileBuffer = await file.arrayBuffer();
    // const fileName = `${user.id}/${Date.now()}_${file.name}`;
    // 
    // const { data, error } = await supabase.storage
    //   .from('parcel-images')
    //   .upload(fileName, fileBuffer, {
    //     contentType: file.type,
    //   });

    // For demo purposes, we'll just return a placeholder URL
    const imageUrl = `https://via.placeholder.com/400x300.png?text=Parcel+Image`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
