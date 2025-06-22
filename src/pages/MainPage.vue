<template>
  <div class="main-container">
    <div class="left-panel">
      <h2>Explore new recipes</h2>
      <RecipePreviewList :recipes="exploreRecipes" />
      <button @click="loadRandomRecipes">Load More</button>
    </div>
    <div class="right-panel">
      <RightPanel />
    </div>
  </div>
</template>

<script>
import RecipePreviewList from '../components/RecipePreviewList.vue'
import RightPanel from '../components/RightPanel.vue'


export default {
  components: { RecipePreviewList, RightPanel},
  data() {
    return {
      exploreRecipes: []
    };
  },
  async mounted() {
    await this.loadRandomRecipes();
  },
  methods: {
    async loadRandomRecipes() {
      try {
        const response = await this.axios.get("http://localhost:3000/recipes/explore", { withCredentials: true });
        this.exploreRecipes = response.data;
      } catch (err) {
        console.error("Failed to load recipes");
      }
  }
}
};
</script>

<style scoped>
.main-container {
  display: flex;
}
.left-panel {
  flex: 3;
  margin-right: 20px;
  margin-left: 20px;
}
.right-panel {
  flex: 3;
}
</style>
