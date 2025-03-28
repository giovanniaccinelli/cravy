'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import structuredIngredients from '../structured_usda_ingredients.json';

export default function EditRecipeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id');

  const [user, setUser] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientList, setIngredientList] = useState([]);
  const [addedIngredients, setAddedIngredients] = useState([]);

  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setIngredientList(structuredIngredients);

        if (recipeId) {
          const docRef = doc(db, 'recipes', recipeId);
          const recipeSnap = await getDoc(docRef);

          if (recipeSnap.exists()) {
            const data = recipeSnap.data();
            if (data.creator !== currentUser.email) {
              alert("You can't edit this recipe.");
              router.push('/');
              return;
            }

            setDescription(data.description);
            setVideoUrl(data.videoUrl);
            setAddedIngredients(data.ingredients || []);
          } else {
            alert('Recipe not found.');
            router.push('/');
          }
        }
      }
    });
  }, [recipeId, router]);

  const handleAddIngredient = () => {
    if (!selectedIngredient || !selectedUnit || !parseFloat(quantity)) {
      alert('Please fill in all ingredient fields.');
      return;
    }

    const newItem = {
      selectedIngredient,
      selectedUnit,
      quantity: parseFloat(quantity),
    };

    setAddedIngredients([...addedIngredients, newItem]);

    setSelectedIngredient('');
    setSelectedUnit('');
    setQuantity('');
  };

  const handleRemoveIngredient = (index) => {
    const updated = [...addedIngredients];
    updated.splice(index, 1);
    setAddedIngredients(updated);
  };

  const handleSubmit = async () => {
    if (!description || !videoUrl) {
      alert('Please fill in all fields.');
      return;
    }

    if (addedIngredients.length === 0) {
      alert('Please add at least one ingredient.');
      return;
    }

    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        description,
        videoUrl,
        ingredients: addedIngredients,
      });

      alert('Recipe updated!');
      router.push('/profile');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update recipe.');
    }
  };

  const availableUnits =
    ingredientList.find((i) => i.Ingredient === selectedIngredient)?.['Measurement Units'] || [];

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white px-4" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-4xl font-bold text-red-600 mb-6">Edit Recipe</h1>

      <input
        type="text"
        placeholder="Recipe Description"
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-xl"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Video URL (YouTube/TikTok)"
        className="mb-6 p-2 border border-gray-300 rounded w-full max-w-xl"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Ingredients</h2>

      <div className="w-full max-w-xl grid grid-cols-4 gap-2 mb-4 items-center">
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedIngredient}
          onChange={(e) => {
            setSelectedIngredient(e.target.value);
            setSelectedUnit('');
          }}
        >
          <option value="">Select Ingredient</option>
          {ingredientList.map((ing, i) => (
            <option key={i} value={ing.Ingredient}>
              {ing.Ingredient}
            </option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          disabled={!selectedIngredient}
        >
          <option value="">Unit</option>
          {availableUnits.map((unit, i) => (
            <option key={i} value={unit}>
              {unit}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Qty"
          className="p-2 border border-gray-300 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
        />

        <button
          onClick={handleAddIngredient}
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
        >
          ➕ Add
        </button>
      </div>

      <div className="w-full max-w-xl mb-6">
        {addedIngredients.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2 items-center mb-2">
            <span>{item.selectedIngredient}</span>
            <span>{item.selectedUnit}</span>
            <span>{item.quantity}</span>
            <button
              onClick={() => handleRemoveIngredient(idx)}
              className="text-red-600 hover:underline text-sm"
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
        onClick={handleSubmit}
      >
        💾 Update Recipe
      </button>
    </div>
  );
}

