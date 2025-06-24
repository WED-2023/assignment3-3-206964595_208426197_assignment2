<template>
  <div class="about-page">
    <div class="about-container">
      
      <div class="hero-section">
        <span class="hero-icon"></span>
        <h1>About Recipezz</h1>
      </div>

      <div class="content-sections">
        <div class="intro-section">
          <p>
            Welcome to <strong>Recipezz</strong> - your go-to platform for discovering, creating, and sharing delicious recipes! 
            Whether you're a home cook or just hungry for inspiration, we've built a space where great meals begin.
          </p>
        </div>

        <div class="creators-section">
          <h2>
            <span class="section-icon"></span>
            Meet the Creators
          </h2>
          <div class="creators-content">
            <p>
              <strong>Idan Duhaviv</strong> and <strong>Yuval Ellins</strong> are 3rd-year Software Information Systems Engineering students at BGU. 
              Passionate about code, cuisine, and creative projects that can make a real impact (and maybe even some cash ), a real dream-team
              they're bringing tech and taste together in this full-stack recipe experience.
              You can find them in the Bengi bar, or the library's 3rd floor, they are also looking for a job, so show them some love!
            </p>
          </div>
        </div>

        <div class="works-section">
          <h2>
            <span class="section-icon"></span>
            Past Works
          </h2>
          <div class="works-list">
            <div class="work-item grandma">
              <span class="work-icon"></span>
              <a href="https://wed-2023.github.io/206964595/" target="_blank">
                Yuval's grandma's page, she's our inspiration
              </a>
            </div>
            
            <div class="work-item gidi">
              <span class="work-icon"></span>
              <a href="https://wed-2023.github.io/assignment1-208426197/" target="_blank">
                check out Gidi Gov's page, did you know he's a fan of us?
              </a>
            </div>
            
            <div class="work-item game">
              <span class="work-icon"></span>
              <a href="https://wed-2023.github.io/assignment2-206964595_208426197_assignment2/" target="_blank">
                Space Invaders, 2024 best selling game on Steam
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  padding: 3rem 1rem;
}

.about-container {
  max-width: 64rem;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 3rem 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intro-section {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.intro-section p {
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.7;
  margin: 0;
}

.intro-section strong {
  color: #4f46e5;
}

.creators-section h2,
.works-section h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 2rem;
}

.creators-content {
  background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e0e7ff;
}

.creators-content p {
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.7;
  margin: 0;
}

.creators-content strong:first-of-type {
  color: #4f46e5;
}

.creators-content strong:last-of-type {
  color: #7c3aed;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.work-item {
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid;
  transition: box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.work-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.work-item.grandma {
  background: #fdf2f8;
  border-color: #fce7f3;
}

.work-item.gidi {
  background: #eff6ff;
  border-color: #dbeafe;
}

.work-item.game {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.work-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.work-item a {
  font-size: 1.125rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.work-item.grandma a {
  color: #be185d;
}

.work-item.grandma a:hover {
  color: #9d174d;
  text-decoration: underline;
}

.work-item.gidi a {
  color: #1d4ed8;
}

.work-item.gidi a:hover {
  color: #1e40af;
  text-decoration: underline;
}

.work-item.game a {
  color: #166534;
}

.work-item.game a:hover {
  color: #14532d;
  text-decoration: underline;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .about-page {
    padding: 1.5rem 0.5rem;
  }
  
  .about-container {
    padding: 2rem 1.5rem;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .creators-section h2,
  .works-section h2 {
    font-size: 1.5rem;
  }
  
  .intro-section p,
  .creators-content p,
  .work-item a {
    font-size: 1rem;
  }
}
</style>