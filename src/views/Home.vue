<script setup>
import {onMounted, ref} from "vue";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
import {getApp} from "firebase/app";
import ProductSmallDisplay from "@/components/ProductSmallDisplay.vue";
import {getAuth} from "firebase/auth";

const products = ref({});

const db = getFirestore(getApp());
const q = query(collection(db, "products"), where("user", "==", getAuth().currentUser.uid));

onMounted(async () => {
  const querySnapshot = await getDocs(q);
  // const querySnapshot = await getDocs(collection(db, "products"))
  querySnapshot.forEach((doc) => {
    products.value[doc.id] = {...doc.data(), ...{id: doc.id}};
  });
});
</script>

<template>
  <ProductSmallDisplay v-for="product in products" :product="product"/>
</template>
