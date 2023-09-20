<script setup>
import {onMounted, ref} from "vue";
import {collection, doc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {RouterLink} from "vue-router";
import {format} from "@/helpers/date";

const products = ref([]);

const db = getFirestore(getApp());
const q = query(
    collection(db, "products"),
    where("user", "==", getAuth().currentUser.uid),
    where('finishedAt', '!=', null)
);

onMounted(async () => {
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    products.value.push({...doc.data(), ...{id: doc.id}});
  });

  products.value.sort((a, b) => {
    return b.finishedAt - a.finishedAt;
  })
});

async function removeProductFormShoppingList(product) {
  const productRef = doc(db, "products", product.id);

  await updateDoc(productRef, {toPurchase: false}).then(() => {
    product.toPurchase = false
  });
}
</script>

<template>
  <div class="w-screen flex justify-between items-center p-3 mt-1">
    <h2 class="text-xl">Ma liste de course</h2>
    <RouterLink to="/account">
      <font-awesome-icon icon="fa-solid fa-user" class="text-2xl"/>
    </RouterLink>
  </div>

  <div v-for='product in products' class="w-screen">
    <Transition name="slide-fade">
      <div v-if="product.toPurchase" class="grid grid-cols-10 items-center p-2 my-3 bg-white shadow">
        <RouterLink :to="'/product/' + product.id" class="col-span-2">
          <img :src="product.image" :alt="product.name" class="rounded">
        </RouterLink>
        <RouterLink :to="'/product/' + product.id" class="col-span-7 px-2 truncate">{{ product.name }}</RouterLink>
        <button type="button" @click="removeProductFormShoppingList(product)"
                class="rounded-md bg-red-400 text-sm font-semibold text-white shadow-sm h-full col-span-1">
          <font-awesome-icon icon="fa-solid fa-xmark" class="text-2xl"/>
        </button>
      </div>
    </Transition>
  </div>

  <div class="h-20"></div>
</template>

<style>
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>