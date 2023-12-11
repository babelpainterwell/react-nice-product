import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewList from "./ReviewList";
import { useSelector } from "react-redux";
import * as likesClient from "../likes/client";
import * as reviewClient from "../reviews/client";
import { GrLike } from "react-icons/gr";
import { FaCalendarAlt, FaStar, FaLanguage } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import "dotenv/config.js";

function MovieDetails() {
  const { currentUser } = useSelector((state) => state.userReducer);
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState("");
  const [error, setError] = useState(null);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);
  const API = process.env.REACT_APP_TMDB_API_KEY;

  const navigate = useNavigate();

  const like = async () => {
    if (!currentUser) {
      alert("Please sign in to like the movie.");
      navigate("/signin");
      return;
    }
    await likesClient.createUserLikesMovie(
      currentUser._id,
      movieId,
      movieDetails.original_title
    );
    fetchUsersWhoLiked();
  };

  const unlike = async () => {
    await likesClient.deleteUserLikesMovie(currentUser._id, movieId);
    fetchUsersWhoLiked();
  };

  const fetchUsersWhoLiked = async () => {
    const usersWhoLiked = await likesClient.findUsersThatLikeMovie(movieId);
    setUsersWhoLiked(usersWhoLiked);
  };

  const alreadyLiked = () => {
    if (!currentUser) {
      return false;
    }
    if (usersWhoLiked.length === 0) {
      return false;
    }

    return usersWhoLiked.some((user) => user.user._id === currentUser._id);
  };

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovieDetails(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const fetchReviews = async () => {
    try {
      // setReviews(dummyReviews); // Update this line with actual API call if needed
      const reviews = await reviewClient.findReviewsByMovieId(movieId);
      setReviews(reviews);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    // Fetches related to movie details and reviews
    const fetchData = async () => {
      try {
        await fetchMovieDetails();
        await fetchReviews();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [movieId]);

  useEffect(() => {
    // Separate useEffect for likes to avoid dependency loop
    // fetchLikes();
    fetchUsersWhoLiked();
  }, [currentUser, movieId]);

  const renderLikeButton = () => {
    if (currentUser) {
      const likeIconStyle = alreadyLiked()
        ? { color: "red", cursor: "pointer", size: "4em" }
        : { cursor: "pointer", size: "4em" };

      return (
        <div onClick={alreadyLiked() ? unlike : like}>
          <GrLike style={likeIconStyle} />
        </div>
      );
    } else {
      // Correctly return the button in the else block
      return (
        <div
          onClick={() => {
            alert("Please sign in to like the movie.");
            navigate("/signin");
          }}
        >
          <GrLike style={{ cursor: "pointer", size: "4em" }} />
        </div>
      );
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please sign in to submit a review.");
      navigate("/signin");
      return;
    }

    if (!reviewContent.trim()) {
      alert("Please enter a review.");
      return;
    }

    try {
      const newReview = {
        user: currentUser._id, // Assuming currentUser contains the user ID
        movieId: movieId,
        movieTitle: movieDetails.original_title,
        content: reviewContent,
      };
      await reviewClient.createReview(newReview); // Replace with your actual API call
      setReviewContent("");
      fetchReviews(); // Fetch reviews again to update the list
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error appropriately
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (Object.keys(movieDetails).length === 0) {
    return (
      <div>
        <h2>
          Please try again. It might take a while to fetch the movie details.
        </h2>
      </div>
    );
  }

  const placeholderImage = "../../placeholder.png";

  return (
    <div className="container mb-5 mt-5">
      {/* <h3>{currentUser._id}</h3> */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <img
            src={
              movieDetails.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`
                : placeholderImage
            }
            alt={movieDetails.original_title}
            className="img-fluid rounded shadow-lg"
          />
        </div>
        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-center w-75">
            <h2 className="mb-3">{movieDetails.title}</h2>
            <div className="d-flex ms-4 align-items-center text-muted mb-3">
              {renderLikeButton()}
              <span className="ms-2">{usersWhoLiked.length}</span>
            </div>
          </div>

          <div className="mt-1">
            {usersWhoLiked.length > 0 && (
              <p className="text-muted">
                Liked by:{" "}
                {usersWhoLiked.map((user) => (
                  <span
                    key={user.user._id}
                    className="badge me-1 ms-1"
                    style={{
                      padding: "10px 15px",
                      fontSize: "1em",
                      backgroundColor: "#e9ecef",
                    }}
                  >
                    <a
                      href={`/#/profile/${user.user._id}`}
                      className="text-decoration-none text-info" // Changed text color to info
                    >
                      {user.user.username}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>

          <strong className="text-muted">{movieDetails.overview}</strong>
          <div className="mt-5">
            {/* Release Date */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center text-info">
                <FaCalendarAlt className="me-2" />
                <strong>Release Date</strong>
              </div>
              <span className="text-end fw-bold">
                {movieDetails.release_date ? movieDetails.release_date : "N/A"}
              </span>
            </div>

            {/* Rating */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center text-info">
                <FaStar className="me-2" />
                <strong>Rating</strong>
              </div>
              <span className="text-end fw-bold">
                {movieDetails.vote_average
                  ? `${movieDetails.vote_average} / 10`
                  : "Rating not available"}
              </span>
            </div>

            {/* Original Language */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center text-info">
                <FaLanguage className="me-2" />
                <strong>Original Language</strong>
              </div>
              <span className="text-end fw-bold">
                {movieDetails.original_language
                  ? movieDetails.original_language.toUpperCase()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-4">
        <ReviewList reviews={reviews} />
      </section>

      <div className="mt-5">
        <h3 className="text-info">Share a Review</h3>
        <form onSubmit={submitReview}>
          <textarea
            className="form-control"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review here"
            rows="3"
          ></textarea>
          <button
            type="submit"
            className="btn btn-outline-info mt-3 mb-5"
            style={{ float: "right" }}
          >
            <IoIosShareAlt /> Share
          </button>
        </form>
      </div>
    </div>
  );
}

export default MovieDetails;
