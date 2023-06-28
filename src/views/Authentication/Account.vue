<script setup>
import {getAuth, signOut} from 'firebase/auth';
import router from "@/router";

const auth = getAuth();

const logout = () => {
  signOut(auth).then(() => router.push('/'));
}
</script>

<template>
  <div class="login">
    <div class="account">
      <h1>Mon compte</h1>
      <p>{{ auth.currentUser.email }}</p>
      <button @click="logout">Logout</button>
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