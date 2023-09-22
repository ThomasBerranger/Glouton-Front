<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {getApp} from "firebase/app";
import {formatToValidDate} from "@/helpers/date";
import EatButton from "@/components/EatButton.vue";
import Datepicker from "@/components/Datepicker.vue";

const db = getFirestore(getApp());
const route = useRoute();

let productId = ref('');
productId = route.params.id;

let product = ref({});
let displayDatepicker = ref(false);

onMounted(async () => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    product.value = docSnap.data();
  } else {
    console.error("No product found");
  }
});

watch(product, async (newProduct, oldProduct) => {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    name: product.value.name,
    image: product.value.image,
    expirationDate: product.value.expirationDate
  });
}, {deep: true})

async function finishProduct() {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    finishedAt: Date.now(),
    toPurchase: true,
  }).then(() => {
    product.finishedAt = Date.now()
  });
}
</script>

<template>
  <section class="w-screen screen-height flex flex-1 flex-col justify-center">

    <div v-show="Object.keys(product).length !== 0" class="bg-white py-5 shadow">

      <h1 class="text-2xl text-center px-4 pb-4 truncate">{{ product.name }}</h1>

      <img class="h-60 mx-auto px-2" :src="product.image" :alt="product.name"/>

      <div class="flex flex-wrap justify-center">
        <label for="name" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Nom du
          produit</label>
        <input type="text" name="name" id="name" v-model="product.name"
               class="text-center w-4/5 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"/>

        <label for="expirationDate" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Date de
          péremption</label>
        <input type="text" name="expirationDate" id="expirationDate"
               @click="displayDatepicker = true"
               v-model="product.expirationDate"
               class="text-center w-4/5 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"/>

        <Transition>
          <Datepicker v-if="displayDatepicker && product" :date="formatToValidDate(product.expirationDate)"
                      @update-date="(newDate) => { product.expirationDate = newDate; displayDatepicker = false;}"/>
        </Transition>

        <label for="image" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Lien de
          l'image</label>
        <input type="text" name="image" id="image" v-model="product.image"
               class="w-4/5 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6 truncate"/>

        <hr class="w-2/3 mx-auto my-5">
      </div>

      <div class="w-screen flex justify-around">
        <EatButton @click="finishProduct"/>
      </div>

    </div>

  </section>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>