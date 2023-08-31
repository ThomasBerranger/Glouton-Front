<script setup>
import {onMounted, ref} from "vue";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
import {getApp} from "firebase/app";
import ProductSmallDisplay from "@/components/ProductSmallDisplay.vue";

const products = ref([]);

const db = getFirestore(getApp());
// const q = query(collection(db, "products"), where("products", "==", getAuth().currentUser.uid));

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "products"))
  querySnapshot.forEach((doc) => {
    products.value.push(doc.data());
  });
});
</script>

<template>
  <div class="flex justify-around items-center mt-5 mb-3">
    <h1 class="text-md">Mon garde manger</h1>
  </div>

  <ProductSmallDisplay v-for="product in products" :product="product"/>
</template>
