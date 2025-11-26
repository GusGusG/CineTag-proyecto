export function renderizarPeliculas(peliculas) {
    const contenedor = document.getElementById('peliculas-container');

    // Si no hay pelis o hubo error
    if (!peliculas || peliculas.length === 0) {
        contenedor.innerHTML = '<p class="text-center">No se encontraron películas.</p>';
        return;
    }

    // Limpiamos el spinner
    contenedor.innerHTML = '';

    // Generamos una tarjeta por cada película
    peliculas.forEach(peli => {
        // Si no tiene imagen, ponemos una genérica (opcional)
        const imagen = peli.poster_path
            ? `https://image.tmdb.org/t/p/w500${peli.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';

        const html = `
          <div class="col-6 col-md-4 col-lg-3 mb-4 fade-in">
              <div class="card h-100 movie-card text-white border-0">
                  <img src="${imagen}" class="card-img-top rounded" alt="${peli.title}">
                  <div class="card-body p-2">
                      <h6 class="card-title fw-bold text-truncate">${peli.title}</h6>
                      <div class="d-flex justify-content-between align-items-center">
                          <small class="text-warning"><i class="fas fa-star"></i> ${peli.vote_average}</small>
                          <small class="text-muted">${peli.release_date ? peli.release_date.split('-')[0] : 'N/A'}</small>
                      </div>
                  </div>
              </div>
          </div>
      `;
        contenedor.innerHTML += html;
    });
}