'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase config
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore'; // Firebase functions
import { getAuth } from 'firebase/auth'; // Firebase Auth to get the user info

export default function AdminPage() {
  const [cartUrls, setCartUrls] = useState([]);
  const [instacartLinks, setInstacartLinks] = useState({}); // Object to track links for each user
  const [userRedirected, setUserRedirected] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(''); // Added to select user

  useEffect(() => {
    // Check if the current logged-in user is admin (using email)
    const user = getAuth().currentUser;
    if (user && user.email !== "giovanni.accinelli@gmail.com") {
      window.location.href = '/'; // Redirect non-admins to home page
    }

    const fetchCartUrls = async () => {
      const cartCollection = collection(db, 'carts');
      const cartSnapshot = await getDocs(cartCollection);
      
      const cartData = cartSnapshot.docs.map(doc => ({
        userId: doc.id,
        url: doc.data().url,
      }));
      
      setCartUrls(cartData);
    };

    fetchCartUrls();
  }, [userRedirected]);

  const handleRedirect = (userId) => {
    // Find the user's cart URL
    const userCart = cartUrls.find(cart => cart.userId === userId);
    const instacartLink = instacartLinks[userId]; // Get Instacart link for that user
    
    if (userCart && instacartLink) {
      // Save the generated Instacart link for the user in Firebase
      const userRef = doc(db, 'carts', userId);
      updateDoc(userRef, { instacartLink });

      // Redirect the user to the Instacart link
      window.location.href = instacartLink;
      setUserRedirected(true);
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

      {/* List of user cart URLs */}
      {cartUrls.length === 0 ? (
        <p className="text-gray-600">No carts ordered yet.</p>
      ) : (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User Cart URLs</h2>
          <ul className="list-disc pl-5 text-gray-800 mb-6">
            {cartUrls.map((cart, idx) => (
              <li key={idx} className="flex justify-between items-center mb-4">
                <div className="flex flex-col w-2/3">
                  {/* Display Cart URL */}
                  <span className="text-sm text-gray-700">{cart.url}</span>
                  {/* Copy button */}
                  <button
                    className="text-white bg-blue-600 px-2 py-1 rounded mt-1 text-sm"
                    onClick={() => handleCopyUrl(cart.url)}
                  >
                    Copy URL
                  </button>
                </div>

                <div className="flex flex-col w-1/3 ml-2">
                  {/* Instacart Link Input Field */}
                  <input
                    type="text"
                    placeholder="Paste Instacart link"
                    className="p-2 border border-gray-300 rounded mb-4"
                    value={instacartLinks[cart.userId] || ''} // Track individual link for each user
                    onChange={(event) => handleInstacartLinkChange(cart.userId, event)}
                  />
                  {/* Submit button */}
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleRedirect(cart.userId)} // This will submit the Instacart link and redirect the user
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
