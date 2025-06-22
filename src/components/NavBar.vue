<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
    <router-link class="navbar-brand" :to="{ name: 'main' }">Vue Recipes</router-link>

    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'main' }">Recipes</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'search' }">Search</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'about' }">About</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'createRecipe' }">Create Recipe</router-link>
      </li>
    </ul>

    <ul class="navbar-nav ms-auto">
      <template v-if="!store.username">
        <li class="nav-item"><span class="navbar-text">Hello Guest</span></li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'login' }">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'register' }">Register</router-link>
        </li>
      </template>

      <template v-else>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="personalArea"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ store.username }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="personalArea">
            <li>
              <router-link class="dropdown-item" :to="{ name: 'favorites' }">My Favorite Recipes</router-link>
            </li>
            <li>
              <router-link class="dropdown-item" :to="{ name: 'myRecipes' }">My Recipes</router-link>
            </li>
            <li>
              <router-link class="dropdown-item" :to="{ name: 'familyRecipes' }">My Family Recipes</router-link>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <button @click="logout" class="btn btn-link nav-link">Logout</button>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script>
import { getCurrentInstance, onMounted } from 'vue';
import * as bootstrap from 'bootstrap';

export default {
  name: 'NavBar',
  setup() {
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

    onMounted(() => {
      // Bootstrap dropdown init
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
    });

    return { store, logout };
  }
};
</script>


<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.nav-link {
  font-weight: 500;
}
</style>
