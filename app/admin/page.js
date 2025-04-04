// app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';

export default function AdminPage() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipeCollection = collection(db, 'recipes');
      const recipeSnapshot = await getDocs(recipeCollection);

      const recipeData = recipeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecipes(recipeData);
    };

    fetchRecipes();
  }, []);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Recipe URL copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Admin Page</h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recipes</h2>
      <ul>
        {recipes.map((recipe, idx) => (
          <li key={idx} className="mb-4">
            <span>{recipe.description}</span>
            <button onClick={() => handleCopyUrl(recipe.recipeUrl)}>
              Copy URL
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
