import { reactive } from 'vue';
import {
  getMyRecipes,
  getFavoriteRecipes,
  getLastWatchedRecipes
} from "@/api/apiHelper";

const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: "http://localhost:3000",

  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log("login", this.username);
  },

  logout() {
    console.log("logout");
    localStorage.removeItem('username');
    this.username = undefined;
  },

  // API 
  async getMyRecipes() {
    return await getMyRecipes();
  },

  async getFavoriteRecipes() {
    return await getFavoriteRecipes();
  },

  async getWatchedRecipes() {
    return await getLastWatchedRecipes();
  }
});

export default store;
