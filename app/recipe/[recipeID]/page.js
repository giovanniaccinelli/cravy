// app/recipe/[recipeId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firebase config
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

export default function RecipePage({ params }) {
  const { recipeId } = params; // Get recipeId from URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeRef = doc(db, 'recipes', recipeId); // Get the specific recipe data from Firebase
      const recipeSnap = await getDoc(recipeRef);
      if (recipeSnap.exists()) {
        setRecipe(recipeSnap.data()); // Populate recipe data
      } else {
        console.log("Recipe not found");
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">{recipe.description}</h1>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Ingredients</h2>
        <ul className="list-disc pl-5 text-gray-800 mb-6">
          {recipe.ingredients.map((ingredient, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{ingredient.quantity} {ingredient.selectedUnit} {ingredient.selectedIngredient}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Video</h2>
        {recipe.videoUrl && <iframe width="560" height="315" src={recipe.videoUrl} title="Recipe Video" frameBorder="0" allowFullScreen></iframe>}
      </div>
    </div>
  );
}
