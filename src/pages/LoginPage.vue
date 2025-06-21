<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
      </div>
      <button type="submit" class="btn btn-success mt-3">Login</button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import store from '../store'
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
      password: { required},
    };

    const v$ = useVuelidate(rules, state);

const login = async () => {
  if (await v$.value.$validate()) {
    const response = await axios({
      method: "POST",
      url: server_domain + "/login",
      withCredentials: true,
      validateStatus: () => true,
      data: {
        username: state.username,
        password: state.password,
      }
    });

    if (response.status === 200) {
      store.login(state.username);
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
.login-page {
  max-width: 400px;
  margin: auto;
}

.login-page h1 {
  text-align: center;
}
</style>
