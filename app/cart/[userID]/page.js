// app/cart/[userId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import your Firebase config
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods

export default function CartPage({ params }) {
  const { userId } = params; // Access userId from URL
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const cartRef = doc(db, 'carts', userId); // Get the cart for the specific user from Firebase
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        setCartItems(cartSnap.data().items);  // Populate cart items
      } else {
        setCartItems([]);  // Empty cart
      }
    };

    fetchCart();
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Your Cart</h1>

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
    </div>
  );
}
