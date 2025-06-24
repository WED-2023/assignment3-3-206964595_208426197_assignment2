<template>
  <div class="search-page">
    <!-- Search Header -->
    <div class="search-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-search"></i>
        </div>
        <div class="header-text">
          <h1 class="page-title">Search Recipes</h1>
          <p class="page-subtitle">Discover your next favorite recipe from thousands of options</p>
        </div>
      </div>
    </div>

    <!-- Search Form -->
    <div class="search-container">
      <div class="search-form-card">
        <form @submit.prevent="searchRecipes" class="search-form">
          <!-- Main Search Input -->
          <div class="main-search">
            <div class="search-input-group">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="What are you craving today? (e.g., pasta, chocolate cake, chicken curry)"
                required
              />
              <button type="submit" class="search-btn" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <i v-else class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Filters Row -->
          <div class="filters-row">
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-list-ol"></i>
                Results
              </label>
              <select v-model.number="numberOfRecipes" class="filter-select">
                <option :value="5">5 recipes</option>
                <option :value="10">10 recipes</option>
                <option :value="15">15 recipes</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-leaf"></i>
                Diet
              </label>
              <select v-model="diet" class="filter-select">
                <option value="">Any diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="glutenFree">Gluten Free</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-globe"></i>
                Cuisine
              </label>
              <select v-model="cuisine" class="filter-select">
                <option value="">Any cuisine</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Indian">Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="French">French</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-sort"></i>
                Sort by
              </label>
              <select v-model="sortBy" class="filter-select">
                <option value="">Relevance</option>
                <option value="time">Cooking time</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div class="advanced-filters">
            <button type="button" @click="showAdvanced = !showAdvanced" class="advanced-toggle">
              <i class="fas fa-sliders-h"></i>
              {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Filters
              <i class="fas fa-chevron-down" :class="{ 'rotated': showAdvanced }"></i>
            </button>

            <transition name="slide-down">
              <div v-show="showAdvanced" class="advanced-content">
                <div class="filter-group full-width">
                  <label class="filter-label">
                    <i class="fas fa-exclamation-triangle"></i>
                    Intolerances
                  </label>
                  <input
                    v-model="intolerance"
                    type="text"
                    class="filter-input"
                    placeholder="e.g., peanuts, gluten, dairy (comma-separated)"
                  />
                </div>
              </div>
            </transition>
          </div>
        </form>
      </div>
    </div>

    <!-- Results Section -->
    <div class="results-container" v-if="searchedOnce">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner-large"></div>
        <p>Searching for delicious recipes...</p>
      </div>

      <!-- Results -->
      <div v-else-if="recipes.length > 0" class="results-section">
        <div class="results-header">
          <h3 class="results-title">
            <i class="fas fa-utensils"></i>
            Found {{ recipes.length }} recipe{{ recipes.length !== 1 ? 's' : '' }}
            <span v-if="searchQuery" class="search-term">for "{{ searchQuery }}"</span>
          </h3>
          <div class="results-actions">
            <button @click="clearSearch" class="clear-btn">
              <i class="fas fa-times"></i>
              Clear
            </button>
          </div>
        </div>

        <div class="recipes-grid">
          <RecipePreviewList :recipes="sortedRecipes" />
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <div class="no-results-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>No recipes found</h3>
        <p>Try adjusting your search terms or filters</p>
        <div class="suggestions">
          <p class="suggestions-title">Popular searches:</p>
          <div class="suggestion-tags">
            <button @click="quickSearch('pasta')" class="suggestion-tag">Pasta</button>
            <button @click="quickSearch('chicken')" class="suggestion-tag">Chicken</button>
            <button @click="quickSearch('vegetarian')" class="suggestion-tag">Vegetarian</button>
            <button @click="quickSearch('dessert')" class="suggestion-tag">Dessert</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Welcome State -->
    <div v-else class="welcome-state">
      <div class="welcome-content">
        <div class="welcome-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>Ready to find something delicious?</h3>
        <p>Search through thousands of recipes to find your next favorite meal</p>
        <div class="popular-searches">
          <p class="popular-title">Try searching for:</p>
          <div class="popular-tags">
            <button @click="quickSearch('pasta')" class="popular-tag">
              <i class="fas fa-utensils"></i>
              Pasta
            </button>
            <button @click="quickSearch('chicken')" class="popular-tag">
              <i class="fas fa-drumstick-bite"></i>
              Chicken
            </button>
            <button @click="quickSearch('vegetarian')" class="popular-tag">
              <i class="fas fa-leaf"></i>
              Vegetarian
            </button>
            <button @click="quickSearch('dessert')" class="popular-tag">
              <i class="fas fa-cookie-bite"></i>
              Dessert
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from '../components/RecipePreviewList.vue';

export default {
  name: "SearchRecipesPage",
  components: {
    RecipePreviewList
  },
  data() {
    return {
      searchQuery: "",
      numberOfRecipes: 5,
      recipes: [],
      diet: "",
      intolerance: "",
      cuisine: "",
      sortBy: "",
      searchedOnce: false,
      loading: false,
      showAdvanced: false
    };
  },
  computed: {
    sortedRecipes() {
      if (!this.recipes.length) return [];
      
      if (this.sortBy === "time") {
        return [...this.recipes].sort((a, b) => {
          const timeA = a.readyInMinutes || a.Time || 0;
          const timeB = b.readyInMinutes || b.Time || 0;
          return timeA - timeB;
        });
      } else if (this.sortBy === "popularity") {
        return [...this.recipes].sort((a, b) => {
          const likesA = a.aggregateLikes || a.popularity || 0;
          const likesB = b.aggregateLikes || b.popularity || 0;
          return likesB - likesA;
        });
      }
      return this.recipes;
    },
  },

  methods: {
    async searchRecipes() {
      if (!this.searchQuery.trim()) return;
      
      this.loading = true;
      this.searchedOnce = true;
      
      try {
        const isLoggedIn = await this.checkLoginStatus();

        if (!isLoggedIn) {
          // Fetch from Spoonacular directly
          const response = await this.axios.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            {
              params: {
                query: this.searchQuery,
                number: this.numberOfRecipes,
                diet: this.diet,
                intolerances: this.intolerance,
                cuisine: this.cuisine,
                addRecipeInformation: true,
                apiKey: "af93fe3fb3e94d16a993328500f9cce5",
              },
            }
          );

          this.recipes = response.data.results.map((r) => ({
            id: r.id,
            title: r.title,
            image: r.image,
            readyInMinutes: r.readyInMinutes || 0,
            aggregateLikes: r.aggregateLikes || 0,
            // Add these for consistency
            Time: r.readyInMinutes || 0,
            popularity: r.aggregateLikes || 0,
          }));
        } else {
          // Fetch from your backend
          const response = await this.axios.get(
            `${this.$root.store.server_domain}/recipes/search`,
            {
              params: {
                query: this.searchQuery,
                number: this.numberOfRecipes,
                diet: this.diet,
                intolerance: this.intolerance,
                cuisine: this.cuisine,
                includePersonal: true, // Include personal recipes in search
              },
              withCredentials: true,
            }
          );

          this.recipes = response.data.map((r) => ({
            id: r.id,
            title: r.title,
            image: r.image,
            readyInMinutes: r.Time || r.readyInMinutes || 0,
            aggregateLikes: r.popularity || r.aggregateLikes || 0,
            // Keep both field names for compatibility
            Time: r.Time || r.readyInMinutes || 0,
            popularity: r.popularity || r.aggregateLikes || 0,
            // Add other fields that might be needed
            vegan: r.vegan,
            vegetarian: r.vegetarian,
            glutenFree: r.glutenFree,
            isFavorite: r.isFavorite || false,
            isWatched: r.isWatched || false,
          }));
        }
      } catch (err) {
        this.$root.toast(
          "Search Error",
          "Failed to load recipes. Please try again.",
          "danger"
        );
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async checkLoginStatus() {
      try {
        const response = await this.axios.get(
          `${this.$root.store.server_domain}/users/isLoggedIn`,
          { withCredentials: true }
        );
        return response.data.loggedIn;
      } catch (err) {
        return false;
      }
    },

    quickSearch(term) {
      this.searchQuery = term;
      this.searchRecipes();
    },

    clearSearch() {
      this.searchQuery = "";
      this.recipes = [];
      this.searchedOnce = false;
      this.diet = "";
      this.intolerance = "";
      this.cuisine = "";
      this.sortBy = "";
      this.numberOfRecipes = 5;
      this.showAdvanced = false;
    }
  }
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

/* Search Header */
.search-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0 40px;
  position: relative;
  overflow: hidden;
}

.search-header::before {
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

/* Search Form */
.search-container {
  max-width: 1200px;
  margin: -20px auto 40px;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.search-form-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.main-search {
  margin-bottom: 30px;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.search-input-group:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  color: #9ca3af;
  font-size: 1.2rem;
  margin-left: 20px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 18px 20px;
  font-size: 1.1rem;
  outline: none;
  color: #374151;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 18px 24px;
  margin: 4px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Filters */
.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group.full-width {
  grid-column: 1 / -1;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label i {
  color: #667eea;
  width: 16px;
}

.filter-select,
.filter-input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Advanced Filters */
.advanced-filters {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.advanced-toggle {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  transition: color 0.3s ease;
}

.advanced-toggle:hover {
  color: #5a67d8;
}

.advanced-toggle .fa-chevron-down {
  transition: transform 0.3s ease;
}

.advanced-toggle .fa-chevron-down.rotated {
  transform: rotate(180deg);
}

.advanced-content {
  margin-top: 20px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Results */
.results-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

.results-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
}

.results-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-term {
  color: #667eea;
  font-weight: 600;
}

.clear-btn {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.clear-btn:hover {
  background: #edf2f7;
  transform: translateY(-1px);
}

.recipes-grid {
  padding: 30px;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 80px 20px;
  color: #718096;
}

.no-results-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: #a0aec0;
}

.no-results h3 {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 10px;
}

.suggestions {
  margin-top: 30px;
}

.suggestions-title,
.popular-title {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 15px;
}

.suggestion-tags,
.popular-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.suggestion-tag,
.popular-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.popular-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
}

.suggestion-tag:hover,
.popular-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* Welcome State */
.welcome-state {
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
}

.welcome-content {
  color: #718096;
}

.welcome-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 3rem;
  color: white;
}

.welcome-content h3 {
  font-size: 2rem;
  color: #4a5568;
  margin-bottom: 15px;
  font-weight: 600;
}

.welcome-content p {
  font-size: 1.1rem;
  margin-bottom: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.popular-searches {
  margin-top: 40px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
  
  .search-form-card {
    padding: 20px;
  }
  
  .filters-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .suggestion-tags,
  .popular-tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .search-header {
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
  
  .search-input {
    font-size: 1rem;
    padding: 16px;
  }
  
  .search-btn {
    padding: 16px 20px;
  }
}
</style>