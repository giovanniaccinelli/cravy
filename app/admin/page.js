import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [cartUrl, setCartUrl] = useState(null);
  const [instacartLink, setInstacartLink] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Get the cart URL from local storage (if any)
    const userCartUrl = localStorage.getItem("userCartUrl");
    if (userCartUrl) {
      setCartUrl(userCartUrl); // Display the cart URL for the admin
    }
  }, []);

  const handleInstacartLinkSubmission = () => {
    // Check if an Instacart link is provided
    if (instacartLink) {
      // Here you would redirect the user who clicked on "Order Cart"
      window.location.href = instacartLink;
      setIsRedirecting(true);
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin Page</h2>

      {cartUrl ? (
        <div>
          <p>User's Cart URL: {cartUrl}</p>

          <input 
            type="text" 
            placeholder="Paste Instacart link here"
            value={instacartLink}
            onChange={(e) => setInstacartLink(e.target.value)}
          />

          <button onClick={handleInstacartLinkSubmission}>
            {isRedirecting ? 'Redirecting...' : 'Submit Instacart Link'}
          </button>
        </div>
      ) : (
        <p>No cart URL available yet.</p>
      )}
    </div>
  );
}
