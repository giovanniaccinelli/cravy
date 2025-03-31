'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firebase config
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

export default function CartPage({ params }) {
  const { userId } = params; // Get userId from the URL
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const cartRef = doc(db, 'carts', userId); // Reference to the user's cart in Firebase
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
