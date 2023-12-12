import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client";
import * as movieClient from "../movies/client";
import PublishedMovieCard from "../movies/publishedMovieCard";
import { MdPublish } from "react-icons/md";

function Movies() {
  const [user, setUser] = useState(null);
  const [publishedMovies, setPublishedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.userReducer);
  const { id: paramId } = useParams();
  const userId = paramId || currentUser?._id;

  const navigate = useNavigate();

  const handlePublishClick = () => {
    if (!currentUser) {
      alert("Please sign in to publish a movie.");
      navigate("/signin");
      return;
    }
    navigate("/create-movie"); // The path to your CreateMovieForm component
  };

  const fetchUser = async () => {
    try {
      const userDetails = await client.findUserById(userId);
      setUser(userDetails);
    } catch (error) {
      setError("Failed to fetch user details: " + error.message);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const userMovies = await movieClient.findMoviesByUser(userId);
      setPublishedMovies(userMovies);
    } catch (error) {
      setError("Failed to fetch movies: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!currentUser) {
    //   navigate("/signin");
    //   return;
    // }
    const performFetchOperations = async () => {
      try {
        await fetchUser();
        await fetchMovies();
      } catch (err) {
        console.error("Error in fetching data:", err);
        setError(err.message);
      }
    };

    performFetchOperations();
  }, []);

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Movies ({publishedMovies.length})</h2>
        {currentUser &&
          currentUser.role === "DIRECTOR" &&
          currentUser._id === userId && (
            <button
              onClick={handlePublishClick}
              className="btn btn-info text-white"
            >
              <MdPublish className="ms-0 me-2" size={18} />
              Publish
            </button>
          )}
      </div>
      <hr />
      <div className="row">
        {publishedMovies.length > 0 ? (
          publishedMovies.map((movie) => (
            <div
              key={movie._id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3"
            >
              <PublishedMovieCard movie={movie} />
            </div>
          ))
        ) : (
          <h2>No movies published by this director yet.</h2>
        )}
      </div>
    </div>
  );
}

export default Movies;
