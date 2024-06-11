import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchPopularMovies } from '../lib/tmdb';
import MovieCard from '../components/movieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadPopularMovies = async () => {
      const popularMovies = await fetchPopularMovies();
      setMovies(popularMovies);
    };

    const loadFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    loadPopularMovies();
    loadFavorites();
  }, []);

  const toggleFavorite = async (tmdbId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isFavorited = favorites.some(fav => fav.tmdbId === tmdbId);
    try {
      if (isFavorited) {
        await axios.delete('/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { tmdbId },
        });
        setFavorites(favorites.filter(fav => fav.tmdbId !== tmdbId));
      } else {
        const response = await axios.post('/api/favorites', { tmdbId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites([...favorites, response.data]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Popular Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorited={favorites.some(fav => fav.tmdbId === movie.id)}
            onButtonClick={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
