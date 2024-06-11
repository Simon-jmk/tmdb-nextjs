import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchMovies } from '../lib/tmdb';
import MovieCard from '../components/movieCard';

export default function Search() {
  const router = useRouter();
  const { query } = router.query;
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

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

  useEffect(() => {
    if (query) {
      const searchMovies = async () => {
        const results = await fetchMovies(query);
        setMovies(results);
      };
      searchMovies();
      loadFavorites();
    }
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Search Results for "{query}"</h1>
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
