'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // For accessing the current user's name/email

export default function AdminPage() {
  const [cartUrls, setCartUrls] = useState([]);
  const [instacartLinks, setInstacartLinks] = useState({}); // Store each user's instacart link

  useEffect(() => {
    const fetchCartUrls = async () => {
      const cartCollection = collection(db, 'carts');
      const cartSnapshot = await getDocs(cartCollection);

      const cartData = cartSnapshot.docs.map(doc => ({
        userId: doc.id,
        url: doc.data().url,
      }));

      // Fetching user details to display along with cart URL
      const usersWithNames = await Promise.all(cartData.map(async (cart) => {
        const userRef = doc(db, 'users', cart.userId); // Assuming you have a 'users' collection
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        return {
          ...cart,
          name: userData?.profileName || userData?.email || 'Unknown User', // Show name or email
        };
      }));

      setCartUrls(usersWithNames);
    };

    fetchCartUrls();
  }, []);

  const handleRedirect = (userId) => {
    const userCart = cartUrls.find(cart => cart.userId === userId);
    const instacartLink = instacartLinks[userId];

    if (userCart && instacartLink) {
      const userRef = doc(db, 'carts', userId);
      updateDoc(userRef, { instacartLink });

      // Only redirect the user who owns the cart
      window.location.href = instacartLink;
    }
  };

  const handleInstacartLinkChange = (userId, event) => {
    const updatedLinks = { ...instacartLinks, [userId]: event.target.value };
    setInstacartLinks(updatedLinks);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Cart URL copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Admin Page</h1>

      {/* Display user cart URLs */}
      {cartUrls.length === 0 ? (
        <p className="text-gray-600">No carts ordered yet.</p>
      ) : (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User Cart URLs</h2>
          <ul className="list-disc pl-5 text-gray-800 mb-6">
            {cartUrls.map((cart, idx) => (
              <li key={idx} className="flex justify-between items-center mb-4">
                <div className="flex flex-col w-2/3">
                  {/* Display User's Name and Cart URL */}
                  <span className="text-sm text-gray-700">{cart.name}</span> {/* Display Name or Email */}
                  <span className="text-sm text-gray-700">{cart.url}</span> {/* Display Cart URL */}

                  {/* Copy button */}
                  <button
                    className="text-white bg-blue-600 px-2 py-1 rounded mt-1 text-sm"
                    onClick={() => handleCopyUrl(cart.url)}
                  >
                    Copy URL
                  </button>
                </div>

                <div className="flex flex-col w-1/3 ml-2">
                  {/* Instacart Link Input */}
                  <input
                    type="text"
                    placeholder="Paste Instacart link"
                    className="p-2 border border-gray-300 rounded mb-4"
                    value={instacartLinks[cart.userId] || ''}
                    onChange={(event) => handleInstacartLinkChange(cart.userId, event)}
                  />
                  {/* Submit button */}
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleRedirect(cart.userId)} // Redirect the user to the Instacart link
                  >
                    Submit Instacart Link
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
