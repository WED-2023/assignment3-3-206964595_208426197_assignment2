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
                <span>{{ recipe.readyInMinutes }} minutes</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-heart"></i>
                <span>{{ recipe.popularity || 0 }} likes</span>
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
    displayIngredients() {
      if (!this.recipe) return [];

      if (this.recipe.extendedIngredients) {
        return this.recipe.extendedIngredients.map(ing => ing.original);
      }

      if (this.recipe.ingredients) {
        return this.recipe.ingredients.map(ing =>
          `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim()
        );
      }

      return [];
    },
    displayInstructions() {
      if (!this.recipe) return '';

      if (this.recipe.analyzedInstructions && this.recipe.analyzedInstructions.length) {
        return this.recipe.analyzedInstructions
          .map(section => section.steps || [])
          .flat()
          .map(step => step.step)
          .join(' ');
      }

      return this.recipe.instructions || '';
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
      this.liked = this.recipe.isLiked || false;
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

      try {
        await this.axios.post(
          `${this.$root.store.server_domain}/recipes/${this.recipe.id}/like`,
          {},
          { withCredentials: true }
        );
        
        this.liked = true;
        this.recipe.popularity = (this.recipe.popularity || 0) + 1;
        
      } catch (err) {
        console.error('Error liking recipe:', err);
        if (err.response?.status === 409) {
          alert('You already liked this recipe!');
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
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.like-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
  background: linear-gradient(135deg, #fef3f2 0%, #fecaca 100%);
  border-top: 1px solid #e2e8f0;
}

.family-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #7f1d1d;
  margin-bottom: 1rem;
}

.family-title i {
  color: #ef4444;
}

.family-details p {
  margin: 0.5rem 0;
  color: #7f1d1d;
  font-weight: 500;
}

.family-details strong {
  color: #991b1b;
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