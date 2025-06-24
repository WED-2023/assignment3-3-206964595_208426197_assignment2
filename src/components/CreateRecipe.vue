<template>
  <div class="create-recipe-enhanced">
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs enhanced-tabs mb-4" id="recipeTypeTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button 
          :class="['nav-link enhanced-tab', { active: activeTab === 'personal' }]"
          @click="switchTab('personal')"
          type="button"
        >
          <i class="fas fa-user me-2"></i>
          <span>Personal Recipe</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button 
          :class="['nav-link enhanced-tab', { active: activeTab === 'family' }]"
          @click="switchTab('family')"
          type="button"
        >
          <i class="fas fa-users me-2"></i>
          <span>Family Recipe</span>
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content enhanced-content">
      <!-- Personal Recipe Tab -->
      <div v-if="activeTab === 'personal'" class="tab-pane fade show active">
        <div class="recipe-form">
          <!-- Recipe Title -->
          <div class="form-group mb-4">
            <label for="recipeTitle" class="form-label enhanced-label">
              <i class="fas fa-utensils me-2"></i>
              Recipe Title *
            </label>
            <input 
              v-model="recipe.title" 
              id="recipeTitle"
              class="form-control enhanced-input" 
              placeholder="Enter a delicious recipe title" 
              required
            />
          </div>

          <!-- Image URL -->
          <div class="form-group mb-4">
            <label for="recipeImage" class="form-label enhanced-label">
              <i class="fas fa-camera me-2"></i>
              Recipe Image URL
            </label>
            <input 
              v-model="recipe.image" 
              id="recipeImage"
              class="form-control enhanced-input" 
              placeholder="Add a beautiful photo URL (optional)" 
            />
          </div>

          <div class="row mb-4">
            <!-- Ready in Minutes -->
            <div class="col-md-6">
              <label for="readyInMinutes" class="form-label enhanced-label">
                <i class="fas fa-clock me-2"></i>
                Ready in Minutes
              </label>
              <input 
                v-model.number="recipe.readyInMinutes" 
                id="readyInMinutes"
                type="number"
                class="form-control enhanced-input" 
                placeholder="30" 
                min="1"
              />
            </div>

            <!-- Servings -->
            <div class="col-md-6">
              <label for="servings" class="form-label enhanced-label">
                <i class="fas fa-users me-2"></i>
                Servings
              </label>
              <input 
                v-model.number="recipe.servings" 
                id="servings"
                type="number"
                class="form-control enhanced-input" 
                placeholder="4" 
                min="1"
              />
            </div>
          </div>

          <!-- Ingredients -->
          <div class="form-group mb-4">
            <label class="form-label enhanced-label">
              <i class="fas fa-list-ul me-2"></i>
              Ingredients *
            </label>
            <div class="ingredients-container">
              <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-item mb-3">
                <div class="row g-2">
                  <div class="col-md-5">
                    <input 
                      v-model="ingredient.name" 
                      class="form-control enhanced-input-sm" 
                      placeholder="Ingredient name" 
                      required
                    />
                  </div>
                  <div class="col-md-3">
                    <input 
                      v-model.number="ingredient.amount" 
                      type="number"
                      class="form-control enhanced-input-sm" 
                      placeholder="1" 
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div class="col-md-3">
                    <input 
                      v-model="ingredient.unit" 
                      class="form-control enhanced-input-sm" 
                      placeholder="cup, tsp, etc." 
                    />
                  </div>
                  <div class="col-md-1">
                    <button 
                      @click="removeIngredient(index)" 
                      class="btn btn-outline-danger btn-sm enhanced-remove-btn w-100"
                      type="button"
                      :disabled="recipe.ingredients.length === 1"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button @click="addIngredient" class="btn btn-outline-primary enhanced-add-btn" type="button">
                <i class="fas fa-plus me-2"></i>
                Add Ingredient
              </button>
            </div>
          </div>

          <!-- Instructions -->
          <div class="form-group mb-4">
            <label for="instructions" class="form-label enhanced-label">
              <i class="fas fa-list-ol me-2"></i>
              Cooking Instructions *
            </label>
            <textarea 
              v-model="recipe.instructions" 
              id="instructions"
              class="form-control enhanced-textarea" 
              rows="5"
              placeholder="Share your cooking secrets and step-by-step instructions..."
              required
            ></textarea>
          </div>

          <!-- Dietary Preferences -->
          <div class="form-group mb-4">
            <label class="form-label enhanced-label">
              <i class="fas fa-leaf me-2"></i>
              Dietary Information
            </label>
            <div class="dietary-badges">
              <div class="form-check form-check-inline dietary-check">
                <input 
                  v-model="recipe.vegan" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="vegan"
                />
                <label class="form-check-label badge-label" for="vegan">
                  <span class="dietary-badge">Vegan</span>
                </label>
              </div>
              <div class="form-check form-check-inline dietary-check">
                <input 
                  v-model="recipe.vegetarian" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="vegetarian"
                />
                <label class="form-check-label badge-label" for="vegetarian">
                  <span class="dietary-badge">Vegetarian</span>
                </label>
              </div>
              <div class="form-check form-check-inline dietary-check">
                <input 
                  v-model="recipe.glutenFree" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="glutenFree"
                />
                <label class="form-check-label badge-label" for="glutenFree">
                  <span class="dietary-badge">Gluten Free</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Recipe Tab -->
      <div v-if="activeTab === 'family'" class="tab-pane fade show active">
        <div class="recipe-form">
          <!-- Recipe Title -->
          <div class="form-group mb-4">
            <label for="familyRecipeTitle" class="form-label enhanced-label">
              <i class="fas fa-heart me-2"></i>
              Family Recipe Title *
            </label>
            <input 
              v-model="recipe.title" 
              id="familyRecipeTitle"
              class="form-control enhanced-input" 
              placeholder="Enter the cherished family recipe title" 
              required
            />
          </div>

          <div class="row mb-4">
            <!-- Who's Recipe -->
            <div class="col-md-6">
              <label for="recipeOwner" class="form-label enhanced-label">
                <i class="fas fa-user-circle me-2"></i>
                Who's Recipe *
              </label>
              <input 
                v-model="recipe.recipeOwner" 
                id="recipeOwner"
                class="form-control enhanced-input" 
                placeholder="e.g., Grandma Sarah, Uncle Joe" 
                required
              />
            </div>

            <!-- Traditional Occasion -->
            <div class="col-md-6">
              <label for="occasion" class="form-label enhanced-label">
                <i class="fas fa-calendar-alt me-2"></i>
                Traditional Occasion *
              </label>
              <input 
                v-model="recipe.occasion" 
                id="occasion"
                class="form-control enhanced-input" 
                placeholder="e.g., Christmas dinner, Sunday lunch" 
                required
              />
            </div>
          </div>

          <!-- Image URL -->
          <div class="form-group mb-4">
            <label for="familyRecipeImage" class="form-label enhanced-label">
              <i class="fas fa-camera me-2"></i>
              Family Photo URL
            </label>
            <input 
              v-model="recipe.image" 
              id="familyRecipeImage"
              class="form-control enhanced-input" 
              placeholder="Add a family photo of this special dish (optional)" 
            />
          </div>

          <div class="row mb-4">
            <!-- Ready in Minutes -->
            <div class="col-md-6">
              <label for="familyReadyInMinutes" class="form-label enhanced-label">
                <i class="fas fa-clock me-2"></i>
                Ready in Minutes
              </label>
              <input 
                v-model.number="recipe.readyInMinutes" 
                id="familyReadyInMinutes"
                type="number"
                class="form-control enhanced-input" 
                placeholder="60" 
                min="1"
              />
            </div>

            <!-- Servings -->
            <div class="col-md-6">
              <label for="familyServings" class="form-label enhanced-label">
                <i class="fas fa-users me-2"></i>
                Servings
              </label>
              <input 
                v-model.number="recipe.servings" 
                id="familyServings"
                type="number"
                class="form-control enhanced-input" 
                placeholder="6" 
                min="1"
              />
            </div>
          </div>

          <!-- Ingredients -->
          <div class="form-group mb-4">
            <label class="form-label enhanced-label">
              <i class="fas fa-list-ul me-2"></i>
              Family Recipe Ingredients *
            </label>
            <div class="ingredients-container">
              <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-item mb-3">
                <div class="row g-2">
                  <div class="col-md-5">
                    <input 
                      v-model="ingredient.name" 
                      class="form-control enhanced-input-sm" 
                      placeholder="Ingredient name" 
                      required
                    />
                  </div>
                  <div class="col-md-3">
                    <input 
                      v-model.number="ingredient.amount" 
                      type="number"
                      class="form-control enhanced-input-sm" 
                      placeholder="1" 
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div class="col-md-3">
                    <input 
                      v-model="ingredient.unit" 
                      class="form-control enhanced-input-sm" 
                      placeholder="cup, tsp, etc." 
                    />
                  </div>
                  <div class="col-md-1">
                    <button 
                      @click="removeIngredient(index)" 
                      class="btn btn-outline-danger btn-sm enhanced-remove-btn w-100"
                      type="button"
                      :disabled="recipe.ingredients.length === 1"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button @click="addIngredient" class="btn btn-outline-primary enhanced-add-btn" type="button">
                <i class="fas fa-plus me-2"></i>
                Add Ingredient
              </button>
            </div>
          </div>

          <!-- Instructions -->
          <div class="form-group mb-4">
            <label for="familyInstructions" class="form-label enhanced-label">
              <i class="fas fa-list-ol me-2"></i>
              Family Cooking Instructions *
            </label>
            <textarea 
              v-model="recipe.instructions" 
              id="familyInstructions"
              class="form-control enhanced-textarea" 
              rows="5"
              placeholder="Share the family cooking traditions and detailed instructions..."
              required
            ></textarea>
          </div>

          <!-- Dietary Preferences -->
          <div class="form-group mb-4">
            <label class="form-label enhanced-label">
              <i class="fas fa-leaf me-2"></i>
              Dietary Information
            </label>
            <div class="dietary-badges">
              <div class="form-check form-check-inline dietary-check">
                <input 
                  v-model="recipe.vegan" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="familyVegan"
                />
                <label class="form-check-label badge-label" for="familyVegan">
                  <span class="dietary-badge">Vegan</span>
                </label>
              </div>
              <div class="form-check form-check-inline dietary-check">
                <input 
                  v-model="recipe.vegetarian" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="familyVegetarian"
                />
                <label class="form-check-label badge-label" for="familyVegetarian">
                  <span class="dietary-badge">Vegetarian</span>
                </label>
              </div>
              <div class="form-check form-check-inline dietary-check">
                <input 
                  v-model="recipe.glutenFree" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="familyGlutenFree"
                />
                <label class="form-check-label badge-label" for="familyGlutenFree">
                  <span class="dietary-badge">Gluten Free</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
      <button 
        type="button" 
        class="btn btn-outline-secondary enhanced-btn-secondary" 
        @click="resetForm"
      >
        <i class="fas fa-undo me-2"></i>
        Reset Form
      </button>
      <button 
        type="button" 
        class="btn btn-primary enhanced-btn-primary" 
        @click="handleSubmit"
        :disabled="!isFormValid || isSubmitting"
      >
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <i v-else class="fas fa-plus-circle me-2"></i>
        {{ isSubmitting ? 'Creating Recipe...' : `Create ${activeTab === 'family' ? 'Family' : 'Personal'} Recipe` }}
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
      activeTab: 'personal',
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

    if (this.activeTab === 'family') {
      recipeData.recipeOwner = this.recipe.recipeOwner.trim();
      recipeData.occasion = this.recipe.occasion.trim();
    }

    const endpoint = this.activeTab === 'family' 
      ? "/users/family"
      : "/users/my_recipes";

    
    const response = await this.axios.post(
      this.$root.store.server_domain + endpoint,
      recipeData,
      { withCredentials: true }
    );

    
    
    if (response.status === 200 || response.status === 201) {
      this.$emit("recipeCreated");
      this.resetForm();
      
      alert(`${this.activeTab === 'family' ? 'Family' : 'Personal'} recipe created successfully!`);
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (err) {
    console.error("❌ Error creating recipe:", err);
    
    let errorMessage = "Failed to create recipe. Please try again.";
    
    if (err.response?.status === 401) {
      errorMessage = "You must be logged in to create recipes. Please login and try again.";
    } else if (err.response?.data?.message) {
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
.create-recipe-enhanced {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Enhanced Tabs */
.enhanced-tabs {
  border-bottom: 3px solid #e9ecef;
  margin-bottom: 2rem;
}

.enhanced-tab {
  border: none !important;
  border-bottom: 3px solid transparent !important;
  background: none !important;
  color: #6c757d !important;
  font-weight: 600 !important;
  padding: 1rem 1.5rem !important;
  transition: all 0.3s ease !important;
  position: relative;
}

.enhanced-tab:hover {
  color: #495057 !important;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef) !important;
  border-radius: 10px 10px 0 0;
}

.enhanced-tab.active {
  color: #0d6efd !important;
  background: linear-gradient(45deg, #e7f1ff, #f0f8ff) !important;
  border-bottom-color: #0d6efd !important;
  border-radius: 10px 10px 0 0;
}

/* Enhanced Content */
.enhanced-content {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Labels */
.enhanced-label {
  font-weight: 700 !important;
  color: #495057 !important;
  margin-bottom: 0.75rem !important;
  font-size: 1rem !important;
}

/* Enhanced Inputs */
.enhanced-input {
  border: 2px solid #e9ecef !important;
  border-radius: 10px !important;
  padding: 0.75rem 1rem !important;
  transition: all 0.3s ease !important;
  background: #fafbfc;
  font-size: 0.95rem !important;
}

.enhanced-input:focus {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15) !important;
  background: white !important;
  transform: translateY(-1px);
}

.enhanced-input-sm {
  border: 1px solid #dee2e6 !important;
  border-radius: 8px !important;
  padding: 0.5rem 0.75rem !important;
  transition: all 0.3s ease !important;
  background: #fafbfc;
  font-size: 0.9rem !important;
}

.enhanced-input-sm:focus {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1) !important;
  background: white !important;
}

.enhanced-textarea {
  border: 2px solid #e9ecef !important;
  border-radius: 10px !important;
  padding: 0.75rem 1rem !important;
  transition: all 0.3s ease !important;
  background: #fafbfc;
  resize: vertical !important;
  min-height: 120px !important;
}

.enhanced-textarea:focus {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15) !important;
  background: white !important;
}

/* Ingredients Container */
.ingredients-container {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
}

.ingredient-item {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.ingredient-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

/* Enhanced Buttons */
.enhanced-add-btn {
  background: linear-gradient(45deg, #0d6efd, #0056b3) !important;
  border: none !important;
  color: white !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

.enhanced-add-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 12px rgba(13, 110, 253, 0.4) !important;
  background: linear-gradient(45deg, #0056b3, #004085) !important;
}

.enhanced-remove-btn {
  transition: all 0.3s ease !important;
  border-radius: 8px !important;
}

.enhanced-remove-btn:hover:not(:disabled) {
  background: #dc3545 !important;
  color: white !important;
  transform: scale(1.1) !important;
}

/* Dietary Badges */
.dietary-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.dietary-check {
  margin: 0 !important;
}

.dietary-check input[type="checkbox"] {
  display: none;
}

.dietary-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
  background: white;
  color: #495057;
}

.dietary-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.dietary-check input:checked + .badge-label .dietary-badge {
  background: #0d6efd !important;
  color: white !important;
  border-color: #0d6efd !important;
}

/* Action Buttons */
.enhanced-btn-secondary {
  background: linear-gradient(45deg, #6c757d, #495057) !important;
  border: none !important;
  color: white !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.enhanced-btn-secondary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 12px rgba(108, 117, 125, 0.3) !important;
  background: linear-gradient(45deg, #495057, #343a40) !important;
}

.enhanced-btn-primary {
  background: linear-gradient(45deg, #28a745, #20c997) !important;
  border: none !important;
  padding: 0.75rem 2rem !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.enhanced-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 12px rgba(40, 167, 69, 0.4) !important;
  background: linear-gradient(45deg, #20c997, #17a2b8) !important;
}

.enhanced-btn-primary:disabled {
  opacity: 0.6 !important;
  transform: none !important;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .enhanced-tab {
    padding: 0.75rem 1rem !important;
    font-size: 0.9rem !important;
  }
  
  .ingredients-container {
    padding: 1rem;
  }
  
  .ingredient-item {
    padding: 0.75rem;
  }
  
  .dietary-badges {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column !important;
    gap: 0.75rem !important;
  }
  
  .enhanced-btn-primary,
  .enhanced-btn-secondary {
    width: 100% !important;
    text-align: center !important;
  }
}

/* Additional Enhancements */
.form-group {
  position: relative;
}

.form-group::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(45deg, #0d6efd, #20c997);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-group:focus-within::before {
  opacity: 1;
}

/* Loading State */
.enhanced-btn-primary .spinner-border {
  width: 1rem !important;
  height: 1rem !important;
}

/* Success State Animation */
@keyframes successPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.success-animation {
  animation: successPulse 0.6s ease-in-out;
}

/* Focus Indicators */
.enhanced-input:focus,
.enhanced-input-sm:focus,
.enhanced-textarea:focus {
  outline: none !important;
  position: relative;
}

.enhanced-input:focus::after,
.enhanced-input-sm:focus::after,
.enhanced-textarea:focus::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #0d6efd, #20c997);
  border-radius: inherit;
  z-index: -1;
  opacity: 0.3;
}

/* Custom Scrollbar for Modal */
.create-recipe-enhanced {
  max-height: 70vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(13, 110, 253, 0.3) transparent;
}

.create-recipe-enhanced::-webkit-scrollbar {
  width: 6px;
}

.create-recipe-enhanced::-webkit-scrollbar-track {
  background: transparent;
}

.create-recipe-enhanced::-webkit-scrollbar-thumb {
  background: rgba(13, 110, 253, 0.3);
  border-radius: 3px;
}

.create-recipe-enhanced::-webkit-scrollbar-thumb:hover {
  background: rgba(13, 110, 253, 0.5);
}

/* Tooltip-like Placeholders */
.enhanced-input::placeholder,
.enhanced-input-sm::placeholder,
.enhanced-textarea::placeholder {
  color: #9ca3af !important;
  font-style: italic;
  transition: all 0.3s ease;
}

.enhanced-input:focus::placeholder,
.enhanced-input-sm:focus::placeholder,
.enhanced-textarea:focus::placeholder {
  color: #d1d5db !important;
  transform: translateY(-2px);
}

/* Validation States */
.is-valid {
  border-color: #28a745 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='m2.3 6.73.32.27.79-.79.79.79.32-.27L3.74 5.7 5.36 4.08l-.32-.27-.79.79-.79-.79-.32.27L4.06 5.2z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.is-invalid {
  border-color: #dc3545 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 5.8 1.4 1.4m0-1.4-1.4 1.4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

/* Improved Tab Indicators */
.enhanced-tab::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(45deg, #0d6efd, #20c997);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.enhanced-tab.active::after {
  width: 80%;
}

/* Better Visual Hierarchy */
.form-label i {
  font-size: 0.9em;
  opacity: 0.7;
  color: #6c757d;
}

.enhanced-label {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem !important;
}

/* Interactive Elements */
.ingredient-item {
  cursor: pointer;
}

.ingredient-item:hover .enhanced-input-sm {
  border-color: #0d6efd !important;
}

/* Animation Delays for Staggered Effect */
.ingredient-item:nth-child(1) { animation-delay: 0.1s; }
.ingredient-item:nth-child(2) { animation-delay: 0.2s; }
.ingredient-item:nth-child(3) { animation-delay: 0.3s; }
.ingredient-item:nth-child(4) { animation-delay: 0.4s; }
.ingredient-item:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.ingredient-item {
  animation: fadeInScale 0.3s ease-out;
  animation-fill-mode: both;
}
</style>