'use client';

import { useEffect, useState } from 'react';

export default function Toast({ message, show }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-lg shadow z-50 transition-all">
      {message}
    </div>
  );
}
