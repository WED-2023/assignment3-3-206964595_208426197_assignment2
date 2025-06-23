<template>
  <nav class="modern-navbar">
    <div class="navbar-container">
      <!-- Brand -->
      <router-link class="navbar-brand" :to="{ name: 'main' }">
        <i class="fas fa-utensils brand-icon"></i>
        <span class="brand-text">Vue Recipes</span>
      </router-link>

      <!-- Navigation Links -->
      <div class="nav-links">
        <router-link class="nav-link" :to="{ name: 'main' }">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </router-link>
        <router-link class="nav-link" :to="{ name: 'search' }">
          <i class="fas fa-search"></i>
          <span>Search</span>
        </router-link>
        <router-link class="nav-link" :to="{ name: 'about' }">
          <i class="fas fa-info-circle"></i>
          <span>About</span>
        </router-link>
        <a href="#" class="nav-link create-btn" @click.prevent="openCreateRecipe">
          <i class="fas fa-plus"></i>
          <span>Create Recipe</span>
        </a>
      </div>

      <!-- User Section -->
      <div class="user-section">
        <template v-if="!store.username">
          <router-link class="auth-btn login-btn" :to="{ name: 'login' }">Login</router-link>
          <router-link class="auth-btn register-btn" :to="{ name: 'register' }">Register</router-link>
        </template>

        <template v-else>
          <div class="user-menu" ref="userMenu">
            <button class="user-btn" @click="toggleUserDropdown">
              <i class="fas fa-user"></i>
              <span>{{ store.username }}</span>
              <i class="fas fa-chevron-down" :class="{ 'rotated': showUserDropdown }"></i>
            </button>
            
            <div class="dropdown" v-show="showUserDropdown">
              <router-link class="dropdown-item" :to="{ name: 'favorites' }" @click="closeDropdown">
                <i class="fas fa-heart"></i>
                My Favorites
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'myRecipes' }" @click="closeDropdown">
                <i class="fas fa-book"></i>
                My Recipes
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'familyRecipes' }" @click="closeDropdown">
                <i class="fas fa-users"></i>
                Family Recipes
              </router-link>
            </div>
          </div>
          
          <!-- Separator -->
          <div class="separator"></div>
          
          <!-- Logout Button -->
          <button class="logout-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </template>
      </div>
    </div>

    <!-- Simple Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Create New Recipe</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <CreateRecipe @recipeCreated="onRecipeCreated" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getCurrentInstance, ref, onMounted, onUnmounted } from 'vue';
import CreateRecipe from '@/components/CreateRecipe.vue';

export default {
  name: 'NavBar',
  components: { CreateRecipe },
  setup() {
    const userMenu = ref(null);
    const showUserDropdown = ref(false);
    const showModal = ref(false);

    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;

    const toggleUserDropdown = () => {
      showUserDropdown.value = !showUserDropdown.value;
    };

    const closeDropdown = () => {
      showUserDropdown.value = false;
    };

    const openCreateRecipe = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const onRecipeCreated = () => {
      toast('Success', 'Recipe created successfully!', 'success');
      closeModal();
    };

    const logout = () => {
      store.logout();
      toast('Success', 'Logged out successfully', 'success');
      router.push('/').catch(() => {});
      closeDropdown();
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (userMenu.value && !userMenu.value.contains(event.target)) {
        closeDropdown();
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      store,
      userMenu,
      showUserDropdown,
      showModal,
      toggleUserDropdown,
      closeDropdown,
      openCreateRecipe,
      closeModal,
      onRecipeCreated,
      logout
    };
  }
};
</script>

<style scoped>
.modern-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 65px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.4rem;
  margin-right: 40px;
}

.brand-icon {
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
}

.auth-btn {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-btn {
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.register-btn {
  background: white;
  color: #667eea;
}

.register-btn:hover {
  background: #f8f9fa;
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-btn .fa-chevron-down {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.user-btn .fa-chevron-down.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  margin-top: 5px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f7fafc;
}

.dropdown-item.logout {
  color: #e53e3e;
  border-top: 1px solid #e2e8f0;
}

.dropdown-item.logout:hover {
  background: #fed7d7;
}

.separator {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 10px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  border-color: rgba(220, 53, 69, 0.4);
  color: #ffebee;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 15px;
  }
  
  .nav-links {
    gap: 15px;
  }
  
  .nav-link span {
    display: none;
  }
  
  .brand-text {
    display: none;
  }
  
  .user-btn span {
    display: none;
  }
}
</style>