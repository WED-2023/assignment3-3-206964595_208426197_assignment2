<template>
  <div class="container mt-4">
    <div v-if="recipe">
      <!-- Recipe Header -->
      <h1>{{ recipe.title }}</h1>
      <img v-if="recipe.image" :src="recipe.image" class="recipe-image" />

      <!-- Buttons -->
      <div class="actions mt-3 mb-3">
        <button class="btn btn-outline-danger me-2" @click="likeRecipe" :disabled="liked">
          ❤️ {{ liked ? 'Liked' : 'Like' }}
        </button>
      </div>

      <!-- Basic Info -->
      <div class="recipe-info">
        <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
        <p><strong>Likes:</strong> {{ recipe.aggregateLikes || recipe.popularity || 0 }}</p>
      </div>

      <!-- Recipe Content -->
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
    }
  },
  async created() {
    try {
      const response = await this.axios.get(
        `${this.$root.store.server_domain}/recipes/${this.$route.params.recipeId}`
      );
      this.recipe = response.data;

      this.liked = this.recipe.isWatched || false;

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
          `${this.$root.store.server_domain}/users/like/${this.recipe.id}`,
          {},
          { withCredentials: true }
        );
        this.liked = true;
        if (this.recipe.aggregateLikes !== undefined) {
          this.recipe.aggregateLikes += 1;
        } else if (this.recipe.popularity !== undefined) {
          this.recipe.popularity += 1;
        }
      } catch (err) {
        console.error('Error liking recipe:', err);
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

.actions button {
  min-width: 160px;
}

@media (max-width: 768px) {
  .recipe-content {
    flex-direction: column;
  }
}
</style>
