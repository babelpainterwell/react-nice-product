import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as movieClient from "./client";
import { FaCalendarAlt, FaLanguage } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

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
        <div className="col-md-4 col-lg-3 mb-4">
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

        <div className="col-md-8 col-lg-9">
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
            <div className="card ms-5">
              <div className="card-body">
                <h2 className="card-title mb-4">{movie.original_title}</h2>
                <strong className="card-text text-muted mb-4">
                  {movie.overview}
                </strong>

                <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                  <div className="d-flex align-items-center text-info">
                    <FaCalendarAlt className="me-2" />
                    <strong>Release Date</strong>
                  </div>
                  <span className="text-end fw-bold">
                    {movie.release_date ? movie.release_date : "N/A"}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center text-info">
                    <FaLanguage className="me-2" />
                    <strong>Original Language</strong>
                  </div>
                  <span className="text-end fw-bold">
                    {movie.original_language
                      ? movie.original_language.toUpperCase()
                      : "N/A"}
                  </span>
                </div>

                {isViewingOwnMovie && (
                  <div className="text-end">
                    <button
                      onClick={handleEdit}
                      className="btn btn-outline-secondary me-2"
                    >
                      <FiEdit className="me-2" size={15} />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn btn-outline-danger"
                    >
                      <MdDeleteOutline className="me-2" size={19} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublishedMovieDetails;
