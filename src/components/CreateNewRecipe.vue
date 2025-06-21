<template>
  <div>
    <!-- Modal using Bootstrap 5 HTML structure -->
    <div class="modal fade" id="createRecipeModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Create New Recipe</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Your form fields here -->
            <input v-model="recipe.title" class="form-control mb-2" placeholder="Title" />
            <!-- Add more fields as needed -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateNewRecipe",
  data() {
    return {
      recipe: {
        title: "",
        image: "",
        readyInMinutes: 0,
        ingredients: [{ name: "", amount: 0, unit: "" }],
        instructions: "",
        vegan: false,
        vegetarian: false,
        glutenFree: false
      }
    };
  },
  methods: {
    addIngredient() {
      this.recipe.ingredients.push({ name: "", amount: 0, unit: "" });
    },
    async handleSubmit() {
      try {
        const response = await this.axios.post(
          this.$root.store.server_domain + "/users/my_recipes",
          this.recipe
        );
        if (response.status === 200) {
          this.$bvModal.hide("create-recipe-modal");
          this.$emit("recipeCreated");
        }
      } catch (err) {
        console.error("Error creating recipe:", err);
        alert("Failed to create recipe.");
      }
    }
  }
};
</script>

<style scoped>
.mb-1 {
  margin-bottom: 0.5rem;
}
</style>
