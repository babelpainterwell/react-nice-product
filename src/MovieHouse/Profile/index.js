import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
  const dummyUsers = [
    {
      id: "user123",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      profilePicture: "https://example.com/profiles/user123.jpg",
      bio: "Movie enthusiast and amateur critic.",
      following: ["user456", "user789"],
      followers: ["user789"],
      reviews: [1], // References the review by ID
    },
    {
      id: "user456",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      profilePicture: "https://example.com/profiles/user456.jpg",
      bio: "Avid film watcher and reviewer.",
      following: ["user123"],
      followers: ["user123", "user789"],
      reviews: [2],
    },
    {
      id: "user789",
      name: "Carol White",
      email: "carol.white@example.com",
      profilePicture: "https://example.com/profiles/user789.jpg",
      bio: "Lover of all things cinema.",
      following: ["user123"],
      followers: ["user456"],
      reviews: [3],
    },
    // Add more user profiles as needed
  ];

  //   if (userId) {
  //     // If profileId exists, it means we are viewing another user's profile
  //     // In this case, we want to display a "Follow" button
  //     // Otherwise, we are viewing the logged-in user's own profile
  //     // In this case, we want to display an "Edit Profile" button
  //     setIsOwnProfile(false);
  //   }

  const [userData, setUserData] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { userId } = useParams(); // Extract userId from URL

  useEffect(() => {
    // If userId is present, we are viewing another user's profile
    if (userId) {
      const fetchedUserData = dummyUsers.find((user) => user.id === userId);
      if (fetchedUserData) {
        setUserData(fetchedUserData);
        setIsOwnProfile(false);
      }
    } else {
      // If userId is not present, assume viewing logged-in user's profile
      // Replace 'user123' with logic to get the current logged-in user's ID
      const currentUserId = "user123";
      const currentUserData = dummyUsers.find(
        (user) => user.id === currentUserId
      );
      if (currentUserData) {
        setUserData(currentUserData);
        setIsOwnProfile(true);
      }
    }
  }, [userId, dummyUsers]);

  if (!userData) {
    return <div>Woops! No user data is found.</div>;
  }

  return (
    <div>
      {/* Personal Information */}
      <section>
        <h2>Personal Information</h2>
        <p>Name: {userData.name}</p>
        {isOwnProfile && <p>Email: {userData.email}</p>}
        <p>Bio: {userData.bio}</p>
      </section>

      {/* Following */}
      <section>
        <h2>Following</h2>
        <ul>
          {userData.following.map((followId) => (
            <li key={followId}>{followId}</li> // Replace with actual user name if available
          ))}
        </ul>
      </section>

      {/* Followers */}
      <section>
        <h2>Followers</h2>
        <ul>
          {userData.followers.map((followerId) => (
            <li key={followerId}>{followerId}</li> // Replace with actual user name if available
          ))}
        </ul>
      </section>

      {/* Reviews */}
      <section>
        <h2>Reviews</h2>
        {/* Map through user's reviews */}
        <ul>
          {userData.reviews.map((reviewId) => (
            <li key={reviewId}>Review ID: {reviewId}</li> // Implement functionality to display actual review content
          ))}
        </ul>
      </section>

      {isOwnProfile && <button>Edit Profile</button>}
    </div>
  );
}

export default Profile;
