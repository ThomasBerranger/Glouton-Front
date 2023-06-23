<script setup>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import router from '@/router';

const logout = () => {
  firebase.auth().signOut()
  router.push('/')
}
</script>

<template>
  <div class="about">
    <div>
      <h1>This is an about page</h1>
      <button @click="logout">You can log out here</button>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .about > div {
    text-align: center;
  }
}
</style>
