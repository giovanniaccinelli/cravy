'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';

export default function AdminPage() {
  const [recipes, setRecipes] = useState([]);
  const [instacartLinks, setInstacartLinks] = useState({}); // Store instacart links

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipeCollection = collection(db, 'recipes');
      const recipeSnapshot = await getDocs(recipeCollection);
      const recipeData = recipeSnapshot.docs.map(doc => ({
        recipeId: doc.id,
        ...doc.data()
      }));
      setRecipes(recipeData);
    };

    fetchRecipes();
  }, []);

  const handleInstacartLinkChange = (recipeId, event) => {
    const updatedLinks = { ...instacartLinks, [recipeId]: event.target.value };
    setInstacartLinks(updatedLinks);
  };

  const handleRedirectToInstacart = (recipeId) => {
    const instacartLink = instacartLinks[recipeId];
    if (instacartLink) {
      const recipeRef = doc(db, 'recipes', recipeId);
      updateDoc(recipeRef, { instacartLink });

      alert('Instacart link updated!');
    } else {
      alert('Please paste an Instacart link first.');
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Recipe URL copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Admin Page</h1>

      {/* Display user recipe URLs */}
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes posted yet.</p>
      ) : (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User Recipe URLs</h2>
          <ul className="list-disc pl-5 text-gray-800 mb-6">
            {recipes.map((recipe, idx) => (
              <li key={idx} className="flex justify-between items-center mb-4">
                <div className="flex flex-col w-2/3">
                  {/* Display Recipe URL */}
                  <span className="text-sm text-gray-700">Recipe URL: <a href={`/recipe/${recipe.recipeId}`} target="_blank">/recipe/{recipe.recipeId}</a></span>
                  {/* Copy button */}
                  <button
                    className="text-white bg-blue-600 px-2 py-1 rounded mt-1 text-sm"
                    onClick={() => handleCopyUrl(`/recipe/${recipe.recipeId}`)}
                  >
                    Copy URL
                  </button>
                </div>

                <div className="flex flex-col w-1/3 ml-2">
                  {/* Instacart Link Input */}
                  <input
                    type="text"
                    placeholder="Paste Instacart link"
                    className="p-2 border border-gray-300 rounded mb-4"
                    value={instacartLinks[recipe.recipeId] || ''}
                    onChange={(event) => handleInstacartLinkChange(recipe.recipeId, event)}
                  />
                  {/* Submit button */}
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleRedirectToInstacart(recipe.recipeId)} // Redirect the user to the Instacart link
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
