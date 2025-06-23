<template>
  <div class="main-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">
            <i class="fas fa-utensils"></i>
            Discover Amazing Recipes
          </h1>
          <p class="hero-subtitle">
            Explore thousands of delicious recipes from around the world and create your own culinary masterpieces
          </p>
          <div class="hero-stats">
            <div class="stat">
              <i class="fas fa-utensils"></i>
              <span class="stat-label">Delicious Recipes</span>
            </div>
            <div class="stat">
              <i class="fas fa-heart"></i>
              <span class="stat-label">Made with Love</span>
            </div>
            <div class="stat">
              <i class="fas fa-users"></i>
              <span class="stat-label">Community Driven</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-container">
      <div class="main-container">
        <!-- Left Panel - Explore Recipes -->
        <div class="left-panel">
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-compass"></i>
              </div>
              <div class="section-text">
                <h2 class="section-title">Explore New Recipes</h2>
                <p class="section-subtitle">Discover something delicious today</p>
              </div>
            </div>
            
            <div class="recipes-container">
              <RecipePreviewList :recipes="exploreRecipes" />
            </div>
            
            <div class="load-more-container" v-if="exploreRecipes.length > 0">
              <button @click="loadRandomRecipes" class="load-more-btn" :disabled="loading">
                <div class="btn-content">
                  <span v-if="loading" class="spinner"></span>
                  <i v-else class="fas fa-sync-alt"></i>
                  <span>{{ loading ? 'Loading...' : 'Load More Recipes' }}</span>
                </div>
              </button>
            </div>

            <!-- Empty State -->
            <div v-if="exploreRecipes.length === 0 && !loading" class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-utensils"></i>
              </div>
              <h3>No recipes found</h3>
              <p>We couldn't load any recipes right now. Please try again later.</p>
              <button @click="loadRandomRecipes" class="retry-btn">
                <i class="fas fa-redo"></i>
                Try Again
              </button>
            </div>
          </div>
        </div>

        <!-- Right Panel - Last Watched -->
        <div class="right-panel">
          <div class="sidebar-card">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from '../components/RecipePreviewList.vue'
import RightPanel from '../components/RightPanel.vue'

export default {
  components: { RecipePreviewList, RightPanel },
  data() {
    return {
      exploreRecipes: [],
      loading: false
    };
  },
  async mounted() {
    await this.loadRandomRecipes();
  },
  methods: {
    async loadRandomRecipes() {
      this.loading = true;
      try {
        const response = await this.axios.get("http://localhost:3000/recipes/explore", { withCredentials: true });
        this.exploreRecipes = response.data;
      } catch (err) {
        console.error("Failed to load recipes");
        this.$root.toast('Error', 'Failed to load recipes. Please try again.', 'danger');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding: 80px 0 60px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="30" cy="30" r="1" fill="white" opacity="0.1"/><circle cx="70" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="90" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-overlay {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.hero-title i {
  font-size: 4rem;
  opacity: 0.9;
}

.hero-subtitle {
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 40px;
}

.stat {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat i {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
  font-weight: 500;
}

/* Content Container */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.main-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.left-panel {
  flex: 2;
}

.right-panel {
  flex: 1;
  position: sticky;
  top: 100px;
}

/* Section Cards */
.section-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
}

.section-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.section-text {
  flex: 1;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.section-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.recipes-container {
  padding: 30px;
}

/* Load More Button */
.load-more-container {
  padding: 0 30px 30px;
  display: flex;
  justify-content: center;
}

.load-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  min-width: 200px;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 30px;
  color: #718096;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: #a0aec0;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 10px;
}

.empty-state p {
  margin-bottom: 30px;
  font-size: 1rem;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Responsive Design */
@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
    gap: 30px;
  }
  
  .right-panel {
    position: static;
  }
  
  .hero-stats {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 15px;
  }
  
  .hero-title i {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 30px;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .content-container {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 0 40px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-title i {
    font-size: 2.5rem;
  }
  
  .section-card,
  .sidebar-card {
    border-radius: 15px;
  }
  
  .recipes-container {
    padding: 20px;
  }
  
  .section-header {
    padding: 20px;
  }
}
</style>