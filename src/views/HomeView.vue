<script setup>
import {onMounted} from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

onMounted(() => {
  if (firebase.auth().currentUser) {
    console.log(`Current user: ${firebase.auth().currentUser.email}`);
  }
});
</script>

<template>
</template>
