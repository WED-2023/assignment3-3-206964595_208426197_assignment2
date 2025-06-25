<template>
  <div class="user-page">
    <!-- Page Header -->
    <div class="page-header my-recipes-header">
      <div class="header-content">
        <div class="header-icon my-recipes-icon">
          <i class="fas fa-book">📖</i>
        </div>
        <div class="header-text">
          <h1 class="page-title">My Recipes</h1>
          <p class="page-subtitle">Your personal collection of culinary creations</p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="content-container">
      <div class="recipes-section">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Loading your recipes...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="myRecipes.length === 0" class="empty-state">
          <div class="empty-icon my-recipes-empty">
            <i class="fas fa-plus-circle"></i>
          </div>
          <h3>No Recipes Created Yet</h3>
          <p>Share your culinary expertise with the world!</p>
          <button @click="createRecipe" class="cta-btn">
            <i class="fas fa-plus"></i>
            Create Your First Recipe
          </button>
        </div>

        <!-- Recipes Grid -->
        <div v-else class="recipes-grid">
          <div class="grid-header">
            <h3 class="grid-title">
              <i class="fas fa-chef-hat"></i>
              {{ myRecipes.length }} Recipe{{ myRecipes.length !== 1 ? 's' : '' }} Created
            </h3>
            <div class="grid-actions">
              <button @click="refreshRecipes" class="refresh-btn" :disabled="loading">
                <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              </button>
            </div>
          </div>
          
          <div class="recipes-container">
            <RecipePreview
              v-for="recipe in myRecipes"
              :key="recipe.id"
              :recipe="recipe"
              :is-favorite="false"
              :was-watched="watchedRecipes.includes(recipe.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";
import { getMyRecipes, getLastWatchedRecipes } from "@/api/apiHelper";

export default {
  name: "MyRecipesPage",
  components: {
    RecipePreview,
  },
  data() {
    return {
      myRecipes: [],
      watchedRecipes: [],
      loading: true,
    };
  },
  async created() {
    await this.loadMyRecipes();
  },
  methods: {
    async loadMyRecipes() {
      this.loading = true;
      try {
        console.log("📦 Calling getMyRecipes...");
        const rawRecipes = await getMyRecipes();
        console.log("✅ My recipes received:", rawRecipes);

        console.log("👁 Calling getLastWatchedRecipes...");
        const watched = await getLastWatchedRecipes();
        console.log("✅ Watched recipes received:", watched);

        this.myRecipes = rawRecipes.map((recipe) => ({
          ...recipe,
          aggregateLikes: recipe.aggregateLikes || recipe.popularity || 0,
        }));

        this.watchedRecipes = watched.map((r) => r.id || r.recipe_id);
      } catch (err) {
        console.error("❌ Failed to load my recipes:", err);
        this.$root.toast('Error', 'Failed to load your recipes', 'danger');
      } finally {
        this.loading = false;
      }
    },
    async refreshRecipes() {
      await this.loadMyRecipes();
    },
    createRecipe() {
      // Use the same method as the navbar to open the create recipe modal
      if (window.bootstrap) {
        const modal = document.getElementById('createRecipeModal');
        if (modal) {
          const bootstrapModal = new window.bootstrap.Modal(modal);
          bootstrapModal.show();
        } else {
          this.$root.toast('Info', 'Please use the Create Recipe button in the navbar', 'info');
        }
      } else {
        this.$root.toast('Info', 'Please use the Create Recipe button in the navbar', 'info');
      }
    }
  }
};
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.page-header {
  padding: 60px 0 40px;
  position: relative;
  overflow: hidden;
}

.my-recipes-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="60" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.header-text {
  color: white;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #718096;
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #718096;
}

.empty-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 3rem;
  color: #a0aec0;
}

.my-recipes-empty {
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  color: #667eea;
}

.empty-state h3 {
  font-size: 1.8rem;
  color: #4a5568;
  margin-bottom: 15px;
  font-weight: 600;
}

.empty-state p {
  margin-bottom: 30px;
  font-size: 1.1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.cta-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  color: white;
  text-decoration: none;
}

.recipes-grid {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.grid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
}

.grid-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.grid-actions {
  display: flex;
  gap: 10px;
}

.refresh-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.refresh-btn:hover:not(:disabled) {
  background: #edf2f7;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recipes-container {
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .grid-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .grid-actions {
    justify-content: center;
  }
  
  .recipes-container {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 20px;
  }
  
  .content-container {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0 30px;
  }
  
  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .empty-icon {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
}
</style>