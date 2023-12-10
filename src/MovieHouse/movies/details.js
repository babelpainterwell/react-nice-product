import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as movieClient from "./client";

function PublishedMovieDetails() {
  const [movie, setMovie] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableMovie, setEditableMovie] = useState({});
  const { currentUser } = useSelector((state) => state.userReducer);
  const { movieId } = useParams();
  const navigate = useNavigate();

  const fetchMovie = async () => {
    try {
      const fetchedMovie = await movieClient.findMovieById(movieId);
      setMovie(fetchedMovie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      // Optionally handle the error, e.g., set an error message in state
    }
  };

  useEffect(() => {
    // if (!currentUser) {
    //   alert("You must be logged in to view this page");
    //   navigate("/signin");
    // } else {
    //   fetchMovie();
    // }
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (movie) {
      setEditableMovie({ ...movie });
    }
  }, [movie]);

  // Check if the movie data is still loading or not found
  if (!movie) {
    return (
      <div className="container">
        <h2>Loading movie details...</h2>
      </div>
    );
  }

  const placeholderImage = "../../placeholder.png";
  const isViewingOwnMovie = currentUser && currentUser._id === movie.user;

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditableMovie({ ...movie });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await movieClient.updateMovie(movie._id, editableMovie);
      setMovie(editableMovie);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await movieClient.deleteMovie(movie._id);
        navigate("/movies"); // Navigate back to the movies list
      } catch (error) {
        console.error("Error deleting movie:", error);
        // Handle error, maybe show a user-friendly message
      }
    }
  };

  return (
    <div className="container mb-5 mt-5">
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`
                  : placeholderImage
              }
              alt={movie.original_title}
              className="img-fluid rounded shadow-lg"
            />
          </div>
        </div>

        <div className="col-lg-6">
          {isEditMode ? (
            <>
              <input
                type="text"
                className="form-control mb-2"
                value={editableMovie.original_title}
                name="original_title"
                onChange={handleChange}
              />
              <textarea
                className="form-control mb-2"
                rows={5}
                value={editableMovie.overview}
                name="overview"
                onChange={handleChange}
              />
              <input
                type="date"
                className="form-control mb-2"
                value={editableMovie.release_date}
                name="release_date"
                onChange={handleChange}
              />
              <button onClick={handleUpdate} className="btn btn-success me-2">
                Save Changes
              </button>
              <button onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2 className="mb-3">{movie.original_title}</h2>
              <p className="text-muted">{movie.overview}</p>
              <div className="mt-5">
                <div className="mb-3">
                  <span className="badge bg-primary me-2 fs-5">
                    Release Date
                  </span>
                  <span className="text-secondary fs-5">
                    {movie.release_date}
                  </span>
                </div>
              </div>
              {isViewingOwnMovie && (
                <div>
                  <button
                    onClick={handleEdit}
                    className="btn btn-secondary me-2"
                  >
                    Edit
                  </button>
                  <button onClick={handleDelete} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublishedMovieDetails;
