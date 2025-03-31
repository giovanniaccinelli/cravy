'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firebase configuration
import { setDoc, doc } from 'firebase/firestore'; // Firebase functions
import { getAuth } from 'firebase/auth'; // Firebase authentication
import { v4 as uuidv4 } from 'uuid'; // To generate a unique cart ID

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [aggregatedCart, setAggregatedCart] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [cartId, setCartId] = useState(''); // Store unique cart ID for the user

  // Fetch cart data from localStorage
  useEffect(() => {
    const rawCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(rawCart);
    aggregateItems(rawCart);

    // Generate a unique cart ID for each user
    const uniqueCartId = uuidv4();
    setCartId(uniqueCartId);
  }, []);

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

  const removeItem = (ingredient, unit) => {
    const updated = cartItems.filter(
      (item) => !(item.selectedIngredient === ingredient && item.selectedUnit === unit)
    );
    localStorage.setItem('cart', JSON.stringify(updated));
    setCartItems(updated);
    aggregateItems(updated);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
    setAggregatedCart([]);
  };

  const orderCart = async () => {
    const user = getAuth().currentUser; // Get the current logged-in user
    if (!user) {
      alert('Please log in first.');
      return;
    }

    const userCartUrl = `https://cravy-coral.vercel.app/cart/${cartId}`; // Generate a unique cart URL
    const userId = user.uid; // Get user ID from Firebase authentication

    // Save the cart URL to Firebase under the user's ID
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { url: userCartUrl, items: aggregatedCart });

    alert('Cart submitted for order! Cart URL saved to Firebase.');
  };

  const addToCart = (ingredients) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, ...ingredients];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show toast notification
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);

    alert('Ingredients added to cart!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-4xl font-bold text-red-600 mb-6">Your Cart</h1>

      {/* Toast notification */}
      {showToast && (
        <div className="toast-notification">
          <p className="text-white">Item added to cart!</p>
        </div>
      )}

      {aggregatedCart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="w-full max-w-2xl">
          <ul className="list-disc pl-5 text-gray-800 mb-6">
            {aggregatedCart.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>
                  {item.quantity.toFixed(2)} {item.selectedUnit} {item.selectedIngredient}
                </span>
                <button
                  onClick={() => removeItem(item.selectedIngredient, item.selectedUnit)}
                  className="ml-4 text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={orderCart} // Save the user's cart URL to Firebase
            >
              🛒 Order Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
