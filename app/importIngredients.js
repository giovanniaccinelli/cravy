const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const ingredients = require('./structured_usda_ingredients.json');

// Your Firebase configuration (replace with your actual credentials if needed)
const firebaseConfig = {
  apiKey: "AIzaSyB-DchN_aUe4dlVxoDVjqEarNOTVZg1H98",
  authDomain: "cravy-a43f9.firebaseapp.com",
  projectId: "cravy-a43f9",
  storageBucket: "cravy-a43f9.firebasestorage.app",
  messagingSenderId: "266639626674",
  appId: "1:266639626674:web:f59321dde1dfa73bd394ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const importIngredients = async () => {
  const ingredientsCollection = collection(db, 'ingredients');

  for (const ingredient of ingredients) {
    await addDoc(ingredientsCollection, ingredient);
    console.log(`Added: ${ingredient.Ingredient}`);
  }

  console.log('✅ All ingredients imported successfully!');
};

importIngredients();
