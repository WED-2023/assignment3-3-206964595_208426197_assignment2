<template>
  <div class="right-panel">
    <div v-if="isLoggedIn">
      <h3>Last Watched Recipes</h3>
      <div v-if="recipes.length > 0">
        <RecipePreviewList :recipes="recipes" />
      </div>
      <div v-else class="no-recipes">
        <p>No recently watched recipes yet!</p>
        <p class="text-muted">Start exploring recipes to see them here.</p>
      </div>
    </div>
    <div v-else class="welcome-section">
      <h3>Welcome!</h3>
      <p>Join our community to track your favorite recipes!</p>
      <div class="auth-buttons">
        <router-link to="/login" class="btn btn-primary me-2">Login</router-link>
        <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from './RecipePreviewList.vue'

export default {
  name: 'RightPanel',
  components: { RecipePreviewList },
  data() {
    return {
      isLoggedIn: false,
      recipes: []
    };
  },
  async mounted() {
    await this.loadLastWatched();
  },
  methods: {
    async loadLastWatched() {
      try {
        console.log('Loading last watched recipes...');
        const response = await this.axios.get(
          `${this.$root.store.server_domain}/users/lastWatchedRecipes`, 
          { withCredentials: true }
        );
        
        console.log('Last watched recipes response:', response.data);
        this.recipes = response.data || [];
        this.isLoggedIn = true;
      } catch (err) {
        console.log('Not logged in or error fetching watched recipes:', err.response?.status);
        this.isLoggedIn = false;
        this.recipes = [];
      }
    }
  }
};
</script>

<style scoped>
.right-panel {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem;
}

.right-panel h3 {
  color: #343a40;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.no-recipes {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.welcome-section {
  text-align: center;
  padding: 2rem;
}

.welcome-section h3 {
  color: #495057;
  margin-bottom: 1rem;
}

.welcome-section p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.auth-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  display: inline-block;
  font-weight: 500;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
}

.btn-outline-primary {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.text-muted {
  color: #6c757d !important;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .auth-buttons {
    flex-direction: column;
  }
}
</style>