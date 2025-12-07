import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/notion';

export async function GET(request: NextRequest) {
  try {
    const documents = await getDocuments();
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error in documents API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
