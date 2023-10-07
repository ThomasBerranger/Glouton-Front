<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {getApp} from "firebase/app";
import EatButton from "@/components/EatButton.vue";
import moment from "moment";
import NotificationContainer from "@/components/Notification/NotificationContainer.vue";
import DatepickerContainer from "@/components/Datepicker/DatepickerContainer.vue";

const db = getFirestore(getApp());
const route = useRoute();

let productId = ref('');
productId = route.params.id;

const productRef = doc(db, "products", productId);

let product = ref({});
let displayDatepicker = ref(false);
let notification = ref({
  show: false,
  message: '',
  timeout: 3000
});

onMounted(async () => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    product.value = docSnap.data();

    console.log(product.value.expirationDate);
  } else {
    console.error("No product found");
  }
});

watch(product, async () => {
  await updateDoc(productRef, {
    name: product.value.name,
    image: product.value.image,
    expirationDate: product.value.expirationDate
  });
}, {deep: true})

async function finish() {
  await updateDoc(productRef, {
    finishedAt: moment().format('L'),
    toPurchase: true,
  }).then(() => {
    product.value.finishedAt = moment().format('L');
    product.value.toPurchase = true;
    notification.value.show = true;
    notification.value.message = `${product.value.name} a été jouté à la liste de courses.`;
  });
}

async function updateShoppingList(add = true) {
  await updateDoc(productRef, {
    toPurchase: add,
  }).then(() => {
    product.value.toPurchase = add;
    notification.value.show = true;
    notification.value.message = `${product.value.name} a été ${add ? 'ajouté à' : 'retiré de'} la liste de courses.`;
  });
}

async function refill() {
  displayDatepicker.value = true;

  await updateDoc(productRef, {
    finishedAt: '',
    toPurchase: false,
  }).then(() => {
    product.value.finishedAt = '';
    product.value.toPurchase = false;
  });
}
</script>

<template>

  <NotificationContainer :notification="notification" @close="notification.show = false"/>

  <section v-show="Object.keys(product).length !== 0"
           class="w-screen screen-height flex flex-1 flex-col justify-center">

    <h1 class="text-2xl text-center px-4 pb-4 truncate">{{ product.name }}</h1>

    <div class="bg-white py-5 shadow">

      <img class="h-60 mx-auto px-2" :src="product.image" :alt="product.name"/>

      <div class="flex flex-wrap justify-center">
        <label for="name" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Nom du
          produit</label>
        <input type="text" name="name" id="name" v-model="product.name"
               class="text-center w-4/5 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"/>

        <label for="expirationDate" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Date de
          péremption</label>
        <input type="text" name="expirationDate" id="expirationDate"
               readonly @click="displayDatepicker = true" v-model="product.expirationDate"
               class="text-center w-4/5 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"/>

        <DatepickerContainer :display="displayDatepicker && product" :date="product.expirationDate"
                             @update-date="(newDate) => { product.expirationDate = newDate; displayDatepicker = false; }"/>

        <label for="image" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Lien de
          l'image</label>
        <input type="text" name="image" id="image" v-model="product.image"
               class="w-4/5 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6 truncate"/>

        <hr class="w-2/3 mx-auto my-5">
      </div>

      <div class="w-screen flex justify-evenly">
        <EatButton v-if="!product.finishedAt" @click="finish"/>
        <button v-else @click="updateShoppingList(!product.toPurchase)"
                class="rounded-md px-2.5 py-1.5 text-sm font-medium text-white shadow-sm"
                :class="[product.toPurchase ? 'bg-green-500' : 'bg-red-400']">
          <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
        </button>
        <button v-if="product.finishedAt" @click="refill"
                class="rounded-md border-2 px-2.5 py-1.5 text-sm font-medium shadow-sm">
          J'en ai acheté
        </button>
      </div>

    </div>

  </section>
</template>