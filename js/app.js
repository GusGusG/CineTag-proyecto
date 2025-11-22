// js/app.js
import { auth, db } from './firebase-config.js';

// 1. Esperamos a que el documento cargue
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ La aplicación ha iniciado correctamente.");
    
    // 2. Seleccionamos el contenedor principal (donde está el spinner)
    const appContainer = document.getElementById('app-container');

    // 3. Simulamos una carga de 1 segundo y mostramos un mensaje de bienvenida
    setTimeout(() => {
        appContainer.innerHTML = `
            <div class="text-center fade-in">
                <h1>🎬 Bienvenido a CineTag</h1>
                <p class="lead">La estructura de carpetas funciona.</p>
                <button class="btn btn-primary" onclick="alert('¡JS funcionando!')">Probar Botón</button>
            </div>
        `;
    }, 1000);
});