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
    <div className="min-h-screen flex flex-col justify-between bg-white pb-24" style={{ fontFamily: 'Georgia, serif' }}>
      <main className="flex-grow px-4 pt-6">{renderTab()}</main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50 px-4 py-4">
        <div className="max-w-md mx-auto flex justify-between bg-gray-100 rounded-full p-1 shadow-inner">
          <button
            className={`flex-1 py-3 text-lg rounded-full transition-all duration-200 font-serif font-medium tracking-tight ${
              activeTab === 'feed'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-800 hover:text-black'
            }`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button
            className={`flex-1 py-3 text-lg rounded-full transition-all duration-200 font-serif font-medium tracking-tight ${
              activeTab === 'cart'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-800 hover:text-black'
            }`}
            onClick={() => setActiveTab('cart')}
          >
            Cart
          </button>
        </div>
      </nav>
    </div>
  );
}
