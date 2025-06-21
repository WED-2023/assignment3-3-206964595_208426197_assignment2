<template>
  <div>
    <div v-if="isLoggedIn">
      <h2>Last watched recipes</h2>
      <RecipePreviewList :recipes="recipes" />
    </div>
    <div v-else>
      <h2>Welcome!</h2>
      <router-link to="/login">Login</router-link>
      <br />
      <router-link to="/register">Register</router-link>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from './RecipePreviewList.vue'
export default {
  components: { RecipePreviewList },
  data() {
    return {
      isLoggedIn: false,
      recipes: []
    };
  },
  async mounted() {
    try {
      const response = await this.axios.get("http://localhost:3000/users/lastWatchedRecipes", { withCredentials: true });
      this.recipes = response.data;
      this.isLoggedIn = true;
    } catch (err) {
      this.isLoggedIn = false;
    }
  }
};
</script>
