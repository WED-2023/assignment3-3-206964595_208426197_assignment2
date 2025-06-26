<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="text-center mb-4">Welcome Back</h1>
      
      <form @submit.prevent="login">
        <div class="form-group mb-3">
          <label for="username" class="form-label">Username:</label>
          <input 
            v-model="state.username" 
            type="text" 
            class="form-control" 
            id="username"
            placeholder="Enter your username"
            required
          />
        </div>
        
        <div class="form-group mb-3">
          <label for="password" class="form-label">Password:</label>
          <input 
            v-model="state.password" 
            type="password" 
            class="form-control" 
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div class="d-grid">
          <button type="submit" class="btn btn-primary btn-lg">
            Login
          </button>
        </div>

        <!-- Register Link -->
        <div class="text-center mt-3">
          <p>Don't have an account? 
            <router-link to="/register" class="text-decoration-none">Create one here</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import store from '../store';
import axios from 'axios';

const server_domain = store.server_domain;

export default {
  name: "LoginPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, state);

    const login = async () => {
      if (await v$.value.$validate()) {
        const response = await axios({
          method: "POST",
          url: server_domain + "/auth/login",
          withCredentials: true,
          validateStatus: () => true,
          data: {
            username: state.username,
            password: state.password,
          }
        });

        if (response.status === 200) {
          store.login(state.username);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", state.username);
          window.location.href = "/";
        } else {
          window.toast("Login failed", response.data.message || "Unknown error", "danger");
        }
      }
    };

    expose({ login });
    return { state, v$, login };
  }
};
</script>

<style scoped>
/* Import Google Fonts for consistency */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(10px);
}

.login-card h1 {
  color: #333;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 600;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.form-label {
  color: #555;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.15);
  background: white;
  transform: translateY(-1px);
}

.form-control::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Register Link Styling */
.login-card p {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 0;
}

.login-card a {
  color: #667eea;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
}

.login-card a:hover {
  color: #5a67d8;
  text-decoration: none !important;
}

.login-card a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.login-card a:hover::after {
  width: 100%;
}

/* Form Group Spacing */
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-group:focus-within::before {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 576px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
  
  .login-card h1 {
    font-size: 1.75rem;
  }
}

/* Animation for card appearance */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: slideInUp 0.6s ease-out;
}

/* Input validation states */
.form-control:valid {
  border-color: #10b981;
}

.form-control:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

/* Loading state for button */
.btn-primary:disabled {
  opacity: 0.7;
  transform: none;
  cursor: not-allowed;
}

/* Enhanced focus indicators */
.form-control:focus {
  outline: none;
  position: relative;
}

/* Better visual hierarchy */
.text-center p {
  font-weight: 400;
  line-height: 1.5;
}

/* Link hover effects */
.login-card a {
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-card a:hover {
  transform: translateY(-1px);
}
</style>