<template>
  <b-container>
    <b-row>
      <b-col v-for="r in displayRecipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: false
    },
    recipes: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      randomRecipes: []
    };
  },
  computed: {
    displayRecipes() {
      // If recipes are passed as props, use them
      if (this.recipes && this.recipes.length > 0) {
        return this.recipes;
      }
      // Otherwise, use the random recipes we fetched
      return this.randomRecipes;
    }
  },
  mounted() {
    // Only fetch random recipes if no recipes were passed as props
    if (!this.recipes || this.recipes.length === 0) {
      this.updateRandomRecipes();
    }
  },
  methods: {
    async updateRandomRecipes() {
      try {
        const response = await this.axios.get(
          "https://api.spoonacular.com/recipes/random",
          {
            params: {
              limitLicense: true,
              number: 3,
              apiKey: '8ff080815b204f66a9641b65189504ee'
            }
          }
        );

        console.log("Random recipes response: ", response);
        const recipes = response.data.recipes.map((r) => {
          return {
            id: r.id,
            title: r.title,
            readyInMinutes: r.readyInMinutes,
            image: r.image,
            aggregateLikes: r.aggregateLikes
          };
        });
        
        this.randomRecipes = recipes;
        console.log("Random recipes: ", this.randomRecipes);
      } catch (error) {
        console.log("Error fetching random recipes:", error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>