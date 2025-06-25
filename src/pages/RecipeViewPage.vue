<template>
  <div class="recipe-view-page">
    <div class="container">
      <div v-if="recipe" class="recipe-container">
        <!-- Recipe Header -->
        <div class="recipe-header">
          <div class="header-content">
            <h1 class="recipe-title">{{ recipe.title }}</h1>
            
            <!-- Recipe Meta Info -->
            <div class="recipe-meta">
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>{{ displayTime }} minutes</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-heart"></i>
                <span>{{ displayLikes }} likes</span>
              </div>
              <div v-if="recipe.servings" class="meta-item">
                <i class="fas fa-users"></i>
                <span>{{ recipe.servings }} servings</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="actions">
              <button 
                class="btn like-btn" 
                :class="{ 'liked': liked }"
                @click="likeRecipe" 
                :disabled="liked"
              >
                <i class="fas fa-heart"></i>
                {{ liked ? 'Liked' : 'Like Recipe' }}
              </button>
            </div>
          </div>

          <!-- Recipe Image -->
          <div class="image-container">
            <img 
              v-if="recipe.image" 
              :src="recipe.image" 
              :alt="recipe.title"
              class="recipe-image" 
            />
            <div v-else class="no-image">
              <i class="fas fa-utensils"></i>
              <span>No Image Available</span>
            </div>
          </div>
        </div>

        <!-- Dietary Information -->
        <div v-if="hasDietaryInfo" class="dietary-info">
          <h4 class="dietary-title">
            <i class="fas fa-leaf"></i>
            Dietary Information
          </h4>
          <div class="dietary-badges">
            <span v-if="recipe.vegan" class="dietary-badge">Vegan</span>
            <span v-if="recipe.vegetarian" class="dietary-badge">Vegetarian</span>
            <span v-if="recipe.glutenFree" class="dietary-badge">Gluten Free</span>
          </div>
        </div>

        <!-- Family Recipe Info -->
        <div v-if="recipe.recipeOwner || recipe.occasion" class="family-info">
          <h4 class="family-title">
            <i class="fas fa-heart"></i>
            Family Recipe Details
          </h4>
          <div class="family-details">
            <p v-if="recipe.recipeOwner">
              <strong>Recipe by:</strong> {{ recipe.recipeOwner }}
            </p>
            <p v-if="recipe.occasion">
              <strong>Traditional occasion:</strong> {{ recipe.occasion }}
            </p>
          </div>
        </div>

        <!-- Recipe Content -->
        <div class="recipe-content">
          <!-- Ingredients Section -->
          <div class="content-section ingredients-section">
            <h3 class="section-title">
              <i class="fas fa-list-ul"></i>
              Ingredients
            </h3>
            <div class="ingredients-list">
              <div 
                v-for="(ingredient, index) in displayIngredients" 
                :key="index"
                class="ingredient-item"
              >
                <i class="fas fa-check-circle"></i>
                <span>{{ ingredient }}</span>
              </div>
            </div>
          </div>

          <!-- Instructions Section -->
          <div class="content-section instructions-section">
            <h3 class="section-title">
              <i class="fas fa-list-ol"></i>
              Instructions
            </h3>
            <div class="instructions-content">
              <p v-if="displayInstructions">{{ displayInstructions }}</p>
              <p v-else class="no-instructions">No instructions provided.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="loading-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading delicious recipe...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null,
      liked: false
    };
  },
  computed: {
    displayTime() {
      if (!this.recipe) return 0;
      return this.recipe.readyInMinutes ||
             this.recipe.Time ||
             this.recipe.cookingTime ||
             this.recipe.preparationTime ||
             0;
    },
    
    displayLikes() {
      if (!this.recipe) return 0;
      return this.recipe.aggregateLikes ||
             this.recipe.popularity ||
             0;
    },

    displayIngredients() {
      if (!this.recipe) return [];

      // For Spoonacular recipes - check if extendedIngredients exists
      if (this.recipe.extendedIngredients && Array.isArray(this.recipe.extendedIngredients)) {
        return this.recipe.extendedIngredients.map(ing => ing.original);
      }

      // For Personal/Family recipes - check if ingredients exists
      if (this.recipe.ingredients) {
        let ingredients = this.recipe.ingredients;
        
        // If it's a JSON string, parse it
        if (typeof ingredients === 'string') {
          try {
            ingredients = JSON.parse(ingredients);
          } catch (e) {
            console.error('Failed to parse ingredients:', e);
            // If parsing fails, treat it as a single ingredient
            return [this.recipe.ingredients];
          }
        }
        
        // If it's an array
        if (Array.isArray(ingredients)) {
          return ingredients.map(ing => {
            if (typeof ing === 'string') {
              return ing;
            }
            // Handle object format {name, amount, unit}
            if (ing.name) {
              return `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim();
            }
            return String(ing);
          });
        }
        
        // If it's neither array nor string, convert to string
        return [String(ingredients)];
      }

      return [];
    },

    displayInstructions() {
      if (!this.recipe) return '';

      // For Spoonacular recipes - check analyzedInstructions
      if (this.recipe.analyzedInstructions && Array.isArray(this.recipe.analyzedInstructions) && this.recipe.analyzedInstructions.length > 0) {
        return this.recipe.analyzedInstructions
          .map(section => section.steps || [])
          .flat()
          .map((step, index) => `${index + 1}. ${step.step}`)
          .join('\n\n');
      }

      // For Personal/Family recipes - plain text instructions
      if (this.recipe.instructions) {
        return this.recipe.instructions;
      }

      return '';
    },

    hasDietaryInfo() {
      return this.recipe && (this.recipe.vegan || this.recipe.vegetarian || this.recipe.glutenFree);
    }
  },
  async created() {
    try {
      const response = await this.axios.get(
        `${this.$root.store.server_domain}/recipes/${this.$route.params.recipeId}`,
        { withCredentials: true }
      );
      this.recipe = response.data;
      
      // Check localStorage to see if user has already liked this recipe
      const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
      this.liked = likedRecipes.includes(this.recipe.id);
      
      await this.markAsWatched();
    } catch (error) {
      console.error(error);
      this.$router.push('/NotFound');
    }
  },
  methods: {
    async markAsWatched() {
      if (!this.$root.store.username) return;
      try {
        await this.axios.post(
          `${this.$root.store.server_domain}/users/markwatched/${this.recipe.id}`,
          {},
          { withCredentials: true }
        );
        console.log('Recipe marked as watched');
      } catch (error) {
        console.error('Error marking as watched:', error);
      }
    },

    async likeRecipe() {
      if (!this.$root.store.username) {
        this.$router.push('/Login');
        return;
      }

      if (this.liked) {
        return; // Already liked, do nothing
      }

      try {
        const response = await this.axios.post(
          `${this.$root.store.server_domain}/recipes/${this.recipe.id}/like`,
          {},
          { withCredentials: true }
        );
        
        // Update local state - set to true and never reset
        this.liked = true;
        
        // Store in localStorage so it persists across page refreshes
        const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
        if (!likedRecipes.includes(this.recipe.id)) {
          likedRecipes.push(this.recipe.id);
          localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
        }
        
        // Update popularity from server response if available, otherwise increment locally
        if (response.data && response.data.popularity !== undefined) {
          this.recipe.popularity = response.data.popularity;
          this.recipe.aggregateLikes = response.data.popularity; // Keep both in sync
        } else {
          // Increment both popularity and aggregateLikes to keep them consistent
          const currentLikes = this.recipe.popularity || this.recipe.aggregateLikes || 0;
          this.recipe.popularity = currentLikes + 1;
          this.recipe.aggregateLikes = currentLikes + 1;
        }
        
        console.log('Recipe liked successfully. New popularity:', this.displayLikes);
        
      } catch (err) {
        console.error('Error liking recipe:', err);
        if (err.response?.status === 409) {
          // If server says already liked, mark as liked locally too
          this.liked = true;
          const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
          if (!likedRecipes.includes(this.recipe.id)) {
            likedRecipes.push(this.recipe.id);
            localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
          }
        } else {
          alert('Failed to like recipe. Please try again.');
        }
      }
    }
  }
};
</script>

<style scoped>
.recipe-view-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
}

.recipe-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

/* Recipe Header */
.recipe-header {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recipe-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.recipe-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #4b5563;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.meta-item i {
  color: #6b7280;
  font-size: 0.9rem;
}

.actions {
  margin-top: auto;
}

.like-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border: none;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.like-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

.like-btn.liked {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.like-btn:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

/* Image Container */
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.no-image {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border: 2px dashed #d1d5db;
}

.no-image i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Dietary Info */
.dietary-info {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-top: 1px solid #e2e8f0;
}

.dietary-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 1rem;
}

.dietary-title i {
  color: #10b981;
}

.dietary-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dietary-badge {
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Family Info */
.family-info {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
  border-top: 1px solid #e2e8f0;
}

.family-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #6b21a8;
  margin-bottom: 1rem;
}

.family-title i {
  color: #8b5cf6;
}

.family-details p {
  margin: 0.5rem 0;
  color: #6b21a8;
  font-weight: 500;
}

.family-details strong {
  color: #581c87;
}

/* Recipe Content */
.recipe-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.content-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-title i {
  color: #6b7280;
}

/* Ingredients */
.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ingredient-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.ingredient-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ingredient-item i {
  color: #10b981;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.ingredient-item span {
  color: #374151;
  font-weight: 500;
  line-height: 1.5;
}

/* Instructions */
.instructions-content {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  line-height: 1.7;
  color: #374151;
}

.instructions-content p {
  margin: 0;
  font-size: 1rem;
}

.no-instructions {
  color: #9ca3af;
  font-style: italic;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 500;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .recipe-view-page {
    padding: 1rem 0;
  }

  .recipe-header {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .recipe-title {
    font-size: 2rem;
  }

  .recipe-meta {
    gap: 1rem;
  }

  .meta-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .recipe-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .content-section {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .dietary-info,
  .family-info {
    padding: 1rem 1.5rem;
  }

  .like-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .recipe-header {
    padding: 1rem;
  }

  .recipe-title {
    font-size: 1.75rem;
  }

  .recipe-content {
    padding: 1rem;
  }

  .meta-item {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }
}
</style>