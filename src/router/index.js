import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import("../pages/AboutPage.vue"),
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import("../pages/FavoritesPage.vue"),

  },
  {
    path: '/family',
    name: 'familyRecipes',
    component: () => import("../pages/FamilyRecipesPage.vue"),

  },
  {
    path: '/my-recipes',
    name: 'myRecipes',
    component: () => import("../pages/MyRecipesPage.vue"),
  },
];

export default routes;
