import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchMovieById } from '../lib/tmdb';
import MovieCard from '../components/movieCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(response.data);

        const movieDetails = await Promise.all(response.data.map(fav => fetchMovieById(fav.tmdbId)));
        setMovies(movieDetails);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (tmdbId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete('/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { tmdbId },
      });
      setFavorites(favorites.filter(fav => fav.tmdbId !== tmdbId));
      setMovies(movies.filter(movie => movie.id !== tmdbId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Your Favorite Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorited={true}
            onButtonClick={removeFavorite}
          />
        ))}
      </div>
    </div>
  );
}
