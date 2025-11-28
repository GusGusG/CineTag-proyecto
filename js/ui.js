import { guardarResena, obtenerResenasPelicula } from './firestore-logic.js'; // <--- Importamos la nueva función
import { auth } from './firebase-config.js';

export function renderizarPeliculas(peliculas) {
    const contenedor = document.getElementById('peliculas-container');

    if (!peliculas || peliculas.length === 0) {
        contenedor.innerHTML = '<p class="text-center">No se encontraron películas.</p>';
        return;
    }

    contenedor.innerHTML = '';

    peliculas.forEach(peli => {
        const imagen = peli.poster_path
            ? `https://image.tmdb.org/t/p/w500${peli.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';

        const html = `
          <div class="col-6 col-md-4 col-lg-3 mb-4 fade-in">
              <div class="card h-100 movie-card text-white border-0">
                  <img src="${imagen}" class="card-img-top rounded" alt="${peli.title}">
                  <div class="card-body p-2 d-flex flex-column">
                      <h6 class="card-title fw-bold text-truncate">${peli.title}</h6>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                          <small class="text-warning"><i class="fas fa-star"></i> ${peli.vote_average}</small>
                          <small class="text-muted">${peli.release_date ? peli.release_date.split('-')[0] : 'N/A'}</small>
                      </div>

                      <div class="mt-auto d-flex gap-2">
                          <!-- Botón Ver -->
                          <button class="btn btn-sm btn-dark flex-grow-1 btn-ver-resenas" data-title="${peli.title}">
                            <i class="fas fa-eye"></i>
                          </button>
                          <!-- Botón Escribir -->
                          <button class="btn btn-sm btn-outline-warning flex-grow-1 btn-reseñar" data-title="${peli.title}">
                            <i class="fas fa-pen"></i>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      `;
        contenedor.innerHTML += html;
    });

    // --- LÓGICA DE CLICKS ---

    // 1. Botón "Reseñar" (Escribir)
    contenedor.addEventListener('click', async (e) => {
        const btnEscribir = e.target.closest('.btn-reseñar');
        const btnVer = e.target.closest('.btn-ver-resenas');

        // CASO A: ESCRIBIR RESEÑA
        if (btnEscribir) {
            const titulo = btnEscribir.dataset.title;
            if (!auth.currentUser) return alert('Inicia sesión primero');

            const comentario = prompt(`Escribe tu opinión sobre "${titulo}":`);
            if (comentario && comentario.trim() !== '') {
                btnEscribir.textContent = '...';
                await guardarResena(titulo, comentario, auth.currentUser.email);
                alert('¡Reseña guardada!');
                btnEscribir.innerHTML = '<i class="fas fa-pen"></i>';
            }
        }

        // CASO B: VER RESEÑAS (NUEVO)
        if (btnVer) {
            const titulo = btnVer.dataset.title;
            btnVer.textContent = '...';

            const lista = await obtenerResenasPelicula(titulo);

            if (lista.length === 0) {
                alert(`Aún no hay reseñas para "${titulo}". ¡Sé el primero!`);
            } else {
                // Creamos un texto largo con todas las reseñas para mostrar en el alert
                let mensaje = `📢 RESEÑAS DE: ${titulo}\n\n`;
                lista.forEach(item => {
                    mensaje += `👤 ${item.usuario}:\n"${item.texto}"\n----------------\n`;
                });
                alert(mensaje);
            }
            btnVer.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });
}