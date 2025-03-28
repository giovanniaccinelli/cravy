'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="w-full flex justify-between items-center py-6 px-4 border-b border-gray-200">
      <h1 className="text-4xl font-bold text-red-600">
        <Link href="/">Cravy</Link>
      </h1>
  
      <nav className="flex space-x-4 text-red-600 text-lg items-center">
        <Link href="/">
          <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-black border border-gray-300">
            Home
          </button>
        </Link>
  
        {user ? (
          <Link href="/profile">Creator Profile</Link>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
  
}
