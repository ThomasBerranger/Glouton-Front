<script setup>
import {getAuth, signOut} from 'firebase/auth';
import router from "@/router";

const auth = getAuth();

const logout = () => {
  signOut(auth).then(() => router.push('/'));
}
</script>

<template>
  <div class="w-screen screen-height flex flex-1 flex-col justify-center">
    <div class="text-center bg-white shadow-md">
      <h2 class="text-xl my-5">{{ auth.currentUser.email }}</h2>
      <button @click="logout" class="mb-4 border-2 border-red-500 rounded py-1.5 px-3 font-medium text-red-500">
        Logout
      </button>
    </div>
  </div>
</template>
