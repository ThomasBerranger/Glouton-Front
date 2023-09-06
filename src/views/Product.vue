<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {getApp} from "firebase/app";

const db = getFirestore(getApp());
const route = useRoute();

let productId = ref('');
let productLoaded = ref(false);
let product = ref({});

productId = route.params.id;

onMounted(async () => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    productLoaded.value = true;
    product.value = docSnap.data();
  } else {
    console.log("No such document!");
  }
});

async function editProduct() {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    name: product.value.name
  }).then(() => {
    console.log("updated");
  })
}
</script>

<template>
  <div v-if="!productLoaded" class="text-center w-screen mt-5">
    <p>En cours de chargement</p>
  </div>
  <div v-else class="w-screen">
    <input type="text" v-model="product.name" class="w-screen">
    <p>Date de peremption : {{ product.expirationDate }}</p>
    <img class="w-32" :src="product.image"/>
    <hr class="w-3/4 mx-auto my-5">
    <div class="flex justify-around">
      <button class="rounded-md bg-indigo-300 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm">Ajouter</button>
      <button @click="editProduct" class="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm">Modifier</button>
      <button class="rounded-md bg-red-400 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm">Retirer</button>
    </div>
  </div>
</template>

<style></style>