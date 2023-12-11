import axios from "axios";
import "dotenv/config.js";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
const USERS_API = `${API_BASE}/api/users`;

const client = axios.create({
  withCredentials: true,
  // baseURL: "http://localhost:4000/api/users",
  // baseURL: "https://node-nice-product.onrender.com/api/users",
  baseURL: USERS_API,
});

export const userFollowsUser = async (followed) => {
  const response = await client.post(`/${followed}/follows`);
  return response.data;
};

export const userUnfollowsUser = async (followed) => {
  const response = await client.delete(`/${followed}/follows`);
  return response.data;
};

export const findFollowersOfUser = async (followed) => {
  const response = await client.get(`/${followed}/followers`);
  return response.data;
};

export const findFollowedUsersByUser = async (follower) => {
  const response = await client.get(`/${follower}/following`);
  return response.data;
};
