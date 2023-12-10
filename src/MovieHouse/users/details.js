import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client";
import * as likesClient from "../likes/client";
import * as followsClient from "../follows/client";
import * as reviewClient from "../reviews/client";
import moment from "moment";

function UserDetails() {
  const [user, setUser] = useState(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [likes, setLikes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.userReducer);
  const { id: paramId } = useParams();
  const userId = paramId || currentUser?._id;

  const fetchUser = async () => {
    const userDetails = await client.findUserById(userId);
    setUser(userDetails);
    setEditFirstName(userDetails.firstName); // Set initial values for edit
    setEditLastName(userDetails.lastName);
    setEditEmail(userDetails.email);
  };

  const fetchLikes = async () => {
    const movieLikes = await likesClient.findMoviesThatUserLikes(userId);
    setLikes(movieLikes);
  };

  const fetchFollowers = async () => {
    const userFollowers = await followsClient.findFollowersOfUser(userId);
    setFollowers(userFollowers);
  };

  const fetchFollowing = async () => {
    const userFollowing = await followsClient.findFollowedUsersByUser(userId);
    setFollowing(userFollowing);
  };

  // const fetchReviews = async () => {
  //   if (!currentUser) {
  //     return;
  //   }
  //   const userReviews = await reviewClient.findReviewsByUserId(currentUser._id);
  //   setReviews(userReviews);
  // };
  const fetchReviews = async () => {
    try {
      const userReviews = await reviewClient.findReviewsByUserId(userId);
      setReviews(userReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Handle the error appropriately
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
        await fetchLikes();
        await fetchFollowers();
        await fetchFollowing();
        await fetchReviews(); // This will now fetch reviews based on the profile being viewed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const updateUser = async () => {
    // Update the user state with the new values
    const updatedUser = {
      ...user,
      firstName: editFirstName,
      lastName: editLastName,
      email: editEmail,
    };

    // Update the user state
    setUser(updatedUser);
    const status = await client.updateUser(userId, user);
  };
  const followUser = async () => {
    const status = await followsClient.userFollowsUser(userId);
    fetchFollowers();
  };
  const unfollowUser = async () => {
    const status = await followsClient.userUnfollowsUser(userId);
    fetchFollowers();
  };
  const alreadyFollowing = () => {
    if (followers.length === 0) {
      return false;
    }
    return followers.some((follows) => {
      return follows.follower._id === currentUser._id;
    });
  };

  const isViewingOwnProfile = currentUser && currentUser._id === userId;

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewClient.deleteReview(reviewId);
      await fetchReviews(); // Re-fetch reviews after deleting
    } catch (error) {
      console.error("Error deleting review:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  return (
    <div className="container mb-5">
      {currentUser ? (
        currentUser._id !== userId && (
          <>
            {alreadyFollowing() ? (
              <button
                onClick={unfollowUser}
                className="btn btn-danger float-end"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={followUser}
                className="btn btn-warning float-end"
              >
                Follow
              </button>
            )}
          </>
        )
      ) : (
        <button
          onClick={() => {
            alert("Please sign in to follow this user.");
            navigate("/signin");
          }}
          className="btn btn-warning float-end"
        >
          Follow
        </button>
      )}
      <h2>User Details</h2>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <div>
            <p>Role: {user.role}</p>
            {/* {user.role === "ADMIN" && (
            <Link to="/users" className="btn btn-warning">
              Users
            </Link>
          )} */}
            {user.role === "DIRECTOR" &&
              (isViewingOwnProfile ? (
                <Link to={`/movies`} className="btn btn-warning">
                  View My Published Movies
                </Link>
              ) : (
                <Link to={`/movies/${userId}`} className="btn btn-warning">
                  View Director's Movies
                </Link>
              ))}
          </div>
          {isViewingOwnProfile && (
            <>
              <p>Email: {user.email}</p>
              <input
                type="email"
                className="form-control"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <p>First Name: {user.firstName}</p>
              <input
                type="text"
                className="form-control"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
              />
              <p>Last Name: {user.lastName}</p>
              <input
                type="text"
                className="form-control"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
              />
              <button onClick={updateUser} className="btn btn-primary">
                Update
              </button>
            </>
          )}

          <h3>Favorites</h3>
          <ul className="list-group">
            {likes &&
              likes.map((like, index) => (
                <li key={index} className="list-group-item">
                  <Link to={`/details/${like.movieId}`}>{like.movieTitle}</Link>
                </li>
              ))}
          </ul>
          <h3>Followers</h3>
          <div className="list-group">
            {followers &&
              followers.map((follows, index) => (
                <Link
                  key={index}
                  className="list-group-item"
                  to={`/profile/${follows.follower._id}`}
                >
                  {follows.follower.username}
                  {/* {follows.follower._id} */}
                </Link>
              ))}
          </div>
          <h3>Following</h3>
          <div className="list-group">
            {following &&
              following.map((follows, index) => (
                <Link
                  key={index}
                  className="list-group-item"
                  to={`/profile/${follows.followed._id}`}
                >
                  {follows.followed.username}
                  {/* {follows.followed._id} */}
                </Link>
              ))}
          </div>
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            <ul className="list-group">
              {reviews.map((review) => (
                <li key={review._id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Link
                        to={`/details/${review.movieId}`}
                        className="text-decoration-none"
                      >
                        <span className="fw-bold">{review.movieTitle}</span>{" "}
                      </Link>
                      <small className="text-muted">
                        {moment(review.createdAt).format("MMMM Do, YYYY")}
                      </small>
                    </div>
                    {isViewingOwnProfile && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p>{review.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDetails;
