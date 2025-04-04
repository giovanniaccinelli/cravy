// app/cart/[userId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firebase config
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { useRouter } from 'next/navigation'; // To redirect user to instacart link

export default function CartPage({ params }) {
  const { userId } = params; // Get userId from the URL
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const [instacartLink, setInstacartLink] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      const cartRef = doc(db, 'carts', userId); // Get user cart from Firestore
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        setCartItems(cartSnap.data().items);  // Populate cart items
      } else {
        setCartItems([]);  // Empty cart if no data found
      }
    };

    fetchCart();
  }, [userId]);

  // Handle redirection to Instacart
  const redirectToInstacart = () => {
    if (instacartLink) {
      window.location.href = instacartLink; // Redirect to instacart link
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Your Cart</h1>

      {/* Display cart items */}
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="w-full max-w-2xl">
          <ul className="list-disc pl-5 text-gray-800 mb-6">
            {cartItems.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{item.quantity} {item.selectedUnit} {item.selectedIngredient}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display instacart link and redirect button */}
      {cartItems.length > 0 && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Paste Instacart Link"
            className="p-2 border border-gray-300 rounded mb-4"
            value={instacartLink}
            onChange={(e) => setInstacartLink(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={redirectToInstacart}
          >
            Redirect to Instacart
          </button>
        </div>
      )}
    </div>
  );
}
