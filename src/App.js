// src/App.js

// Importa React y sus hooks esenciales: useState para el estado y useEffect para efectos secundarios.
import React, { useState, useEffect } from 'react';
// Importa los estilos CSS para este componente.
import './App.css'; 

// Define tus constantes para la integración con la API de The Movie Database (TMDB).
const API_KEY = 'b08fd22db9a174839e71185758dbf234'; // Tu clave de API personal para TMDB.
const BASE_URL = 'https://api.themoviedb.org/3/search/movie'; // Endpoint para buscar películas.
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300'; // URL base para los pósteres de películas.

// Componente funcional principal de la aplicación.
function App() {
    // Estado para almacenar el término de búsqueda ingresado por el usuario.
    const [query, setQuery] = useState("");
    // Estado para almacenar la lista de películas obtenidas de la API.
    const [movies, setMovies] = useState([]);
    
    /**
     * Función asincrónica para realizar la llamada a la API de TMDB y obtener películas.
     * @param {string} searchTerm El término de búsqueda para la película.
     */
    const fetchMovies = async (searchTerm) => {
        try {
            // Realiza la petición a la API.
            const response = await fetch(
                `${BASE_URL}?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(searchTerm)}`
            );
            // Si la respuesta HTTP no es exitosa, no hacemos nada y no se muestran resultados.
            if (!response.ok) {
                setMovies([]); // Limpia la lista si hay un error HTTP.
                return;
            }
            // Parsea la respuesta JSON.
            const data = await response.json();
            // Actualiza el estado 'movies' con los resultados obtenidos.
            setMovies(data.results || []);
        } catch (err) {
            // Si hay un error de red, limpia los resultados.
            setMovies([]);
        }
    };

    // Efecto de React que se ejecuta cada vez que 'query' cambia para buscar automáticamente.
    useEffect(() => {
        // Si el término de búsqueda está vacío, no busca y limpia las películas.
        if (query.trim() === "") {
            setMovies([]);
            return;
        }

        // Configura un temporizador para buscar después de que el usuario deje de escribir.
        const timerId = setTimeout(() => {
            fetchMovies(query);
        }, 500);

        // Función de limpieza para cancelar el temporizador anterior.
        return () => {
            clearTimeout(timerId);
        };
    }, [query]);

    // JSX: Define la estructura y el contenido de la interfaz de usuario.
    return (
        <div className="App">
            <header className="App-header">
                <h1>Buscador de Películas</h1>
                <div className="search-input-group">
                    {/* Input de búsqueda controlado por el estado 'query'. */}
                    <input
                        type="text"
                        placeholder="Buscar película..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </header>

            <main>
                {/* Contenedor de la cuadrícula de películas. */}
                <div className="movie-grid">
                    {/* Mapea la lista completa de películas y renderiza una tarjeta para cada una. */}
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img
                                src={
                                    // Usa la URL del póster de la película o una imagen de placeholder.
                                    movie.poster_path
                                        ? `${IMAGE_BASE_URL}${movie.poster_path}`
                                        : "https://via.placeholder.com/300x450?text=Sin+Imagen"
                                }
                                alt={movie.title}
                            />
                            <p>{movie.title}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
