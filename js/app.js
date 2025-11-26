// js/app.js

// 1. Importaciones (Auth, Base de Datos y Lógica de Películas)
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { loginGoogle, loginEmail, logout } from './auth.js';
// Importamos las funciones nuevas del Integrante B
import { obtenerPopulares } from './api.js';
import { renderizarPeliculas } from './ui.js';

// 2. Referencias al HTML
const loginView = document.getElementById('login-view');
const wallView = document.getElementById('wall-view');
const navbar = document.getElementById('main-navbar');
const userEmailSpan = document.getElementById('user-email');

const btnGoogle = document.getElementById('btn-google');
const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');
const errorMsg = document.getElementById('login-error');

// --------------------------------------------------------------
// LÓGICA PRINCIPAL (ROUTER)
// --------------------------------------------------------------

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // === USUARIO LOGUEADO ===
        console.log("✅ Usuario detectado:", user.email);

        // 1. Cambiar interfaz
        loginView.classList.add('d-none');
        wallView.classList.remove('d-none');
        navbar.classList.remove('d-none');
        userEmailSpan.textContent = user.email;

        // 2. CARGAR PELÍCULAS (Aquí estaba el problema antes)
        console.log("🎬 Cargando películas...");
        try {
            const peliculas = await obtenerPopulares();
            console.log(`¡Trajimos ${peliculas.length} películas!`);
            renderizarPeliculas(peliculas);
        } catch (error) {
            console.error("Error cargando pelis:", error);
        }

    } else {
        // === NADIE LOGUEADO ===
        console.log("❌ No hay sesión activa");
        loginView.classList.remove('d-none');
        wallView.classList.add('d-none');
        navbar.classList.add('d-none');
    }
});

// --------------------------------------------------------------
// EVENTOS (Clicks y Formularios)
// --------------------------------------------------------------

// Botón Google
if (btnGoogle) {
    btnGoogle.addEventListener('click', async () => {
        try {
            await loginGoogle();
        } catch (error) {
            errorMsg.textContent = "Error Google: " + error.message;
        }
    });
}

// Formulario Correo
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            errorMsg.textContent = "Verificando...";
            await loginEmail(email, password);
        } catch (error) {
            if (error.code === 'auth/wrong-password') errorMsg.textContent = "Contraseña incorrecta";
            else if (error.code === 'auth/user-not-found') errorMsg.textContent = "Usuario no encontrado";
            else errorMsg.textContent = "Error: " + error.message;
        }
    });
}

// Botón Salir
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        await logout();
    });
}