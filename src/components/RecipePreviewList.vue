<template>
  <b-container>
    <b-row>
      <b-col v-for="r in recipes" :key="r.id">
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
      required: true
    }
  },
  data() {
    return {
      recipes: []
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
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

        console.log("response: ", response);
        const recipes = response.data.recipes.map((r) => {
          return {
            id: r.id,
            title: r.title,
            readyInMinutes: r.readyInMinutes,
            image: r.image,
            aggregateLikes: r.aggregateLikes
          };
        });
        this.recipes = [];
        this.recipes.push(...recipes);
        console.log("recipes:  " , this.recipes);
      } catch (error) {
        console.log(error);
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