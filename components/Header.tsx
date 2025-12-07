'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

export default function Header() {
  const [isOwner, setIsOwner] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth');
      const data = await response.json();
      setIsOwner(data.isOwner);
    } catch (err) {
      console.error('Auth check failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setIsOwner(false);
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              HR Document Review
            </Link>
            <nav className="flex gap-4 items-center">
              <Link href="/" className="hover:underline">
                Documents
              </Link>
              {isOwner ? (
                <>
                  <span className="px-3 py-1 bg-green-500 rounded-full text-sm">
                    Owner Mode
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-md"
                >
                  Owner Login
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          checkAuth();
        }}
      />
    </>
  );
}
