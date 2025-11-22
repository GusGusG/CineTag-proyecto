// js/firebase-config.js

// 1. Importamos las herramientas de Firebase (Auth y Base de Datos)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. TU CONFIGURACIÓN
const firebaseConfig = {
  apiKey: "AIzaSyAkU7kq9N14lc5awpQuofs8BOgo2ngjsj0",
  authDomain: "cinetag-bd2f4.firebaseapp.com",
  projectId: "cinetag-bd2f4",
  storageBucket: "cinetag-bd2f4.firebasestorage.app",
  messagingSenderId: "920244189754",
  appId: "1:920244189754:web:5ce497b6897a3866929303"
};

// 3. Inicializar la conexión
const app = initializeApp(firebaseConfig);

// 4. Exportamos las herramientas para usarlas en toda la app
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("🔥 Firebase conectado correctamente");