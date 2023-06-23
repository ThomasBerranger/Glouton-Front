<script setup>
import {ref} from 'vue'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import router from "@/router";

const email = ref('')
const password = ref('')
const register = () => {
  firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((data) => {
        console.log('Registered !');
        router.push('/');
      })
      .catch(error => {
        console.log(error.code);
      })
}
</script>

<template>
  <div class="register">
    <div class="register-form">
      <h1>Create an Account</h1>
      <p><input type="text" placeholder="Email" v-model="email"/></p>
      <p><input type="password" placeholder="Password" v-model="password"/></p>
      <p>
        <button @click="register">Submit</button>
      </p>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .register {
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