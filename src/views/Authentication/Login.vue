<script setup>
import {ref} from 'vue';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import router from '@/router';

const email = ref('');
const password = ref('');
const signIn = () => {
  firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((data) => {
        console.log('Successfully logged in!');
        router.push('/about')
      })
      .catch(error => {
        console.log(error.code)
      });
}
</script>

<template>
  <div class="login">
    <div class="register-form">
      <h1>Login to Your Account</h1>
      <p><input type="text" placeholder="Email" v-model="email"/></p>
      <p><input type="password" placeholder="Password" v-model="password"/></p>
      <p>
        <button @click="signIn">Submit</button>
      </p>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .register-form > * {
    margin: 2% 0 2% 0;
  }
}
</style>