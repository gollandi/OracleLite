import { NextRequest, NextResponse } from 'next/server';
import { verifyOwnerPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (verifyOwnerPassword(password)) {
      cookies().set('owner_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in auth API:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    cookies().delete('owner_authenticated');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const isAuthenticated = cookieStore.get('owner_authenticated')?.value === 'true';
    return NextResponse.json({ isOwner: isAuthenticated });
  } catch (error) {
    return NextResponse.json({ isOwner: false });
  }
}
