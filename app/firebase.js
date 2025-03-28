import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configurazione Firebase (usa esattamente la tua configurazione)
const firebaseConfig = {
  apiKey: "AIzaSyB-DchN_aUe4dlVxoDVjqEarNOTVZg1H98",
  authDomain: "cravy-a43f9.firebaseapp.com",
  projectId: "cravy-a43f9",
  storageBucket: "cravy-a43f9.firebasestorage.app",
  messagingSenderId: "266639626674",
  appId: "1:266639626674:web:f59321dde1dfa73bd394ab"
};

// Inizializzazione Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

