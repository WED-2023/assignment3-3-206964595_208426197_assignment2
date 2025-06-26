<template>
  <div class="search-page">
    <div class="search-container">
      <!-- Search Header -->
      <div class="search-header">
        <h1 class="search-title">
          <i class="fas fa-search"></i>
          Discover Recipes
        </h1>
        <p class="search-subtitle">Find the perfect recipe for any occasion</p>
      </div>

      <!-- Search Form -->
      <div class="search-form-card">
        <form @submit.prevent="searchRecipes" class="search-form">
          <!-- Main Search Input -->
          <div class="search-input-group">
            <div class="input-with-icon">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control search-input"
                placeholder="Search for recipes... (e.g., chicken pasta, chocolate cake)"
                required
              />
            </div>
          </div>

          <!-- Filters Row -->
          <div class="filters-row">
            <!-- Number of Results -->
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-list-ol"></i>
                Results
              </label>
              <select v-model="numberOfResults" class="form-select filter-select">
                <option value="5">5 recipes</option>
                <option value="10">10 recipes</option>
                <option value="15">15 recipes</option>
              </select>
            </div>

            <!-- Cuisine Filter -->
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-globe"></i>
                Cuisine
              </label>
              <select v-model="selectedCuisine" class="form-select filter-select">
                <option value="">Any Cuisine</option>
                <option value="african">African</option>
                <option value="asian">Asian</option>
                <option value="american">American</option>
                <option value="british">British</option>
                <option value="cajun">Cajun</option>
                <option value="caribbean">Caribbean</option>
                <option value="chinese">Chinese</option>
                <option value="eastern european">Eastern European</option>
                <option value="european">European</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="greek">Greek</option>
                <option value="indian">Indian</option>
                <option value="irish">Irish</option>
                <option value="italian">Italian</option>
                <option value="japanese">Japanese</option>
                <option value="jewish">Jewish</option>
                <option value="korean">Korean</option>
                <option value="latin american">Latin American</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="mexican">Mexican</option>
                <option value="middle eastern">Middle Eastern</option>
                <option value="nordic">Nordic</option>
                <option value="southern">Southern</option>
                <option value="spanish">Spanish</option>
                <option value="thai">Thai</option>
                <option value="vietnamese">Vietnamese</option>
              </select>
            </div>

            <!-- Diet Filter -->
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-leaf"></i>
                Diet
              </label>
              <select v-model="selectedDiet" class="form-select filter-select">
                <option value="">Any Diet</option>
                <option value="gluten free">Gluten Free</option>
                <option value="ketogenic">Ketogenic</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="lacto-vegetarian">Lacto-Vegetarian</option>
                <option value="ovo-vegetarian">Ovo-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescetarian">Pescetarian</option>
                <option value="paleo">Paleo</option>
                <option value="primal">Primal</option>
                <option value="low fodmap">Low FODMAP</option>
                <option value="whole30">Whole30</option>
              </select>
            </div>

            <!-- Intolerance Filter -->
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-exclamation-triangle"></i>
                Intolerances
              </label>
              <select v-model="selectedIntolerance" class="form-select filter-select">
                <option value="">No Restrictions</option>
                <option value="dairy">Dairy Free</option>
                <option value="egg">Egg Free</option>
                <option value="gluten">Gluten Free</option>
                <option value="grain">Grain Free</option>
                <option value="peanut">Peanut Free</option>
                <option value="seafood">Seafood Free</option>
                <option value="sesame">Sesame Free</option>
                <option value="shellfish">Shellfish Free</option>
                <option value="soy">Soy Free</option>
                <option value="sulfite">Sulfite Free</option>
                <option value="tree nut">Tree Nut Free</option>
                <option value="wheat">Wheat Free</option>
              </select>
            </div>
          </div>

          <!-- Search Button -->
          <div class="search-button-container">
            <button 
              type="submit" 
              class="btn search-btn"
              :disabled="isLoading || !searchQuery.trim()"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-search me-2"></i>
              {{ isLoading ? 'Searching...' : 'Find Recipes' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="active-filters">
        <h6 class="filters-title">Active Filters:</h6>
        <div class="filter-tags">
          <span v-if="selectedCuisine" class="filter-tag cuisine-tag">
            <i class="fas fa-globe"></i>
            {{ selectedCuisine }}
            <button @click="selectedCuisine = ''" class="tag-remove">×</button>
          </span>
          <span v-if="selectedDiet" class="filter-tag diet-tag">
            <i class="fas fa-leaf"></i>
            {{ selectedDiet }}
            <button @click="selectedDiet = ''" class="tag-remove">×</button>
          </span>
          <span v-if="selectedIntolerance" class="filter-tag intolerance-tag">
            <i class="fas fa-exclamation-triangle"></i>
            {{ selectedIntolerance }} Free
            <button @click="selectedIntolerance = ''" class="tag-remove">×</button>
          </span>
          <button @click="clearAllFilters" class="clear-all-btn">
            <i class="fas fa-times"></i>
            Clear All
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div class="results-header">
          <h3 class="results-title">
            <i class="fas fa-utensils"></i>
            Found {{ searchResults.length }} Recipe{{ searchResults.length !== 1 ? 's' : '' }}
          </h3>
        </div>
        <div class="results-grid">
          <RecipePreview
            v-for="recipe in searchResults"
            :key="recipe.id"
            :recipe="recipe"
            :show-save-button="true"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="hasSearched && !isLoading" class="no-results">
        <div class="no-results-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>No recipes found</h3>
        <p>Try adjusting your search terms or filters</p>
        <button @click="clearAllFilters" class="btn btn-outline-primary">
          <i class="fas fa-refresh"></i>
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from '@/components/RecipePreview.vue';

export default {
  name: 'SearchPage',
  components: {
    RecipePreview
  },
  data() {
    return {
      searchQuery: '',
      numberOfResults: 10,
      selectedCuisine: '',
      selectedDiet: '',
      selectedIntolerance: '',
      searchResults: [],
      isLoading: false,
      hasSearched: false
    };
  },
  computed: {
    hasActiveFilters() {
      return this.selectedCuisine || this.selectedDiet || this.selectedIntolerance;
    }
  },
  methods: {
    async searchRecipes() {
      if (!this.searchQuery.trim()) return;

      this.isLoading = true;
      this.hasSearched = true;

      try {
        const params = {
          query: this.searchQuery.trim(),
          number: this.numberOfResults
        };

        if (this.selectedCuisine) params.cuisine = this.selectedCuisine;
        if (this.selectedDiet) params.diet = this.selectedDiet;
        if (this.selectedIntolerance) params.intolerance = this.selectedIntolerance;

        console.log('Search params:', params);

        const response = await this.axios.get(
          `${this.$root.store.server_domain}/recipes/search`,
          { 
            params,
            withCredentials: true 
          }
        );

        this.searchResults = response.data || [];
        console.log('Search results:', this.searchResults);

      } catch (error) {
        console.error('Search failed:', error);
        this.searchResults = [];
        
        if (error.response?.status === 204) {
          // No results found - this is normal
        } else {
          this.$root.toast('Error', 'Failed to search recipes. Please try again.', 'danger');
        }
      } finally {
        this.isLoading = false;
      }
    },

    clearAllFilters() {
      this.selectedCuisine = '';
      this.selectedDiet = '';
      this.selectedIntolerance = '';
    }
  }
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

.search-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Search Header */
.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 15px;
  font-family: 'Playfair Display', Georgia, serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.search-title i {
  color: #667eea;
  font-size: 2.5rem;
}

.search-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

/* Search Form Card */
.search-form-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin-bottom: 30px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Search Input */
.search-input-group {
  position: relative;
}

.input-with-icon {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.2rem;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 20px 20px 20px 60px;
  border: 2px solid #e5e7eb;
  border-radius: 15px;
  font-size: 1.1rem;
  background: #fafbfc;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.search-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.search-input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* Filters Row */
.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-label i {
  color: #667eea;
  font-size: 0.8rem;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #fafbfc;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.filter-select:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.15);
}

/* Search Button */
.search-button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  min-width: 200px;
  font-family: 'Inter', sans-serif;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.search-btn:disabled {
  opacity: 0.7;
  transform: none;
  cursor: not-allowed;
}

/* Active Filters */
.active-filters {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #e0f2fe;
}

.filters-title {
  color: #1e40af;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.filter-tag {
  background: white;
  color: #374151;
  padding: 8px 15px;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-tag i {
  font-size: 0.8rem;
}

.cuisine-tag { border-left: 4px solid #f59e0b; }
.diet-tag { border-left: 4px solid #10b981; }
.intolerance-tag { border-left: 4px solid #ef4444; }

.tag-remove {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  transition: color 0.2s ease;
}

.tag-remove:hover {
  color: #ef4444;
}

.clear-all-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.clear-all-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Search Results */
.search-results {
  margin-top: 40px;
}

.results-header {
  margin-bottom: 30px;
}

.results-title {
  color: #1f2937;
  font-weight: 700;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
}

.results-title i {
  color: #667eea;
  font-size: 1.5rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.no-results-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 3rem;
  color: #9ca3af;
}

.no-results h3 {
  font-size: 1.8rem;
  color: #374151;
  margin-bottom: 15px;
  font-weight: 600;
  font-family: 'Playfair Display', Georgia, serif;
}

.no-results p {
  margin-bottom: 30px;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-container {
    padding: 20px 15px;
  }

  .search-title {
    font-size: 2.2rem;
    flex-direction: column;
    gap: 10px;
  }

  .search-form-card {
    padding: 25px;
  }

  .filters-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .search-input {
    padding: 16px 16px 16px 50px;
    font-size: 1rem;
  }

  .search-icon {
    left: 16px;
    font-size: 1rem;
  }

  .search-btn {
    padding: 15px 30px;
    font-size: 1rem;
    min-width: auto;
    width: 100%;
  }

  .results-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .filter-tags {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-tag,
  .clear-all-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .search-title {
    font-size: 1.8rem;
  }

  .search-subtitle {
    font-size: 1rem;
  }

  .search-form-card {
    padding: 20px;
  }

  .no-results-icon {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
}

/* Animation for results */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-results {
  animation: fadeInUp 0.5s ease-out;
}

/* Loading state */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>