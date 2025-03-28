'use client';
import { useState, useEffect } from 'react';
import Feed from './feed/page';
import Cart from './cart/page';
import { usePathname } from 'next/navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('feed');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/cart') setActiveTab('cart');
    else setActiveTab('feed');
  }, [pathname]);

  const renderTab = () => {
    if (activeTab === 'feed') return <Feed />;
    if (activeTab === 'cart') return <Cart />;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white pb-20" style={{ fontFamily: 'Georgia, serif' }}>
      <main className="flex-grow px-4 pt-6">{renderTab()}</main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-center gap-4 py-4 z-50 px-4">
  <button
    className={`flex-1 max-w-xs py-3 text-lg font-semibold rounded-xl shadow transition 
      ${activeTab === 'feed' ? 'bg-red-200 text-black' : 'bg-gray-100 text-gray-600'}`}
    onClick={() => setActiveTab('feed')}
  >
    Feed
  </button>

  <button
    className={`flex-1 max-w-xs py-3 text-lg font-semibold rounded-xl shadow transition 
      ${activeTab === 'cart' ? 'bg-red-200 text-black' : 'bg-gray-100 text-gray-600'}`}
    onClick={() => setActiveTab('cart')}
  >
    Cart
  </button>
</nav>


    </div>
  );
}
