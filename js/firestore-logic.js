import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. GUARDAR RESEÑA
export async function guardarResena(tituloPelicula, comentario, usuarioEmail) {
    try {
        await addDoc(collection(db, "resenas"), {
            pelicula: tituloPelicula,
            texto: comentario,
            usuario: usuarioEmail,
            fecha: new Date()
        });
        console.log("Reseña guardada");
        return { success: true };
    } catch (e) {
        console.error("Error:", e);
        return { success: false, error: e };
    }
}

// 2. OBTENER RESEÑAS DE UNA PELÍCULA (NUEVO)
export async function obtenerResenasPelicula(tituloPelicula) {
    try {
        const q = query(
            collection(db, "resenas"),
            where("pelicula", "==", tituloPelicula)
            // Nota: orderBy requiere un índice en Firestore, lo omitimos por ahora para evitar errores
        );

        const querySnapshot = await getDocs(q);
        let comentarios = [];

        querySnapshot.forEach((doc) => {
            comentarios.push(doc.data());
        });

        return comentarios;
    } catch (e) {
        console.error("Error leyendo reseñas:", e);
        return [];
    }
}