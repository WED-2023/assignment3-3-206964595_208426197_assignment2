<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="text-center mb-4">Create Account</h2>
      
      <form @submit.prevent="handleRegister">
        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Username *</label>
          <input 
            v-model="form.username" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.username }"
            id="username"
            placeholder="3-8 letters only"
            required
          />
          <div class="form-text">Username must be 3-8 letters only (no numbers or special characters)</div>
          <div v-if="errors.username" class="invalid-feedback">{{ errors.username }}</div>
        </div>

        <!-- First Name -->
        <div class="mb-3">
          <label for="firstname" class="form-label">First Name *</label>
          <input 
            v-model="form.firstname" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.firstname }"
            id="firstname"
            required
          />
          <div v-if="errors.firstname" class="invalid-feedback">{{ errors.firstname }}</div>
        </div>

        <!-- Last Name -->
        <div class="mb-3">
          <label for="lastname" class="form-label">Last Name *</label>
          <input 
            v-model="form.lastname" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.lastname }"
            id="lastname"
            required
          />
          <div v-if="errors.lastname" class="invalid-feedback">{{ errors.lastname }}</div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email *</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            id="email"
            required
          />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <!-- Country -->
        <div class="mb-3">
          <label for="country" class="form-label">Country *</label>
          <input 
            v-model="form.country" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.country }"
            id="country"
            placeholder="Enter your country"
            required
          />
          <div class="form-text">Must be a valid country name</div>
          <div v-if="errors.country" class="invalid-feedback">{{ errors.country }}</div>
        </div>

        <!-- Profile Picture URL -->
        <div class="mb-3">
          <label for="profilePic" class="form-label">Profile Picture URL</label>
          <input 
            v-model="form.profilePic" 
            type="url" 
            class="form-control"
            id="profilePic"
            placeholder="https://example.com/your-photo.jpg (optional)"
          />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password *</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            id="password"
            required
          />
          <div class="form-text">5-10 characters, must include at least one number and one special character</div>
          <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <label for="passwordConfirm" class="form-label">Confirm Password *</label>
          <input 
            v-model="form.passwordConfirm" 
            type="password" 
            class="form-control"
            :class="{ 'is-invalid': errors.passwordConfirm }"
            id="passwordConfirm"
            required
          />
          <div v-if="errors.passwordConfirm" class="invalid-feedback">{{ errors.passwordConfirm }}</div>
        </div>

        <!-- Submit Button -->
        <div class="d-grid">
          <button 
            type="submit" 
            class="btn btn-primary btn-lg"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center mt-3">
          <p>Already have an account? 
            <router-link to="/login" class="text-decoration-none">Login here</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      form: {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        country: '',
        profilePic: '',
        password: '',
        passwordConfirm: ''
      },
      errors: {},
      isSubmitting: false
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!/^[A-Za-z]{3,8}$/.test(this.form.username)) {
        this.errors.username = 'Username must be 3-8 letters only';
      }

      if (!this.form.firstname.trim()) {
        this.errors.firstname = 'First name is required';
      }
      if (!this.form.lastname.trim()) {
        this.errors.lastname = 'Last name is required';
      }
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required';
      }
      if (!this.form.country.trim()) {
        this.errors.country = 'Country is required';
      }

      // תיקון רג'אקס:
      if (!/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{5,10}$/.test(this.form.password)) {
        this.errors.password = 'Password must be 5-10 characters with at least one number and one special character';
      }

      if (this.form.password !== this.form.passwordConfirm) {
        this.errors.passwordConfirm = 'Passwords do not match';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.form.email && !emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleRegister() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        console.log('Server domain:', this.$root.store.server_domain);
        console.log('Submitting registration:', this.form);

        const response = await this.axios.post(
          `${this.$root.store.server_domain}/auth/register`,
          this.form
        );

        if (response.data.success) {
          alert('Account created successfully! Please login.');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Registration error:', error);

        if (error.response?.data?.message) {
          const message = error.response.data.message;

          if (message.includes('Username')) this.errors.username = message;
          else if (message.includes('Password')) this.errors.password = message;
          else if (message.includes('country')) this.errors.country = message;
          else alert(message);
        } else if (error.response?.status) {
          alert(`Registration failed with status ${error.response.status}: ${error.response?.data || 'Unknown error'}`);
        } else if (error.message) {
          alert(`Network error: ${error.message}`);
        } else {
          alert('Registration failed. Please try again.');
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    }
  },
  watch: {
    'form.username'() { this.clearError('username'); },
    'form.firstname'() { this.clearError('firstname'); },
    'form.lastname'() { this.clearError('lastname'); },
    'form.email'() { this.clearError('email'); },
    'form.country'() { this.clearError('country'); },
    'form.password'() { 
      this.clearError('password');
      this.clearError('passwordConfirm');
    },
    'form.passwordConfirm'() { this.clearError('passwordConfirm'); }
  }
};
</script>

<style scoped>
/* נשמר כמו במקור – מעוצב היטב */
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}
.register-card {
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}
/* שאר העיצוב נשאר תקין ויפה כפי ששלחת */
</style>
