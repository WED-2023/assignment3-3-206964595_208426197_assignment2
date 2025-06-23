<template>
  <div class="recipe-card">
    <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }" class="recipe-card-link">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="recipe-image"
        :alt="recipe.title"
      />
      <div class="recipe-content">
        <h4>{{ recipe.title }}</h4>
        <p>{{ displayTime }} minutes</p>
        <p>{{ displayLikes }} likes</p>
      </div>
    </router-link>

    <div class="text-center mt-2">
      <button
        v-if="showSaveButton"
        @click.stop="saveToFavorites"
        :disabled="favorited"
        class="btn btn-sm btn-outline-primary"
      >
        ⭐ {{ favorited ? "Saved" : "Save to Favorites" }}
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
      favorited: false,
    };
  },
  computed: {
    displayTime() {
      return this.recipe.readyInMinutes ??
             this.recipe.cookingTime ??
             this.recipe.preparationTime ??
             0;
    },
    displayLikes() {
      return Number.isFinite(this.recipe.aggregateLikes)
        ? this.recipe.aggregateLikes
        : (this.recipe.popularity || 0);
    }
  },
  methods: {
    async saveToFavorites() {
      if (!this.$root.store.username) {
        this.$router.push('/Login');
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
      }
    },
  },
};
</script>

<style scoped>
.recipe-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.recipe-card {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: scale(1.02);
}

.recipe-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}
</style>
