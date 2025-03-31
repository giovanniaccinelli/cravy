'use client';

import { useState, useEffect } from 'react';

// Admin Page where you can paste the Instacart link
export default function AdminPage() {
  const [instacartLink, setInstacartLink] = useState('');
  const [cartUrl, setCartUrl] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');
  const [userId, setUserId] = useState('');

  // Fetch the cart URL saved in localStorage (you can later modify this to pull from Firebase)
  useEffect(() => {
    const savedCartUrl = localStorage.getItem('currentCartUrl');
    if (savedCartUrl) {
      setCartUrl(savedCartUrl);
      const urlParts = new URL(savedCartUrl);
      setUserId(urlParts.pathname.split('/')[2]); // Assuming the URL has userId in the path
    }
  }, []);

  const handleSubmit = () => {
    if (!cartUrl || !instacartLink) {
      alert('Please fill in both fields!');
      return;
    }

    setRedirectMessage(`Redirecting user with cart URL: ${cartUrl} to Instacart link: ${instacartLink}`);

    // Redirect the user to the Instacart link
    window.location.href = instacartLink;
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Admin Page</h1>

      {/* Show cart URL */}
      <div className="mb-6">
        <p><strong>Cart URL:</strong> {cartUrl ? cartUrl : 'No cart URL available yet'}</p>
      </div>

      {/* Input field to paste Instacart link */}
      <input
        type="text"
        placeholder="Paste Instacart link here"
        className="p-2 border border-gray-300 rounded mb-4"
        value={instacartLink}
        onChange={(e) => setInstacartLink(e.target.value)}
      />

      <button
        className="bg-green-600 text-white px-6 py-3 rounded text-lg hover:bg-green-700"
        onClick={handleSubmit}
      >
        Submit Instacart Link
      </button>

      {/* Display redirect message */}
      {redirectMessage && <p className="mt-4">{redirectMessage}</p>}

      {/* Instructions */}
      <p className="text-sm mt-6">Once you paste the Instacart link and submit, the user will be redirected to that link.</p>
    </div>
  );
}
