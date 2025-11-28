// js/auth.js
// Lógica de Autenticación y Perfil

import { auth } from './firebase-config.js';
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

// --- CONFIGURACIÓN DE CLOUDINARY ---
const CLOUD_NAME = 'dixzbsady';
const PRESET = 'demo_final';

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
        // Intentamos iniciar sesión
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // Si no existe, lo creamos
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            throw error; // Otro error (ej. contraseña corta)
        }
    }
}

// 3. Cerrar Sesión
export async function logout() {
    await signOut(auth);
    window.location.reload();
}

// 4. SUBIR FOTO DE PERFIL (Para Integrante C)
export async function subirFotoPerfil(archivo) {
    if (!auth.currentUser) return;

    // Preparamos los datos para Cloudinary
    const formData = new FormData();
    formData.append('upload_preset', PRESET);
    formData.append('file', archivo);

    try {
        console.log("Subiendo imagen a Cloudinary...");

        // Hacemos la petición (Fetch)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.error) throw new Error(data.error.message);

        // Si subió bien, guardamos la URL en Firebase Auth
        if (data.secure_url) {
            await updateProfile(auth.currentUser, { photoURL: data.secure_url });
            console.log("Foto actualizada en Firebase:", data.secure_url);
            return data.secure_url;
        }
    } catch (error) {
        console.error("Error subiendo foto:", error);
        throw error;
    }
}