<template>
  <nav class="modern-navbar navbar navbar-expand-lg px-3">
    <router-link class="navbar-brand" :to="{ name: 'main' }">
      <i class="fas fa-utensils brand-icon"></i>
      Recipezz 
    </router-link>

    <!-- Mobile toggle button -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'main' }">
            <i class="fas fa-home"></i>
            Recipes
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'search' }">
            <i class="fas fa-search"></i>
            Search
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'about' }">
            <i class="fas fa-info-circle"></i>
            About
          </router-link>
        </li>
        <template v-if="store.username">
          <li class="nav-item">
            <a href="#" class="nav-link" @click.prevent="handleCreateClick">
              <i class="fas fa-plus"></i>
              Create Recipe
            </a>
          </li>
        </template>
      </ul>

      <ul class="navbar-nav ms-auto">
        <template v-if="!store.username">
          <li class="nav-item">
            <span class="navbar-text welcome-text">
              <i class="fas fa-user-circle"></i>
              Hello Guest
            </span>
          </li>
          <li class="nav-item">
            <router-link class="nav-link login-btn" :to="{ name: 'login' }">
              <i class="fas fa-sign-in-alt"></i>
              Login
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link register-btn" :to="{ name: 'register' }">
              <i class="fas fa-user-plus"></i>
              Register
            </router-link>
          </li>
        </template>

        <template v-else>
          <!-- User greeting -->
          <li class="nav-item">
            <span class="navbar-text welcome-text">
              <i class="fas fa-user-circle"></i>
              Hello {{ store.username }}
            </span>
          </li>
          
          <!-- Personal Area Dropdown -->
          <li class="nav-item dropdown user-dropdown">
            <a
              class="nav-link dropdown-toggle user-menu-btn"
              href="#"
              id="personalArea"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-user-cog"></i>
              Personal
            </a>
            <ul class="dropdown-menu dropdown-menu-end modern-dropdown" aria-labelledby="personalArea">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'favorites' }">
                  <i class="fas fa-heart text-danger"></i>
                  My Favorite Recipes
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'myRecipes' }">
                  <i class="fas fa-book text-primary"></i>
                  My Recipes
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'familyRecipes' }">
                  <i class="fas fa-users text-success"></i>
                  My Family Recipes
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <button @click="logout" class="btn logout-btn nav-link">
              <i class="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </li>
        </template>
      </ul>
    </div>
  </nav>

  <!-- Enhanced Create Recipe Modal -->
  <div
    class="modal fade"
    id="createRecipeModal"
    tabindex="-1"
    aria-labelledby="createRecipeModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content modern-modal">
        <div class="modal-header gradient-header">
          <h5 class="modal-title" id="createRecipeModalLabel">
            <i class="fas fa-plus-circle"></i>
            Create New Recipe
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <CreateRecipe @recipeCreated="onRecipeCreated" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue';
import * as bootstrap from 'bootstrap';
import CreateRecipe from '@/components/CreateRecipe.vue';

export default {
  name: 'NavBar',
  components: {
    CreateRecipe
  },
  setup() {
    const modalRef = ref(null);
    let modalInstance = null;

    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;

    const logout = () => {
      store.logout();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      toast('Logout', 'User logged out successfully', 'success');
      router.push('/').catch(() => {});
    };

    const openCreateRecipe = () => {
      if (!modalInstance && modalRef.value) {
        modalInstance = new bootstrap.Modal(modalRef.value);
      }
      modalInstance?.show();
    };

    const handleCreateClick = () => {
      if (!store.username) {
        toast('Access Denied', 'You must be logged in to create a recipe.', 'danger');
        return;
      }
      openCreateRecipe();
    };

    const onRecipeCreated = () => {
      toast('Success', 'Recipe created successfully!', 'success');
      modalInstance?.hide();
    };

    // Enable bootstrap dropdowns
    onMounted(() => {
      const dropdownTriggers = document.querySelectorAll('[data-bs-toggle="dropdown"]');
      dropdownTriggers.forEach(el => {
        new bootstrap.Dropdown(el);
      });

      // Auto-login if still marked as logged in
      if (localStorage.getItem("isLoggedIn") === "true" && !store.username) {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
          store.login(savedUsername);
        }
      }
      dropdownTriggers.forEach(el => new bootstrap.Dropdown(el));
    });

    return {
      store,
      logout,
      openCreateRecipe,
      handleCreateClick,
      modalRef,
      onRecipeCreated
    };
  }
};
</script>

<style scoped>
/* Modern Navbar Styling */
.modern-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  border: none;
  padding: 0.8rem 1.5rem;
  position: relative;
  z-index: 1030;
}

/* Mobile toggle button */
.navbar-toggler {
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.9%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.navbar-brand {
  color: white !important;
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  color: #f8f9fa !important;
  transform: translateY(-1px);
}

.brand-icon {
  font-size: 1.6rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

/* Navigation Links */
.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px !important;
  border-radius: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
  margin: 0 2px;
}

.nav-link:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: white !important;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

/* Create Recipe Link */
.create-recipe-link {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600 !important;
}

.create-recipe-link:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.5);
}

/* Welcome Text */
.welcome-text {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 1.1rem;
}

/* Auth Buttons */
.login-btn {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 8px !important;
}

.register-btn {
  background: white !important;
  color: #667eea !important;
  border: 1px solid white !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
}

.register-btn:hover {
  background: #f8f9fa !important;
  color: #5a67d8 !important;
  transform: translateY(-2px);
}

/* User Menu */
.user-menu-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  padding: 8px 16px !important;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
}

.user-menu-btn::after {
  margin-left: 8px;
}

/* Modern Dropdown */
.modern-dropdown {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 8px;
  margin-top: 8px;
  min-width: 200px;
  z-index: 1040 !important;
  position: absolute !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dropdown-item {
  color: #374151;
  font-weight: 500;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.15s ease;
  border: none;
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  margin-bottom: 2px;
}

.dropdown-item:hover {
  background: #667eea;
  color: white;
  transform: translateX(2px);
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.dropdown-item i {
  width: 16px;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.7;
}

.dropdown-item:hover i {
  opacity: 1;
}

/* Logout Button */
.logout-btn {
  background: rgba(220, 53, 69, 0.1) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(220, 53, 69, 0.3) !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.2) !important;
  color: white !important;
  border-color: rgba(220, 53, 69, 0.5) !important;
  transform: translateY(-2px);
}

/* Modal Enhancements */
.modern-modal {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 24px;
}

.modal-title {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.modal-body {
  padding: 24px;
}

/* Responsive Design */
@media (max-width: 991.98px) {
  .navbar-brand {
    font-size: 1.3rem;
  }
  
  .brand-icon {
    font-size: 1.4rem;
    padding: 6px;
  }
  
  .nav-link {
    margin: 2px 0;
  }
  
  .modern-dropdown {
    position: static !important;
    box-shadow: none;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    margin-top: 0;
  }
  
  .dropdown-item {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

@media (max-width: 575.98px) {
  .welcome-text {
    font-size: 1rem;
    padding: 4px 8px;
  }
  
  .welcome-text span {
    display: none;
  }
  
  .navbar-brand .brand-text {
    display: none;
  }
}
</style>