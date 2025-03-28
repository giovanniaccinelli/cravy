'use client';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) router.push('/profile');
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      router.push('/profile');
    } catch (error) {
      alert('Error logging in: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-4 bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-4xl font-bold text-red-600">Welcome Back</h1>
      <input
        type="email"
        placeholder="Email"
        className="mt-4 p-2 border border-gray-300 rounded w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mt-2 p-2 border border-gray-300 rounded w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded w-64"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}


  