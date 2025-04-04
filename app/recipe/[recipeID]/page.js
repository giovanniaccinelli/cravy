// app/recipe/[recipeId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function RecipePage({ params }) {
  const { recipeId } = params;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeRef = doc(db, 'recipes', recipeId);
      const recipeSnap = await getDoc(recipeRef);

      if (recipeSnap.exists()) {
        setRecipe(recipeSnap.data());
      } else {
        console.log('Recipe not found');
      }
    };

    fetchRecipe();
  }, [recipeId]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Recipe</h1>

      {recipe ? (
        <div>
          <h2 className="text-2xl">{recipe.description}</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.selectedUnit} {ingredient.selectedIngredient}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Recipe not found.</p>
      )}
    </div>
  );
}
