<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Favorite Recipes</h2>

    <div class="row">
      <RecipePreview
        v-for="recipe in favoriteRecipes"
        :key="recipe.id"
        :recipe="recipe"
        :is-favorite="true"
        :was-watched="watchedRecipes.includes(recipe.id)"
      />
    </div>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";
import { getFavoriteRecipes, getLastWatchedRecipes } from "@/api/apiHelper";

export default {
  name: "MyFavoritesPage",
  components: {
    RecipePreview,
  },
  data() {
    return {
      favoriteRecipes: [],
      watchedRecipes: [],
    };
  },
  async created() {
    try {
      const rawFavorites = await getFavoriteRecipes();
      const watched = await getLastWatchedRecipes();

      this.favoriteRecipes = rawFavorites.map((recipe) => ({
        ...recipe,
        // התאמת שדה הפופולריות לשם שמצפה לו RecipePreview
        aggregateLikes: recipe.aggregateLikes || recipe.popularity || 0,
      }));

      this.watchedRecipes = watched.map((r) => r.id || r.recipe_id); // מותאם גם ל-Spoonacular וגם ל-DB
    } catch (err) {
      console.error("Failed to load favorites or watched recipes:", err);
    }
  },
};
</script>
