import { NextRequest, NextResponse } from 'next/server';
import { addDocumentVersion } from '@/lib/notion';
import { checkOwnerAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check owner authentication
    if (!checkOwnerAuth()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { documentId, version, fileUrl, fileName, changeLog, uploadedBy } = await request.json();
    
    if (!documentId || !version || !fileUrl || !fileName || !changeLog) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await addDocumentVersion(
      documentId,
      version,
      fileUrl,
      fileName,
      changeLog,
      uploadedBy || 'Owner'
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding version:', error);
    return NextResponse.json(
      { error: 'Failed to add version' },
      { status: 500 }
    );
  }
}
