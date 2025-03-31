'use client';

import { useEffect, useState } from 'react';
import { auth } from '../firebase';  // Firebase auth to get the logged-in user's email
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [cartUrl, setCartUrl] = useState('');
  const [instacartLink, setInstacartLink] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || user.email !== "giovanni.accinelli@gmail.com") {
        // If the user is not the admin, redirect them
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Get the cart URL from localStorage
    const savedCartUrl = localStorage.getItem('currentCartUrl');
    setCartUrl(savedCartUrl || '');
  }, []);

  const handleSubmitLink = () => {
    if (!instacartLink) {
      alert('Please enter a valid Instacart link.');
      return;
    }

    // Redirect the user who clicked "Order Cart" to the generated Instacart link
    window.location.href = instacartLink;
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-4xl font-bold text-red-600 mb-6">Admin Panel</h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Cart URL</h2>
      <textarea
        className="p-2 border border-gray-300 rounded w-full max-w-xl"
        value={cartUrl}
        readOnly
      />

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Paste Instacart Link Here</h2>
      <input
        type="text"
        className="p-2 border border-gray-300 rounded w-full max-w-xl"
        value={instacartLink}
        onChange={(e) => setInstacartLink(e.target.value)}
        placeholder="Paste your Instacart link here"
      />

      <button
        onClick={handleSubmitLink}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Submit and Redirect User
      </button>
    </div>
  );
}
