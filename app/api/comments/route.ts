import { NextRequest, NextResponse } from 'next/server';
import { getComments, createComment } from '@/lib/notion';
import { checkOwnerAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const isOwner = checkOwnerAuth();
    const comments = await getComments(documentId, isOwner);
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error in comments API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { documentId, content, isPrivate, toMD } = await request.json();
    
    if (!documentId || !content) {
      return NextResponse.json(
        { error: 'Document ID and content are required' },
        { status: 400 }
      );
    }

    // Check if trying to create private comment without owner auth
    if ((isPrivate || toMD) && !checkOwnerAuth()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await createComment(documentId, content, isPrivate, toMD);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
