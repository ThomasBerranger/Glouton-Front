<script setup>
import firebase from 'firebase/compat/app';
import 'firebase/auth';

</script>

<template>
  <div class="login">
    <div class="account">
      <h1>Mon compte</h1>
      <p>{{ firebase.auth().currentUser.email }}</p>
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

  .account > * {
    margin: 2% 0 2% 0;
  }
}
</style>