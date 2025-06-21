<template>
  <div class="container mt-4">
    <h2 class="mb-4">Search Recipes</h2>

    <b-form @submit.prevent="searchRecipes">
      <b-form-group label="Search Query" label-for="query">
        <b-form-input
          id="query"
          v-model="searchQuery"
          placeholder="Enter keyword (e.g., pasta)"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Number of Recipes" label-for="number">
        <b-form-input
          id="number"
          type="number"
          v-model.number="numberOfRecipes"
          :min="1"
          :max="20"
          placeholder="Enter number"
        ></b-form-input>
      </b-form-group>

      <b-button variant="primary" type="submit">Search</b-button>
    </b-form>

    <div v-if="recipes.length > 0" class="mt-5">
      <h4>Results:</h4>
      <b-row>
        <b-col
          v-for="recipe in recipes"
          :key="recipe.id"
          cols="12"
          md="6"
          lg="4"
          class="mb-4"
        >
          <b-card
            :title="recipe.title"
            :img-src="recipe.image"
            img-alt="Recipe image"
            img-top
          >
            <p class="mb-1">
              <strong>Ready in:</strong> {{ recipe.time }} minutes
            </p>
            <p class="mb-1">
              <strong>Likes:</strong> {{ recipe.popularity }}
            </p>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchRecipesPage",
  data() {
    return {
      searchQuery: "",
      numberOfRecipes: 5,
      recipes: [],
    };
  },
  methods: {
    async searchRecipes() {
      try {
        const response = await this.axios.get(
          `http://localhost:3000/recipes/search`,
          {
            params: {
              query: this.searchQuery,
              number: this.numberOfRecipes,
            },
          }
        );

        // Format results
        this.recipes = response.data.map((r) => ({
          id: r.id,
          title: r.title,
          image: r.image,
          time: r.Time,
          popularity: r.popularity,
        }));
      } catch (err) {
        this.$root.toast(
          "Search Error",
          "Failed to load recipes. Please try again.",
          "danger"
        );
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
/* Optional styling improvements */
</style>
