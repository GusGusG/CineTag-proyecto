// js/auth.js
// Lógica de autenticación (Login/Registro)

import { auth } from './firebase-config.js';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

// 1. Iniciar con Google
export async function loginGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 2. Iniciar con Correo (Login o Registro automático)
export async function loginEmail(email, password) {
    try {
        // Intentamos entrar...
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // Si no existe, lo registramos
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            throw error;
        }
    }
}

// 3. Cerrar Sesión
export async function logout() {
    await signOut(auth);
}

// 4. (Placeholder) Para cuando el Integrante C haga lo de la foto
export async function subirFotoPerfil(archivo) {
    alert("Esta función la hará el Integrante C");
}