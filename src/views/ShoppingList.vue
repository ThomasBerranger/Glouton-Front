<script setup>
import {onMounted, ref} from "vue";
import {collection, doc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {RouterLink} from "vue-router";
import NotificationContainer from "@/components/Notification/NotificationContainer.vue";
import DatepickerContainer from "@/components/Datepicker/DatepickerContainer.vue";
import {update, updateExpirationDate} from "@/functions/product"

let products = ref([]);
let displayDatepicker = ref(false);
let productToRefill = ref({});
let selectedExpirationDate = ref({key: null, value: null});

let notification = ref({
  show: false,
  message: '',
  timeout: 3000
});

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
  product.toPurchase = false;

  update(product).then(() => {
    product.toPurchase = false;
    notification.value.message = `${product.name} a été retiré de la liste de courses.`;
    notification.value.show = true;
  });
}

function refill(newDate) {
  productToRefill.value.expirationDates[0] = newDate;
  productToRefill.value.finishedAt = false;
  productToRefill.value.toPurchase = false;

  update(productToRefill.value).then(() => {
    displayDatepicker.value = false;
  })
}
</script>

<template>

  <NotificationContainer :notification="notification" @close="notification.show = false"/>

  <div class="w-screen flex justify-between items-center p-3 mt-1">
    <h2 class="text-xl">Ma liste de course</h2>
    <RouterLink to="/account">
      <font-awesome-icon icon="fa-solid fa-user" class="text-2xl"/>
    </RouterLink>
  </div>

  <div v-for='product in products' class="w-screen" :key="product.id">
    <Transition name="slide-fade">
      <div v-if="product.toPurchase" class="grid grid-cols-11 shadow shopping-list-product">
        <RouterLink :to="'/product/' + product.id" class="col-span-2">
          <img :src="product.image" :alt="product.name">
        </RouterLink>
        <RouterLink :to="'/product/' + product.id" class="col-span-7 px-2 truncate">{{ product.name }}</RouterLink>
        <button type="button" @click="displayDatepicker = true; productToRefill = product;"
                class="bg-green-500 text-sm font-semibold text-white shadow-sm col-span-1 h-full">
          <font-awesome-icon icon="fa-solid fa-check" class="text-xl"/>
        </button>
        <button type="button" @click="removeProductFormShoppingList(product)"
                class="bg-red-400 text-sm font-semibold text-white shadow-sm col-span-1 h-full">
          <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl"/>
        </button>
      </div>
    </Transition>
  </div>

  <DatepickerContainer :display="displayDatepicker && productToRefill" :date="productToRefill.expirationDates"
                       @update-date="(newDate) => { refill(newDate) }"/>

  <div class="h-20"></div>
</template>

<style>
.shopping-list-product {
  min-height: 4vh;
  background-color: white;
  align-items: center;
  margin: 0.75rem 0 0.75rem 0;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>