'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firebase config
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

export default function RecipePage({ params }) {
  const { recipeId } = params; // Get recipeId from the URL
  const [recipe, setRecipe] = useState(null); // To store the fetched recipe data

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeRef = doc(db, 'recipes', recipeId); // Reference to Firestore document using recipeId
      const recipeSnap = await getDoc(recipeRef);

      if (recipeSnap.exists()) {
        setRecipe(recipeSnap.data()); // Set the fetched recipe data
      } else {
        setRecipe(null); // Recipe not found
      }
    };

    fetchRecipe();
  }, [recipeId]); // Trigger fetch whenever recipeId changes

  if (!recipe) {
    return <div>Recipe not found</div>; // If no recipe is found, show an error message
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">{recipe.description}</h1>
      <p className="text-gray-600 mb-6">{recipe.videoUrl}</p>
      
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Ingredients</h2>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>
            {item.quantity} {item.selectedUnit} {item.selectedIngredient}
          </li>
        ))}
      </ul>
    </div>
  );
}
