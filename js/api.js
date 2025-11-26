const API_KEY = '9345f334de6b9eee8f30da7e9f55810e'; // Tu llave que ya probamos

export async function obtenerPopulares() {
    try {
        // Pedimos películas en español
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-MX&page=1`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results; // Regresamos la lista de 20 películas
    } catch (error) {
        console.error("Error al obtener películas:", error);
        return [];
    }
}