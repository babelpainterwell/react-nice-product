import axios from "axios";
import "dotenv/config.js";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
const REVIEWS_API = `${API_BASE}/api/reviews`;

const client = axios.create({
  withCredentials: true,
  baseURL: REVIEWS_API,
});

export const createReview = async (review) => {
  try {
    const response = await client.post("/", review);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating review:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const findAllReviews = async () => {
  try {
    const response = await client.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all reviews:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const findReviewById = async (id) => {
  try {
    const response = await client.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching review by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateReview = async (id, review) => {
  try {
    const response = await client.put(`/${id}`, review);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating review:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await client.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting review:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const findReviewsByMovieId = async (id) => {
  try {
    const response = await client.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching reviews by movie ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const findReviewsByUserId = async (id) => {
  try {
    const response = await client.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching reviews by user ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};
