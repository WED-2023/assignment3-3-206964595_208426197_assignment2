<template>
  <div class="container mt-4">
    <div v-if="recipe">
      <!-- Recipe Header -->
      <h1>{{ recipe.title }}</h1>
      <img v-if="recipe.image" :src="recipe.image" class="recipe-image" />
      
      <!-- Basic Info -->
      <div class="recipe-info">
        <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
        <p><strong>Likes:</strong> {{ recipe.aggregateLikes || recipe.popularity || 0 }}</p>
      </div>

      <div class="recipe-content">
        <!-- Ingredients -->
        <div class="section">
          <h3>Ingredients:</h3>
          <ul>
            <li v-for="ingredient in displayIngredients" :key="ingredient">
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <!-- Instructions -->
        <div class="section">
          <h3>Instructions:</h3>
          <div v-if="displayInstructions">
            {{ displayInstructions }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null
    };
  },
  computed: {
    displayIngredients() {
      if (!this.recipe) return [];
      
      // Spoonacular format
      if (this.recipe.extendedIngredients) {
        return this.recipe.extendedIngredients.map(ing => ing.original);
      }
      
      // Custom format
      if (this.recipe.ingredients) {
        return this.recipe.ingredients.map(ing => {
          return `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim();
        });
      }
      
      return [];
    },
    
    displayInstructions() {
      if (!this.recipe) return '';
      
      // Spoonacular format
      if (this.recipe.analyzedInstructions && this.recipe.analyzedInstructions.length) {
        const steps = this.recipe.analyzedInstructions
          .map(section => section.steps || [])
          .flat()
          .map(step => step.step)
          .join(' ');
        return steps;
      }
      
      // Custom format
      return this.recipe.instructions || '';
    }
  },
  async created() {
    try {
      const response = await this.axios.get(
        `${this.$root.store.server_domain}/recipes/${this.$route.params.recipeId}`
      );
      this.recipe = response.data;
      
      // Mark as watched when user views the recipe
      await this.markAsWatched();
    } catch (error) {
      console.error(error);
      this.$router.push('/NotFound');
    }
  },
  methods: {
    async markAsWatched() {
      // Only mark as watched if user is logged in
      if (!this.$root.store.username) {
        return;
      }
      
      try {
        await this.axios.post(
          `${this.$root.store.server_domain}/users/markwatched/${this.recipe.id}`,
          {},
          { withCredentials: true }
        );
        console.log('Recipe marked as watched');
      } catch (error) {
        console.error('Error marking recipe as watched:', error);
        // Don't show error to user, this is background functionality
      }
    }
  }
};
</script>

<style scoped>
.recipe-image {
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
}

.recipe-info {
  background: #f5f5f5;
  padding: 15px;
  margin: 20px 0;
}

.recipe-content {
  display: flex;
  gap: 30px;
}

.section {
  flex: 1;
}

.section h3 {
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

@media (max-width: 768px) {
  .recipe-content {
    flex-direction: column;
  }
}
</style>