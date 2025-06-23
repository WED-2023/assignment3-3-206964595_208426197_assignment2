<template>
  <div>
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs mb-4" id="recipeTypeTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button 
          :class="['nav-link', { active: activeTab === 'personal' }]"
          @click="switchTab('personal')"
          type="button"
        >
          <i class="fas fa-user me-2"></i>
          Personal Recipe
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button 
          :class="['nav-link', { active: activeTab === 'family' }]"
          @click="switchTab('family')"
          type="button"
        >
          <i class="fas fa-users me-2"></i>
          Family Recipe
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Personal Recipe Tab -->
      <div v-if="activeTab === 'personal'" class="tab-pane fade show active">
        <div class="recipe-form">
          <!-- Recipe Title -->
          <div class="mb-3">
            <label for="recipeTitle" class="form-label">Recipe Title *</label>
            <input 
              v-model="recipe.title" 
              id="recipeTitle"
              class="form-control" 
              placeholder="Enter recipe title" 
              required
            />
          </div>

          <!-- Image URL -->
          <div class="mb-3">
            <label for="recipeImage" class="form-label">Image URL</label>
            <input 
              v-model="recipe.image" 
              id="recipeImage"
              class="form-control" 
              placeholder="Enter image URL (optional)" 
            />
          </div>

          <!-- Ready in Minutes -->
          <div class="mb-3">
            <label for="readyInMinutes" class="form-label">Ready in Minutes</label>
            <input 
              v-model.number="recipe.readyInMinutes" 
              id="readyInMinutes"
              type="number"
              class="form-control" 
              placeholder="Cooking time in minutes" 
              min="1"
            />
          </div>

          <!-- Servings -->
          <div class="mb-3">
            <label for="servings" class="form-label">Servings</label>
            <input 
              v-model.number="recipe.servings" 
              id="servings"
              type="number"
              class="form-control" 
              placeholder="Number of servings" 
              min="1"
            />
          </div>

          <!-- Ingredients -->
          <div class="mb-3">
            <label class="form-label">Ingredients *</label>
            <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="mb-2">
              <div class="row">
                <div class="col-md-5">
                  <input 
                    v-model="ingredient.name" 
                    class="form-control" 
                    placeholder="Ingredient name" 
                    required
                  />
                </div>
                <div class="col-md-3">
                  <input 
                    v-model.number="ingredient.amount" 
                    type="number"
                    class="form-control" 
                    placeholder="Amount" 
                    step="0.1"
                    min="0"
                  />
                </div>
                <div class="col-md-3">
                  <input 
                    v-model="ingredient.unit" 
                    class="form-control" 
                    placeholder="Unit (cups, tsp, etc.)" 
                  />
                </div>
                <div class="col-md-1">
                  <button 
                    @click="removeIngredient(index)" 
                    class="btn btn-outline-danger btn-sm"
                    type="button"
                    :disabled="recipe.ingredients.length === 1"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <button @click="addIngredient" class="btn btn-outline-secondary btn-sm" type="button">
              + Add Ingredient
            </button>
          </div>

          <!-- Instructions -->
          <div class="mb-3">
            <label for="instructions" class="form-label">Instructions *</label>
            <textarea 
              v-model="recipe.instructions" 
              id="instructions"
              class="form-control" 
              rows="6"
              placeholder="Enter detailed cooking instructions..."
              required
            ></textarea>
          </div>

          <!-- Dietary Preferences -->
          <div class="mb-4">
            <label class="form-label">Dietary Information</label>
            <div class="row">
              <div class="col-md-4">
                <div class="form-check">
                  <input 
                    v-model="recipe.vegan" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="vegan"
                  />
                  <label class="form-check-label" for="vegan">
                    Vegan
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input 
                    v-model="recipe.vegetarian" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="vegetarian"
                  />
                  <label class="form-check-label" for="vegetarian">
                    Vegetarian
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input 
                    v-model="recipe.glutenFree" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="glutenFree"
                  />
                  <label class="form-check-label" for="glutenFree">
                    Gluten Free
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Recipe Tab -->
      <div v-if="activeTab === 'family'" class="tab-pane fade show active">
        <div class="recipe-form">
          <!-- Recipe Title -->
          <div class="mb-3">
            <label for="familyRecipeTitle" class="form-label">Recipe Title *</label>
            <input 
              v-model="recipe.title" 
              id="familyRecipeTitle"
              class="form-control" 
              placeholder="Enter recipe title" 
              required
            />
          </div>

          <!-- Who's Recipe -->
          <div class="mb-3">
            <label for="recipeOwner" class="form-label">Who's Recipe *</label>
            <input 
              v-model="recipe.recipeOwner" 
              id="recipeOwner"
              class="form-control" 
              placeholder="e.g., Grandma Sarah, Uncle Joe, Mom's friend Maria" 
              required
            />
          </div>

          <!-- When it's traditionally made -->
          <div class="mb-3">
            <label for="occasion" class="form-label">When it's traditionally made *</label>
            <input 
              v-model="recipe.occasion" 
              id="occasion"
              class="form-control" 
              placeholder="e.g., Christmas dinner, Sunday lunch, Birthday celebrations" 
              required
            />
          </div>

          <!-- Image URL -->
          <div class="mb-3">
            <label for="familyRecipeImage" class="form-label">Image URL</label>
            <input 
              v-model="recipe.image" 
              id="familyRecipeImage"
              class="form-control" 
              placeholder="Enter image URL (optional)" 
            />
          </div>

          <!-- Ready in Minutes -->
          <div class="mb-3">
            <label for="familyReadyInMinutes" class="form-label">Ready in Minutes</label>
            <input 
              v-model.number="recipe.readyInMinutes" 
              id="familyReadyInMinutes"
              type="number"
              class="form-control" 
              placeholder="Cooking time in minutes" 
              min="1"
            />
          </div>

          <!-- Servings -->
          <div class="mb-3">
            <label for="familyServings" class="form-label">Servings</label>
            <input 
              v-model.number="recipe.servings" 
              id="familyServings"
              type="number"
              class="form-control" 
              placeholder="Number of servings" 
              min="1"
            />
          </div>

          <!-- Ingredients -->
          <div class="mb-3">
            <label class="form-label">Ingredients *</label>
            <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="mb-2">
              <div class="row">
                <div class="col-md-5">
                  <input 
                    v-model="ingredient.name" 
                    class="form-control" 
                    placeholder="Ingredient name" 
                    required
                  />
                </div>
                <div class="col-md-3">
                  <input 
                    v-model.number="ingredient.amount" 
                    type="number"
                    class="form-control" 
                    placeholder="Amount" 
                    step="0.1"
                    min="0"
                  />
                </div>
                <div class="col-md-3">
                  <input 
                    v-model="ingredient.unit" 
                    class="form-control" 
                    placeholder="Unit (cups, tsp, etc.)" 
                  />
                </div>
                <div class="col-md-1">
                  <button 
                    @click="removeIngredient(index)" 
                    class="btn btn-outline-danger btn-sm"
                    type="button"
                    :disabled="recipe.ingredients.length === 1"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <button @click="addIngredient" class="btn btn-outline-secondary btn-sm" type="button">
              + Add Ingredient
            </button>
          </div>

          <!-- Instructions -->
          <div class="mb-3">
            <label for="familyInstructions" class="form-label">Instructions *</label>
            <textarea 
              v-model="recipe.instructions" 
              id="familyInstructions"
              class="form-control" 
              rows="6"
              placeholder="Enter detailed cooking instructions..."
              required
            ></textarea>
          </div>

          <!-- Dietary Preferences -->
          <div class="mb-4">
            <label class="form-label">Dietary Information</label>
            <div class="row">
              <div class="col-md-4">
                <div class="form-check">
                  <input 
                    v-model="recipe.vegan" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="familyVegan"
                  />
                  <label class="form-check-label" for="familyVegan">
                    Vegan
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input 
                    v-model="recipe.vegetarian" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="familyVegetarian"
                  />
                  <label class="form-check-label" for="familyVegetarian">
                    Vegetarian
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input 
                    v-model="recipe.glutenFree" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="familyGlutenFree"
                  />
                  <label class="form-check-label" for="familyGlutenFree">
                    Gluten Free
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button 
        type="button" 
        class="btn btn-secondary" 
        @click="resetForm"
      >
        Reset
      </button>
      <button 
        type="button" 
        class="btn btn-primary" 
        @click="handleSubmit"
        :disabled="!isFormValid || isSubmitting"
      >
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ isSubmitting ? 'Creating...' : `Create ${activeTab === 'family' ? 'Family' : 'Personal'} Recipe` }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateRecipe",
  emits: ['recipeCreated'],
  data() {
    return {
      activeTab: 'personal', // 'personal' or 'family'
      isSubmitting: false,
      recipe: {
        title: "",
        image: "",
        readyInMinutes: 30,
        servings: 4,
        ingredients: [{ name: "", amount: 1, unit: "" }],
        instructions: "",
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        // Family recipe specific fields
        recipeOwner: "",
        occasion: ""
      }
    };
  },
  computed: {
    isFormValid() {
      const baseValid = (
        this.recipe.title.trim() &&
        this.recipe.instructions.trim() &&
        this.recipe.ingredients.some(ing => ing.name.trim())
      );

      if (this.activeTab === 'family') {
        return baseValid && 
               this.recipe.recipeOwner.trim() && 
               this.recipe.occasion.trim();
      }

      return baseValid;
    }
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      // Clear family-specific fields when switching to personal
      if (tab === 'personal') {
        this.recipe.recipeOwner = "";
        this.recipe.occasion = "";
      }
    },
    addIngredient() {
      this.recipe.ingredients.push({ name: "", amount: 1, unit: "" });
    },
    removeIngredient(index) {
      if (this.recipe.ingredients.length > 1) {
        this.recipe.ingredients.splice(index, 1);
      }
    },
    async handleSubmit() {
      if (!this.isFormValid) {
        this.showValidationErrors();
        return;
      }

      this.isSubmitting = true;

      try {
        // Filter out empty ingredients
        const cleanedIngredients = this.recipe.ingredients.filter(
          ing => ing.name.trim()
        );

        let recipeData = {
          title: this.recipe.title.trim(),
          image: this.recipe.image,
          readyInMinutes: this.recipe.readyInMinutes,
          servings: this.recipe.servings,
          ingredients: cleanedIngredients,
          instructions: this.recipe.instructions.trim(),
          vegan: this.recipe.vegan,
          vegetarian: this.recipe.vegetarian,
          glutenFree: this.recipe.glutenFree
        };

        // Add family-specific fields if it's a family recipe
        if (this.activeTab === 'family') {
          recipeData.recipeOwner = this.recipe.recipeOwner.trim();
          recipeData.occasion = this.recipe.occasion.trim();
        }

        console.log('Submitting recipe:', recipeData);

        // Choose the correct endpoint based on recipe type
        const endpoint = this.activeTab === 'family' 
          ? "/users/family"
          : "/users/my_recipes";

        const response = await this.axios.post(
          this.$root.store.server_domain + endpoint,
          recipeData
        );
        
        if (response.status === 200 || response.status === 201) {
          this.$emit("recipeCreated");
          this.resetForm();
        } else {
          throw new Error('Unexpected response status');
        }
      } catch (err) {
        console.error("Error creating recipe:", err);
        
        let errorMessage = "Failed to create recipe. Please try again.";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(errorMessage);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.recipe = {
        title: "",
        image: "",
        readyInMinutes: 30,
        servings: 4,
        ingredients: [{ name: "", amount: 1, unit: "" }],
        instructions: "",
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        recipeOwner: "",
        occasion: ""
      };
      this.activeTab = 'personal';
    },
    showValidationErrors() {
      if (!this.recipe.title.trim()) {
        alert("Please enter a recipe title");
        return;
      }
      if (!this.recipe.instructions.trim()) {
        alert("Please enter cooking instructions");
        return;
      }
      if (!this.recipe.ingredients.some(ing => ing.name.trim())) {
        alert("Please add at least one ingredient");
        return;
      }
      if (this.activeTab === 'family') {
        if (!this.recipe.recipeOwner.trim()) {
          alert("Please enter who's recipe this is");
          return;
        }
        if (!this.recipe.occasion.trim()) {
          alert("Please enter when this recipe is traditionally made");
          return;
        }
      }
    }
  }
};
</script>

<style scoped>
.nav-tabs {
  border-bottom: 2px solid #dee2e6;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  background: none;
  color: #6c757d;
  font-weight: 500;
  padding: 1rem 1.5rem;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  border-color: transparent;
  color: #495057;
  background-color: #f8f9fa;
}

.nav-tabs .nav-link.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: transparent;
}

.tab-content {
  min-height: 400px;
}

.form-label {
  font-weight: 500;
  color: #495057;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:disabled {
  opacity: 0.6;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.form-check-label {
  font-size: 0.9rem;
}

.gap-2 {
  gap: 0.5rem;
}

/* Custom styling for ingredient rows */
.row .col-md-5 input,
.row .col-md-3 input {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .row .col-md-1,
  .row .col-md-3,
  .row .col-md-5 {
    margin-bottom: 0.5rem;
  }
  
  .nav-tabs .nav-link {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}

/* Family recipe specific styling */
.tab-pane {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>