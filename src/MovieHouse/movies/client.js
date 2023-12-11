import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
const MOVIES_API = `${API_BASE}/api/movies`;

const client = axios.create({
  withCredentials: true,
  // baseURL: "http://localhost:4000/api/movies",
  baseURL: MOVIES_API,
});

export const findAllMovies = async () => {
  try {
    const response = await client.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all movies:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const findMovieById = async (id) => {
  try {
    const response = await client.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching movie by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createMovie = async (movie) => {
  try {
    const response = await client.post("/", movie);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating movie:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateMovie = async (id, movie) => {
  try {
    const response = await client.put(`/${id}`, movie);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating movie:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteMovie = async (id) => {
  try {
    const response = await client.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting movie:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const findMoviesByUser = async (userId) => {
  try {
    const response = await client.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching movie by user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
