'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firebase configuration
import { setDoc, doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { getAuth } from 'firebase/auth'; // Firebase authentication
import { v4 as uuidv4 } from 'uuid'; // To generate a unique cart ID

export default function CartPage({ params }) {
  const { userId } = params; // Access userId from URL (dynamic routing)
  const [cartItems, setCartItems] = useState([]);
  const [aggregatedCart, setAggregatedCart] = useState([]);
  const [cartUrl, setCartUrl] = useState(''); // Store the unique cart URL
  const [instacartLink, setInstacartLink] = useState(''); // Store the Instacart link

  useEffect(() => {
    // Fetch cart data from Firebase
    const fetchCart = async () => {
      const cartRef = doc(db, 'carts', userId);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        setCartItems(cartSnap.data().items); // Populate cart items from Firebase
        setCartUrl(cartSnap.data().cartUrl); // Set the unique cart URL
      }
    };

    fetchCart();
  }, [userId]);

  useEffect(() => {
    // Generate a unique cart URL when the user’s cart is loaded
    const uniqueCartUrl = `https://yourdomain.com/cart/${userId}`;
    setCartUrl(uniqueCartUrl);
  }, [userId]);

  const aggregateItems = (items) => {
    const combined = {};

    for (const item of items) {
      const key = `${item.selectedIngredient}__${item.selectedUnit}`;
      const quantity = parseFloat(item.quantity);

      if (!combined[key]) {
        combined[key] = {
          selectedIngredient: item.selectedIngredient,
          selectedUnit: item.selectedUnit,
          quantity: quantity,
        };
      } else {
        combined[key].quantity += quantity;
      }
    }

    setAggregatedCart(Object.values(combined));
  };

  const orderCart = async () => {
    const user = getAuth().currentUser; // Get the current logged-in user
    if (!user) {
      alert('Please log in first.');
      return;
    }

    // Save the cart URL to Firebase under the user's ID
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { items: cartItems, cartUrl: cartUrl });

    alert('Cart submitted for order! Cart URL saved to Firebase.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Your Cart</h1>

      {aggregatedCart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="w-full max-w-2xl">
          <ul className="list-disc pl-5 text-gray-800 mb-6">
            {aggregatedCart.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{item.quantity} {item.selectedUnit} {item.selectedIngredient}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={orderCart} // Submit order
            >
              🛒 Order Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
