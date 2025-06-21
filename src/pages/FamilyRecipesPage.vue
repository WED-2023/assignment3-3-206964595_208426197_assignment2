<template>
  <div class="container mt-4">
    <h2 class="mb-4">Family Recipes</h2>

    <div class="row">
      <RecipePreview
        v-for="recipe in familyRecipes"
        :key="recipe.id"
        :recipe="recipe"
        :is-favorite="false"
        :was-watched="false"
      />
    </div>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";
import { getFamilyRecipes } from "@/api/apiHelper";

export default {
  name: "FamilyRecipesPage",
  components: {
    RecipePreview,
  },
  data() {
    return {
      familyRecipes: [],
    };
  },
  async created() {
    try {
      const data = await getFamilyRecipes();
      this.familyRecipes = data;
    } catch (err) {
      console.error("Failed to load family recipes:", err);
    }
  },
};
</script>
