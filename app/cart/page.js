'use client';

import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [aggregatedCart, setAggregatedCart] = useState([]);

  useEffect(() => {
    const rawCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(rawCart);
    aggregateItems(rawCart);
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

  const orderCart = () => {
    alert('Cart submitted for order! (this can later trigger affiliate bot)');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-4xl font-bold text-red-600 mb-6">Your Cart</h1>

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
              onClick={orderCart}
            >
              🛒 Order Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
