<script setup>
import {onMounted, ref} from "vue";
import {collection, doc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {RouterLink} from "vue-router";
import {update} from "@/functions/product"
import NotificationContainer from "@/components/Notification/NotificationContainer.vue";
import DatepickerContainer from "@/components/Datepicker/DatepickerContainer.vue";
import moment from "moment";

let products = ref([]);
let productToRefill = ref({});
let displayDatepicker = ref(false);
let notification = ref({show: false, message: '', timeout: 3000});

const db = getFirestore(getApp());

onMounted(async () => {
  getDocs(
      query(
          collection(db, "products"),
          where("user", "==", getAuth().currentUser.uid),
          where('finishedAt', '!=', null)
      )
  ).then((documents) => {
    documents.forEach((doc) => {
      products.value.push({...doc.data(), id: doc.id});
    })

    products.value.sort((a, b) => {
      return b.finishedAt - a.finishedAt;
    })
  });
});

async function removeFromShoppingList(product) {
  product.toPurchase = false;

  update(product).then(() => {
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
    <Transition>
      <div v-if="product.toPurchase" class="grid grid-cols-11 shadow shopping-list-product">
        <RouterLink :to="'/product/' + product.id" class="col-span-2">
          <img v-if="product.image" :src="product.image" :alt="product.name">
          <img v-else src="/public/logo.png" alt="image missing">
        </RouterLink>
        <RouterLink :to="'/product/' + product.id" class="col-span-7 px-2 truncate">{{ product.name }}</RouterLink>
        <button type="button" @click="displayDatepicker = true; productToRefill = product;"
                class="green-background text-sm font-semibold text-white shadow-sm col-span-1 h-full">
          <font-awesome-icon icon="fa-solid fa-check" class="text-xl"/>
        </button>
        <button type="button" @click="removeFromShoppingList(product)"
                class="red-background text-sm font-semibold text-white shadow-sm col-span-1 h-full">
          <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl"/>
        </button>
      </div>
    </Transition>
  </div>

  <DatepickerContainer :display="displayDatepicker && productToRefill"
                       :date="productToRefill.expirationDates ? productToRefill.expirationDates[0] : moment().format('L')"
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>