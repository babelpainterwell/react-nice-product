// The client file interacting with external API

import axios from "axios";
export const TMDB_API = "https://api.themoviedb.org/3";
export const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const findMovies = async (searchTerm) => {
  const response = await axios.get(
    `${TMDB_API}/search/movie?query=${searchTerm}&api_key=${API_KEY}`
  );
  return response.data.results;
};
