'use client';

import { useEffect, useState, useRef } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import categories from '../categories.json'; // Import the categories from the JSON file

export default function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // State to hold the selected category for filtering
  const videoRefs = useRef([]); // Store references to the video elements

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));

      const fetchedRecipes = await Promise.all(
        querySnapshot.docs.map(async docSnap => {
          const data = docSnap.data();
          let profileName = '';

          if (data.creatorId) {
            const creatorRef = doc(db, 'users', data.creatorId);
            const creatorSnap = await getDoc(creatorRef);
            if (creatorSnap.exists()) {
              profileName = creatorSnap.data().profileName || '';
            }
          }

          if (!profileName && data.creator) {
            const userQuery = query(
              collection(db, 'users'),
              where('email', '==', data.creator)
            );
            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
              const userData = userSnap.docs[0].data();
              profileName = userData.profileName || '';
            }
          }

          // Find the category object from the categories array based on the category name
          const category = categories.find(cat => cat.name === data.category);

          return {
            id: docSnap.id,
            ...data,
            profileName: profileName || data.creator || 'Unknown user',
            categoryColor: category ? category.color : 'bg-gray-500', // Default to gray if no category found
            categoryName: category ? category.name : 'Uncategorized' // Default category name
          };
        })
      );

      setRecipes(fetchedRecipes);
      setFilteredRecipes(fetchedRecipes); // Initially, show all recipes
    };

    fetchRecipes();
  }, []);

  // ✅ Inject TikTok script once
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onload = () => window?.tiktokEmbedLoad?.();
      document.body.appendChild(script);
    }
  }, []);

  // ✅ Call TikTok embed parser on each render (refresh embeds)
  useEffect(() => {
    const timeout = setTimeout(() => {
      window?.tiktokEmbedLoad?.();
    }, 500);
    return () => clearTimeout(timeout);
  }, [filteredRecipes]);

  const renderVideoEmbed = (url, index) => {
    if (!url) return <p>No video provided</p>;

    // YouTube or Shorts
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube.com/shorts')) {
      let videoId = '';

      if (url.includes('youtu.be')) {
        videoId = url.split('/').pop();
      } else if (url.includes('shorts')) {
        videoId = url.split('/shorts/')[1]?.split('?')[0];
      } else {
        videoId = new URLSearchParams(new URL(url).search).get('v');
      }

      if (!videoId) return <p>Invalid YouTube URL</p>;

      return (
        <div className="w-full aspect-[9/16] overflow-hidden rounded-lg mb-4">
          <iframe
            ref={(el) => videoRefs.current[index] = el}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${videoId}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      );
    }

    // TikTok
    if (url.includes('tiktok.com')) {
      return (
        <div className="w-full aspect-[9/16] overflow-hidden rounded-lg mb-4">
          <blockquote
            ref={(el) => videoRefs.current[index] = el}
            className="tiktok-embed"
            cite={url}
            data-video-id=""
            style={{ width: '100%', minWidth: '325px', maxWidth: '100%' }}
          >
            <section>Loading TikTok...</section>
          </blockquote>
        </div>
      );
    }

    return <p>Unsupported video link</p>;
  };

  const addToCart = (ingredients) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, ...ingredients];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('Ingredients added to cart!');
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredRecipes(recipes); // Show all recipes if no category is selected
    } else {
      const filtered = recipes.filter(recipe => recipe.categoryName === category);
      setFilteredRecipes(filtered); // Filter recipes by selected category
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-4xl font-bold text-red-600 mb-8">Recipe Feed</h1>

      {/* Category Filter Dropdown */}
      <div className="mb-6">
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredRecipes.map((recipe, index) => (
        <div key={recipe.id} className="w-full max-w-2xl border-b mb-10 pb-6 relative">
          {/* Category Badge */}
          {recipe.categoryColor && (
            <div className={`absolute top-2 right-2 text-white px-3 py-1 rounded-full ${recipe.categoryColor}`}>
              {recipe.categoryName}
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-800 mb-2">{recipe.description}</h2>

          {renderVideoEmbed(recipe.videoUrl, index)}

          <div className="flex justify-between items-start mb-2">
            <ul className="list-disc pl-5 text-gray-700">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>
                  {item.quantity} {item.selectedUnit} {item.selectedIngredient}
                </li>
              ))}
            </ul>

            <div className="ml-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
                onClick={() => addToCart(recipe.ingredients)}
              >
                ➕ Add to Cart
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">Recipe by: {recipe.profileName}</p>
        </div>
      ))}
    </div>
  );
}

