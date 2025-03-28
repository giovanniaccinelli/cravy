'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [profileName, setProfileName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showPostManager, setShowPostManager] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchUserRecipes(currentUser.email);
        const profileRef = doc(db, 'users', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfileName(profileSnap.data().profileName || '');
        }
      }
    });
  }, [router]);

  const fetchUserRecipes = async (email) => {
    const q = query(collection(db, 'recipes'), where('creator', '==', email));
    const querySnapshot = await getDocs(q);
    const userRecipes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setRecipes(userRecipes);
  };

  const handleDelete = async (recipeId) => {
    const confirm = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
      alert('Recipe deleted.');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      alert('Logout failed');
    }
  };

  const saveProfileName = async () => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    await setDoc(profileRef, {
      profileName,
      email: user.email,
    }, { merge: true });
    setEditingName(false);
    alert('Profile name updated.');
  };

  const renderVideoEmbed = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('/').pop()
        : new URLSearchParams(new URL(url).search).get('v');
      return (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
        />
      );
    } else if (url.includes('instagram.com')) {
      return (
        <iframe
          width="100%"
          height="480"
          src={`${url}embed`}
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
        />
      );
    } else if (url.includes('tiktok.com')) {
      return (
        <blockquote className="tiktok-embed" cite={url} data-video-id="" style={{ width: '100%', minWidth: '325px', maxWidth: '605px' }}>
          <section>Loading TikTok...</section>
        </blockquote>
      );
    } else {
      return <p>Unsupported video link</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="flex justify-between items-center w-full max-w-2xl mb-6">
        <div>
          <h1 className="text-4xl font-bold text-red-600">
            {(profileName || user?.email)}&rsquo;s Profile
          </h1>
          {editingName ? (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <button onClick={saveProfileName} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Save
              </button>
              <button onClick={() => setEditingName(false)} className="text-sm text-gray-500 underline">
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{user?.email}</p>
          )}
        </div>

        <div className="relative z-50">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-700 border px-3 py-1 rounded hover:bg-gray-100"
          >
            Profile Menu ⏷
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-52 bg-white border shadow-md rounded z-50 text-sm">
              <button
                onClick={() => setEditingName(true)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                ✏️ Edit Profile Name
              </button>
              <button
                onClick={() => setShowPostManager(!showPostManager)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                🛠️ {showPostManager ? 'Hide' : 'Manage'} Posts
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                🔓 Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <Link href="/create-recipe">
        <button className="mb-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
          + Create New Recipe
        </button>
      </Link>

      {recipes.length === 0 ? (
        <p className="text-gray-600">You haven't created any recipes yet.</p>
      ) : (
        recipes.map(recipe => (
          <div key={recipe.id} className="w-full max-w-2xl border-b mb-8 pb-4 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{recipe.description}</h2>
            <div className="mb-4">{renderVideoEmbed(recipe.videoUrl)}</div>
            <ul className="list-disc pl-5 text-gray-700 mb-2">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>
                  {item.quantity} {item.selectedUnit} {item.selectedIngredient}
                </li>
              ))}
            </ul>

            {showPostManager && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Link href={`/edit-recipe?id=${recipe.id}`}>
                  <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm shadow">
                    ✏️ Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm shadow"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
