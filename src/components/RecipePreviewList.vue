<template>
  <b-container>
    <div class="recipe-list-vertical">
      <RecipePreview
        v-for="r in displayRecipes"
        :key="r.id"
        :recipe="r"
      />
    </div>
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
      if (this.recipes && this.recipes.length > 0) {
        return this.recipes;
      }
      return this.randomRecipes;
    }
  },
  mounted() {
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
              //apikey idan:'8ff080815b204f66a9641b65189504ee'
              //apiKey yuval:'af93fe3fb3e94d16a993328500f9cce5'
              apiKey: 'af93fe3fb3e94d16a993328500f9cce5'


            
            }
          }
        );

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
      } catch (error) {
        console.log("Error fetching random recipes:", error);
      }
    }
  }
};
</script>

<style scoped>
.recipe-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
