'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase configuration
import { getDoc, doc, updateDoc } from 'firebase/firestore'; // Firebase functions

export default function AdminPage() {
  const [cartUrl, setCartUrl] = useState('');
  const [instacartLink, setInstacartLink] = useState('');
  const [userId, setUserId] = useState("user123"); // Replace with actual user ID (e.g., from Firebase Auth)

  useEffect(() => {
    // Fetch the cart URL from Firebase
    const fetchCartUrl = async () => {
      const cartRef = doc(db, 'carts', userId); // Get the cart document of the user
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        setCartUrl(cartSnap.data().url);
      } else {
        setCartUrl('No cart URL available yet.');
      }
    };

    fetchCartUrl();
  }, [userId]);

  const handleRedirect = async () => {
    if (!instacartLink) return alert('Please paste the Instacart link.');

    // Update the user's cart with the Instacart link
    const cartRef = doc(db, 'carts', userId);
    await updateDoc(cartRef, { instacartLink });

    // Redirect the user to the Instacart link (this part happens in the user's browser)
    window.location.href = instacartLink;
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <p>Current Cart URL: {cartUrl}</p>
      <input
        type="text"
        placeholder="Paste Instacart Link here"
        value={instacartLink}
        onChange={(e) => setInstacartLink(e.target.value)}
      />
      <button onClick={handleRedirect}>
        Redirect User to Instacart Link
      </button>
    </div>
  );
}
