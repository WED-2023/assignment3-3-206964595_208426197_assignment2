<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Recipes</h2>

    <div class="row">
      <RecipePreview
        v-for="recipe in myRecipes"
        :key="recipe.id"
        :recipe="recipe"
        :is-favorite="false"
        :was-watched="watchedRecipes.includes(recipe.id)"
      />
    </div>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";
import { getMyRecipes, getLastWatchedRecipes } from "@/api/apiHelper";

export default {
  name: "MyRecipesPage",
  components: {
    RecipePreview,
  },
  data() {
    return {
      myRecipes: [],
      watchedRecipes: [],
    };
  },
  async created() {
    try {
      console.log("📦 Calling getMyRecipes...");
      const rawRecipes = await getMyRecipes();
      console.log("✅ My recipes received:", rawRecipes);

      console.log("👁 Calling getLastWatchedRecipes...");
      const watched = await getLastWatchedRecipes();
      console.log("✅ Watched recipes received:", watched);

      this.myRecipes = rawRecipes.map((recipe) => ({
        ...recipe,
        aggregateLikes: recipe.aggregateLikes || recipe.popularity || 0,
      }));

      this.watchedRecipes = watched.map((r) => r.id || r.recipe_id);
    } catch (err) {
      console.error("❌ Failed to load my recipes:", err);
    }
  },
};
</script>
