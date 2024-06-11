import axios from 'axios';

const TMDB_API_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieById = async (id) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/popular`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};