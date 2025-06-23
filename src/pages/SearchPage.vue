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
        <b-form-select
          id="number"
          v-model.number="numberOfRecipes"
          :options="[5, 10, 15]"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Diet Type" label-for="diet">
        <b-form-select
          id="diet"
          v-model="diet"
          :options="['', 'vegetarian', 'vegan', 'glutenFree']"
          placeholder="Select diet type"
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Intolerance (comma-separated)" label-for="intolerance">
        <b-form-input
          id="intolerance"
          v-model="intolerance"
          placeholder="e.g., peanuts, gluten"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Cuisine" label-for="cuisine">
        <b-form-select
          id="cuisine"
          v-model="cuisine"
          :options="['', 'Italian', 'Mexican', 'Indian', 'Chinese', 'French']"
          placeholder="Select cuisine"
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Sort By" label-for="sortBy">
        <b-form-select
          id="sortBy"
          v-model="sortBy"
          :options="['', 'time', 'popularity']"
          placeholder="Select sort criteria"
        ></b-form-select>
      </b-form-group>

      <b-button variant="primary" type="submit">Search</b-button>
    </b-form>

    <div v-if="recipes.length > 0" class="mt-5">
      <h4>Results:</h4>
      <RecipePreviewList :recipes="sortedRecipes" />
    </div>

    <div v-else-if="searchedOnce" class="mt-4 text-danger">
      <p>No recipes found for your search.</p>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from '../components/RecipePreviewList.vue';

export default {
  name: "SearchRecipesPage",
  components: {
    RecipePreviewList
  },
  data() {
    return {
      searchQuery: "",
      numberOfRecipes: 5,
      recipes: [],
      diet: "",
      intolerance: "",
      cuisine: "",
      sortBy: "",
      searchedOnce: false,
    };
  },
  computed: {
    sortedRecipes() {
      if (this.sortBy === "time") {
        return [...this.recipes].sort((a, b) => a.readyInMinutes - b.readyInMinutes);
      } else if (this.sortBy === "popularity") {
        return [...this.recipes].sort((a, b) => b.aggregateLikes - a.aggregateLikes);
      }
      return this.recipes;
    },
  },
  methods: {
    async searchRecipes() {
      try {
        this.searchedOnce = true;
        const isLoggedIn = await this.checkLoginStatus();

        if (!isLoggedIn) {
          // Fetch from Spoonacular directly
          const response = await this.axios.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            {
              params: {
                query: this.searchQuery,
                number: this.numberOfRecipes,
                diet: this.diet,
                intolerances: this.intolerance,
                cuisine: this.cuisine,
                addRecipeInformation: true,  // This adds readyInMinutes and aggregateLikes!
                apiKey: "af93fe3fb3e94d16a993328500f9cce5",
              },
            }
          );

          console.log('Spoonacular response:', response.data.results[0]); // Debug log

          // Normalize Spoonacular data to match RecipePreview expectations
          this.recipes = response.data.results.map((r) => ({
            id: r.id,
            title: r.title,
            image: r.image,
            readyInMinutes: r.readyInMinutes || 0,
            aggregateLikes: r.aggregateLikes || 0,
          }));
        } else {
          // Fetch from your backend
          const response = await this.axios.get(
            `${this.$root.store.server_domain}/recipes/search`,
            {
              params: {
                query: this.searchQuery,
                number: this.numberOfRecipes,
                diet: this.diet,
                intolerance: this.intolerance,
                cuisine: this.cuisine,
                sortBy: this.sortBy,
              },
              withCredentials: true,
            }
          );

          // Normalize backend data to match RecipePreview expectations
          this.recipes = response.data.map((r) => ({
            id: r.id,
            title: r.title,
            image: r.image,
            readyInMinutes: r.Time || r.readyInMinutes || 0,  // Fixed: normalize field names
            aggregateLikes: r.popularity || r.aggregateLikes || 0,  // Fixed: normalize field names
          }));
        }
      } catch (err) {
        this.$root.toast(
          "Search Error",
          "Failed to load recipes. Please try again.",
          "danger"
        );
        console.error(err);
      }
    },

    async checkLoginStatus() {
      try {
        const response = await this.axios.get(
          `${this.$root.store.server_domain}/users/isLoggedIn`,
          { withCredentials: true }
        );
        return response.data.loggedIn;
      } catch (err) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
/* Optional styling improvements */
</style>