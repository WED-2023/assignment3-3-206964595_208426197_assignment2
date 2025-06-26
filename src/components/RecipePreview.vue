<template>
  <div class="recipe-card">
    <div v-if="watched" class="watched-indicator">
      <i class="fas fa-eye"></i> Watched
    </div>
    
    <!-- Dietary Badges -->
    <div v-if="hasDietaryInfo" class="dietary-badges">
      <span v-if="recipe.vegan" class="dietary-badge vegan">
        <i class="fas fa-leaf"></i> Vegan
      </span>
      <span v-else-if="recipe.vegetarian" class="dietary-badge vegetarian">
        <i class="fas fa-seedling"></i> Vegetarian
      </span>
      <span v-if="recipe.glutenFree" class="dietary-badge gluten-free">
        <i class="fas fa-wheat"></i> Gluten Free
      </span>
    </div>
    
    <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }" class="recipe-card-link">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="recipe-image"
        :alt="recipe.title"
      />
      <div class="recipe-content">
        <h4>{{ recipe.title }}</h4>
        <p><i class="fas fa-clock"></i> {{ displayTime }} minutes</p>
        <p><i class="fas fa-heart"></i> {{ displayLikes }} likes</p>
      </div>
    </router-link>
    <div class="text-center mt-2">
      <button
        v-if="showSaveButton"
        @click.stop="saveToFavorites"
        :disabled="favorited"
        class="btn btn-sm btn-outline-primary"
      >
        ⭐ {{ favorited ? "Saved" : "Save" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      favorited: this.recipe.isFavorite || false,
      watched: this.recipe.isWatched || this.recipe.watched || false
    };
  },
  computed: {
    displayTime() {
      return this.recipe.readyInMinutes ||
             this.recipe.Time ||
             this.recipe.cookingTime ||
             this.recipe.preparationTime ||
             0;
    },
    displayLikes() {
      return this.recipe.aggregateLikes ||
             this.recipe.popularity ||
             0;
    },
    hasDietaryInfo() {
      return this.recipe.vegan || this.recipe.vegetarian || this.recipe.glutenFree;
    }
  },
  methods: {
    async saveToFavorites() {
      if (!this.$root.store.username) {
        this.$router.push('/login');
        return;
      }
      try {
        await this.axios.post(
          `${this.$root.store.server_domain}/users/favorites`,
          { recipeId: this.recipe.id },
          { withCredentials: true }
        );
        this.favorited = true;
      } catch (err) {
        console.error('Error saving to favorites:', err);
        alert('Failed to save to favorites');
      }
    },
  },
};
</script>

<style scoped>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

.recipe-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.recipe-card {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.recipe-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.recipe-content h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.recipe-content p {
  color: #666;
  margin-bottom: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  line-height: 1.4;
}

.recipe-content p i {
  color: #999;
  font-size: 0.8rem;
}

.btn {
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.btn:hover {
  transform: translateY(-1px);
}

.watched-indicator {
  color: #777;
  font-size: 0.85rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.watched-indicator i {
  color: #555;
}

/* Dietary Badges Styles */
.dietary-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.dietary-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 1px solid;
  font-family: 'Inter', sans-serif;
}

.dietary-badge i {
  font-size: 0.7rem;
}

.dietary-badge.vegan {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-color: #059669;
}

.dietary-badge.vegetarian {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
  border-color: #10b981;
}

.dietary-badge.gluten-free {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-color: #d97706;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .dietary-badges {
    gap: 4px;
  }
  
  .dietary-badge {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
  
  .dietary-badge i {
    font-size: 0.65rem;
  }
}

/* Animation for badges */
.dietary-badge {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hover effects for badges */
.dietary-badge:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
</style>