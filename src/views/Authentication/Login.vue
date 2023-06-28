<script setup>
import {ref} from 'vue';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import router from '@/router';

const email = ref('');
const password = ref('');

const signIn = () => {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        router.push('/')
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