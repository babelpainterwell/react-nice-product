import React, { useState, useEffect } from "react";
import MovieCard from "../MovieCard";
import { useSelector } from "react-redux";
import * as likesClient from "../likes/client";

function Home() {
  const API = process.env.REACT_APP_TMDB_API_KEY;
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.userReducer);
  const [moviesLikedByUser, setMoviesLikedByUser] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMovies(data.results);
    } catch (e) {
      setError("Failed to load movies: " + e.message);
    }
  };

  const fetchMoviesLikedByUser = async (userLikes) => {
    try {
      const moviesDetails = await Promise.all(
        userLikes.map(async (like) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${like.movieId}?api_key=${API}`
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
      );
      setMoviesLikedByUser(moviesDetails);
    } catch (e) {
      setError("Failed to load user's liked movies: " + e.message);
    }
  };

  const getCustomizedFeeds = async () => {
    try {
      const moviesThatUserLikes = await likesClient.findMoviesThatUserLikes(
        currentUser._id
      );
      await fetchMoviesLikedByUser(moviesThatUserLikes);
    } catch (e) {
      setError("Failed to fetch customized feeds: " + e.message);
    }
  };

  useEffect(() => {
    getMovies();
    if (currentUser) {
      getCustomizedFeeds();
    }
  }, [currentUser]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const uniqueMovies = movies.filter(
    (movie) =>
      !moviesLikedByUser.find((likedMovie) => likedMovie.id === movie.id)
  );

  return (
    <div className="container">
      <div className="row">
        {moviesLikedByUser.length > 0 ? (
          moviesLikedByUser.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-3">
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <></>
        )}
        {uniqueMovies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-3">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
