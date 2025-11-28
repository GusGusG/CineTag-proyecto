// js/app.js

// 1. IMPORTACIONES
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { loginGoogle, loginEmail, logout, subirFotoPerfil } from './auth.js'; // <--- Agregamos subirFotoPerfil
import { obtenerPopulares } from './api.js';
import { renderizarPeliculas } from './ui.js';

// 2. REFERENCIAS DOM
const loginView = document.getElementById('login-view');
const wallView = document.getElementById('wall-view');
const navbar = document.getElementById('main-navbar');
const userEmailSpan = document.getElementById('user-email');
const userAvatar = document.getElementById('user-avatar'); // <--- Nueva imagen de perfil

const btnGoogle = document.getElementById('btn-google');
const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');
const errorMsg = document.getElementById('login-error');
const inputAvatar = document.getElementById('input-avatar'); // <--- Nuevo input de archivo

// --------------------------------------------------------------
// LÓGICA PRINCIPAL (ROUTER)
// --------------------------------------------------------------

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // === USUARIO LOGUEADO ===
        console.log("✅ Usuario:", user.email);

        // Interfaz
        loginView.classList.add('d-none');
        wallView.classList.remove('d-none');
        navbar.classList.remove('d-none');

        // Datos de usuario en navbar
        userEmailSpan.textContent = user.email;
        if (user.photoURL && userAvatar) {
            userAvatar.src = user.photoURL; // Mostrar foto si tiene
        }

        // Cargar Películas
        try {
            const peliculas = await obtenerPopulares();
            renderizarPeliculas(peliculas);
        } catch (error) {
            console.error("Error cargando pelis:", error);
        }

    } else {
        // === NADIE LOGUEADO ===
        loginView.classList.remove('d-none');
        wallView.classList.add('d-none');
        navbar.classList.add('d-none');
        if (userAvatar) userAvatar.src = "https://via.placeholder.com/40"; // Reset foto
    }
});

// --------------------------------------------------------------
// EVENTOS
// --------------------------------------------------------------

// 1. Login Google
if (btnGoogle) {
    btnGoogle.addEventListener('click', async () => {
        try { await loginGoogle(); }
        catch (e) { errorMsg.textContent = "Error: " + e.message; }
    });
}

// 2. Login Correo
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        try {
            errorMsg.textContent = "Procesando...";
            await loginEmail(email, pass);
        } catch (e) {
            errorMsg.textContent = "Error: " + e.message;
        }
    });
}

// 3. Logout
if (btnLogout) {
    btnLogout.addEventListener('click', async () => await logout());
}

// 4. SUBIR FOTO (Nuevo Evento)
if (inputAvatar) {
    inputAvatar.addEventListener('change', async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        try {
            // Feedback visual simple
            userAvatar.style.opacity = '0.5';
            alert("Subiendo foto... por favor espera.");

            const nuevaUrl = await subirFotoPerfil(archivo);

            // Actualizar vista
            userAvatar.src = nuevaUrl;
            userAvatar.style.opacity = '1';
            alert("¡Foto actualizada!");

        } catch (error) {
            userAvatar.style.opacity = '1';
            alert("Error al subir imagen.");
        }
    });
}