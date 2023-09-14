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
  <div v-if="Object.keys(products).length === 0" class="w-screen h-full flex flex-1 flex-col justify-center">

    <div class="w-full">
      <img class="mx-auto h-40 w-auto animate-bounce" src="/public/logo.png" alt="Your Company"/>
      <h2 class="mt-5 text-center leading-9 tracking-tight text-gray-900">Garde manger en cours de chargement</h2>
    </div>

  </div>

  <ProductSmallDisplay v-else v-for="product in products" :product="product"/>
</template>
