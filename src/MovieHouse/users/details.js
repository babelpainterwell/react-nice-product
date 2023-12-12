import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client";
import * as likesClient from "../likes/client";
import * as followsClient from "../follows/client";
import * as reviewClient from "../reviews/client";
import moment from "moment";
import { RiUserFollowLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { RiMovie2Line } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import { MdOutlineMoreHoriz } from "react-icons/md";

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
    // if (!currentUser) {
    //   navigate("/signin");
    //   return;
    // }
    // once signout is triggered, currentUser will be null, and the userId will change and it will trigger the useEffect again
    if (!userId) {
      return;
    }

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
    const status = await client.updateUser(userId, updatedUser);
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
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewClient.deleteReview(reviewId);
        await fetchReviews(); // Re-fetch reviews after deleting
      } catch (error) {
        console.error("Error deleting review:", error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
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
                className="btn btn-info float-end text-white"
              >
                <RiUserFollowLine size={18} className="me-2" />
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
          className="btn btn-info float-end text-white "
        >
          <RiUserFollowLine size={18} className="me-2" />
          Follow
        </button>
      )}
      <h2>User Profile</h2>
      <hr />
      {user && (
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            {user.role === "DIRECTOR" &&
              (isViewingOwnProfile ? (
                <Link to={`/movies`} className="btn btn-outline-info">
                  View My Published Movies
                </Link>
              ) : (
                <Link to={`/movies/${userId}`} className="btn btn-outline-info">
                  View Director's Movies
                </Link>
              ))}
          </div>
          {isViewingOwnProfile && (
            <div style={{ marginBottom: "50px" }}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  <strong>Email:</strong>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>First Name:</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  <strong>Last Name:</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </div>
              <div className="text-end mt-4">
                <button
                  onClick={updateUser}
                  className="btn btn-info text-white"
                >
                  <GrUpdate size={15} className="me-2" />
                  Update
                </button>
              </div>
            </div>
          )}

          <hr />
          <div>
            <h3 className="mt-5 mb-3 text-info">Favorite Movies</h3>
            {likes && likes.length > 0 ? (
              <ul className="list-group mb-4">
                {likes.map((like, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <Link
                      to={`/details/${like.movieId}`}
                      className="text-decoration-none text-black "
                    >
                      <RiMovie2Line
                        style={{ cursor: "pointer" }}
                        size="1.2em"
                        className="me-3"
                      />
                      <strong>{like.movieTitle}</strong>
                    </Link>
                    <MdOutlineMoreHoriz
                      className="text-info me-2"
                      style={{ cursor: "pointer" }}
                      size="1.2em"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No favorites added yet.</p>
            )}

            <hr className="mt-2" />

            <h3 className="mt-4 mb-3 text-info">{user.username}'s Followers</h3>
            {followers && followers.length > 0 ? (
              <div className="list-group mb-4">
                {followers.map((follows, index) => (
                  <div
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <Link
                      to={`/profile/${follows.follower._id}`}
                      className="text-decoration-none text-black"
                    >
                      <IoPersonAddOutline
                        className="text-black me-3"
                        style={{ cursor: "pointer" }}
                        size="1.2em"
                      />
                      <strong>{follows.follower.username}</strong>
                    </Link>
                    <MdOutlineMoreHoriz
                      className="text-info me-2"
                      style={{ cursor: "pointer" }}
                      size="1.2em"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No followers yet.</p>
            )}
          </div>

          <hr className="mt-2" />
          <div>
            <h3 className="mt-4 mb-3 text-info">Following</h3>
            {following && following.length > 0 ? (
              <div className="list-group mb-4">
                {following.map((follows, index) => (
                  <div
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <Link
                      to={`/profile/${follows.followed._id}`}
                      className="text-decoration-none text-black"
                    >
                      <IoPersonAddOutline
                        className="text-black me-3"
                        style={{ cursor: "pointer" }}
                        size="1.2em"
                      />
                      <strong>{follows.followed.username}</strong>
                    </Link>
                    <MdOutlineMoreHoriz
                      className="text-info me-2"
                      style={{ cursor: "pointer" }}
                      size="1.2em"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No following yet.</p>
            )}

            <hr className="mt-2" />

            <h3 className="mt-4 mb-3 text-info">Reviews</h3>
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
                        <small className="text-muted ms-2">
                          {moment(review.createdAt).format("MMMM Do, YYYY")}
                        </small>
                      </div>
                      {isViewingOwnProfile && (
                        <MdDeleteOutline
                          onClick={() => handleDeleteReview(review._id)}
                          style={{
                            cursor: "pointer",
                            color: "red",
                          }}
                          size="1.5em"
                        />
                      )}
                    </div>
                    <p>{review.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
