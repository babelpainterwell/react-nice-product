import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewList from "./ReviewList";
import { useSelector } from "react-redux";
import * as likesClient from "../likes/client";
import * as reviewClient from "../reviews/client";
import { GrLike } from "react-icons/gr";

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
      return alreadyLiked() ? (
        <button onClick={unlike} className="btn btn-secondary">
          Unlike
        </button>
      ) : (
        <button onClick={like} className="btn btn-primary">
          Like
        </button>
      );
    } else {
      // Correctly return the button in the else block
      return (
        <button
          onClick={() => {
            alert("Please sign in to like the movie.");
            navigate("/signin");
          }}
          className="btn btn-primary"
        >
          Like
        </button>
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
          <div className="mt-3">
            <p className="text-muted">
              <GrLike /> {usersWhoLiked.length} likes
            </p>
            {usersWhoLiked.length > 0 && (
              <p className="text-muted">
                Liked by:{" "}
                {usersWhoLiked.map((user) => (
                  <span key={user.user._id} className="badge me-1">
                    {/* {user.username} */}
                    <a
                      href={`/#/profile/${user.user._id}`}
                      className="text-decoration-none text-black"
                    >
                      {user.user.username}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
        <div className="col-lg-6">
          <h2 className="mb-3">{movieDetails.title}</h2>
          <p className="text-muted">{movieDetails.overview}</p>
          <div className="mt-5">
            <div className="mb-3">
              <span className="badge bg-primary me-2 fs-5">Release Date</span>
              <span className="text-secondary fs-5">
                {movieDetails.release_date}
              </span>
            </div>
            <div className="mb-3">
              <span className="badge bg-success me-2 fs-5">Rating</span>
              <span className="text-secondary fs-5">
                {movieDetails.vote_average} / 10
              </span>
            </div>
            <div className="mb-3">
              <span className="badge bg-info me-2 fs-5">Original Language</span>
              <span className="text-secondary fs-5">
                {movieDetails.original_language}
              </span>
            </div>
          </div>
        </div>
      </div>
      {renderLikeButton()}
      <section className="mt-4">
        <ReviewList reviews={reviews} />
      </section>
      <div className="mt-4">
        <h3>Add a Review</h3>
        <form onSubmit={submitReview}>
          <textarea
            className="form-control"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review here"
            rows="3"
          ></textarea>
          <button type="submit" className="btn btn-primary mt-2">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default MovieDetails;
