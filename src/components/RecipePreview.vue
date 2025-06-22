<template>
  <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }" class="recipe-card-link">
    <div class="recipe-card">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="recipe-image"
        :alt="recipe.title"
      />
      <div class="recipe-content">
        <h4>{{ recipe.title }}</h4>
        <p>{{ recipe.readyInMinutes }} minutes</p>
        <p>{{ recipe.aggregateLikes }} likes</p>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
   methods: {
    goToRecipe() {
      this.$router.push(`/recipe/${this.recipe.id}`);
    }
  }
};
</script>

<style scoped>
.recipe-card-link {
  text-decoration: none;
  color: inherit;
}
.recipe-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.recipe-card:hover {
  transform: scale(1.02);
}
</style>
