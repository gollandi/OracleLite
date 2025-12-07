import { NextRequest, NextResponse } from 'next/server';
import { getDocument, getDocumentVersions } from '@/lib/notion';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const document = await getDocument(id);
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const versions = await getDocumentVersions(id);
    
    return NextResponse.json({ document, versions });
  } catch (error) {
    console.error('Error in document API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}
