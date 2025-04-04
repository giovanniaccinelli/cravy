'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function RecipePage({ params }) {
  const { recipeId } = params; // Get recipeId from URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeRef = doc(db, 'recipes', recipeId);
      const recipeSnap = await getDoc(recipeRef);
      if (recipeSnap.exists()) {
        setRecipe(recipeSnap.data()); // Populate the recipe data
      } else {
        setRecipe(null); // No recipe found
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return <p>Recipe not found!</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">{recipe.description}</h1>
      {/* Display the ingredients list, video URL, etc. */}
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>
            {item.quantity} {item.selectedUnit} {item.selectedIngredient}
          </li>
        ))}
      </ul>
      <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer">
        Watch Recipe Video
      </a>
    </div>
  );
}
