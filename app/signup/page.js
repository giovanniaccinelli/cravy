'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save profileName + email
      await setDoc(doc(db, 'users', user.uid), {
        profileName: name,
        email: user.email,
      });

      alert('Signup successful!');
      router.push('/');
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-4 bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-4xl font-bold text-red-600">Create your account</h1>
      <input
        type="text"
        placeholder="Name"
        className="mt-4 p-2 border border-gray-300 rounded w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="mt-2 p-2 border border-gray-300 rounded w-64"
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
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded w-64"
        onClick={handleSignup}
      >
        Sign Up
      </button>
    </div>
  );
}

