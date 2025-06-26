// src/api/apiHelper.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,            
});

// Register
export const register = async (userData) => {
  const response = await api.post('/auth/Register', userData);
  return response.data;
};

// Login
export const login = async (credentials) => {
  const response = await api.post('/auth/Login', credentials);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post('/auth/Logout');
  return response.data;
};


// Favorites
export const getFavoriteRecipes = async () => {
  const response = await api.get('/users/favorites');
  return response.data;
};

export const markAsFavorite = async (recipeId) => {
  const response = await api.post('/users/favorites', { recipeId });
  return response.data;
};

// Recipes
export const getMyRecipes = async () => {
  const response = await api.get('/users/my_recipes');
  return response.data;
};

export const getFamilyRecipes = async () => {
  const response = await api.get('/users/family');
  return response.data;
};

export const getRecipeById = async (recipeId) => {
  const response = await api.get(`/recipes/${recipeId}`);
  return response.data;
};

// Watched
export const markAsWatched = async (recipeId) => {
  const response = await api.post(`/users/markwatched/${recipeId}`);
  return response.data;
};

export const getLastWatchedRecipes = async () => {
  const response = await api.get('/users/lastWatchedRecipes');
  return response.data;
};

// Explore 
export const getExploreRecipes = async () => {
  const response = await api.get('/recipes/Explore');
  return response.data;
};

// Search 
export const searchRecipes = async (params) => {
  const response = await api.get('/recipes/search', { params });
  return response.data;
};


export const getRecipeDetails = async (recipeId) => {
  const response = await api.get(`/recipes/${recipeId}`);
  return response.data;
};


export const likeRecipe = async (recipeId) => {
  const response = await api.post(`/recipes/${recipeId}/like`);
  return response.data;
};


export default api;

