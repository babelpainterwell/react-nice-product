import axios from "axios";
// import "dotenv/config.js";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
const API_API = `${API_BASE}/api`;

// const API_BASE = "https://node-nice-product.onrender.com/api";
const client = axios.create({
  withCredentials: true,
  baseURL: API_API,
});

export const findAllLikes = async () => {
  const response = await client.get("/likes");
  return response.data;
};

export const createUserLikesMovie = async (userId, movieId, movieTitle) => {
  const response = await client.post(
    `/users/${userId}/likes/${movieId}/${movieTitle}`
  );
  return response.data;
};

export const deleteUserLikesMovie = async (userId, movieId) => {
  const response = await client.delete(`/users/${userId}/likes/${movieId}`);
  return response.data;
};

export const findUsersThatLikeMovie = async (movieId) => {
  const response = await client.get(`/likes/${movieId}/users`);
  return response.data;
};

export const findMoviesThatUserLikes = async (userId) => {
  try {
    const response = await client.get(`/users/${userId}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies liked by user:", error);
    throw error;
  }
};
