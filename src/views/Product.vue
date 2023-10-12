<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import {getApp} from "firebase/app";
import EatButton from "@/components/EatButton.vue";
import moment from "moment";
import NotificationContainer from "@/components/Notification/NotificationContainer.vue";
import DatepickerContainer from "@/components/Datepicker/DatepickerContainer.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import router from "@/router";
import {refill, remove} from "@/functions/product";

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
let selectedExpirationDate = ref({key: null, value: null});

onMounted(async () => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    product.value = {...docSnap.data(), id: docSnap.id};
  } else {
    console.error("No product found");
  }
});

watch(product, async () => {
  await updateDoc(productRef, product.value);
}, {deep: true})

async function finish() {
  await updateDoc(productRef, {
    finishedAt: moment().format('L'),
    expirationDates: product.value.expirationDates.splice(1),
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

function refillProduct() {
  selectedExpirationDate.value.key = 0;
  selectedExpirationDate.value.value = product.value.expirationDates[0];
  displayDatepicker.value = true;

  refill(productRef).then(() => {
    product.value.finishedAt = false;
    product.value.toPurchase = false;
  })
}
</script>

<template>

  <NotificationContainer :notification="notification" @close="notification.show = false"/>

  <section v-if="! product.name"
           class="w-screen screen-height flex flex-1 flex-col justify-center items-center">
    <font-awesome-icon icon="fa-solid fa-circle-notch" spin class="h-12"></font-awesome-icon>
  </section>
  <section v-else
           class="w-screen screen-height flex flex-1 flex-col justify-center">

    <div class="bg-white py-5 shadow">

      <h1 class="text-2xl text-center px-4 pb-4 truncate">{{ product.name }}</h1>

      <img class="h-60 mx-auto px-2" :src="product.image" :alt="product.name"/>

      <div class="flex flex-wrap justify-center">
        <label for="name" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Nom du
          produit</label>
        <input type="text" name="name" id="name" v-model="product.name"
               class="text-center w-4/5 rounded-md border-0 p-1.5 mb-2 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"/>

        <div v-if="!product.finishedAt" v-for="(expirationDate, key) in product.expirationDates" :key="key"
             class="w-4/5">
          <label v-if="key === 0" for="expirationDate" class="w-4/5 text-sm font-medium leading-6 text-gray-900">Date de
            péremption</label>
          <div class="h-8 my-2 grid grid-cols-12">
            <input type="text" name="expirationDate" id="expirationDate" placeholder="? / ? / ?"
                   v-model="product.expirationDates[key]"
                   @click="displayDatepicker = true; selectedExpirationDate.key = key; selectedExpirationDate.value = product.expirationDates[key];"
                   readonly
                   :class="new Date((moment(expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD'))) > new Date() ?
               (new Date((moment(expirationDate, 'DD/MM/YYYY').subtract(1, 'week').format('YYYY-MM-DD'))) > new Date() ? null : 'bg-orange-200') : 'bg-red-200',
               product.expirationDates.length === 1 ? 'col-span-12 rounded-md' : 'col-span-10 rounded-tl-md rounded-bl-md'"
                   class="text-center h-full shadow-md ring-1 ring-inset text-sm"/>
            <button v-if="product.expirationDates.length > 1" type="button"
                    @click="product.expirationDates.splice(key, 1)"
                    class="col-span-2 rounded-tr-md rounded-br-md shadow-md bg-red-400 text-sm font-semibold text-white">
              <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl"/>
            </button>
          </div>
        </div>

        <button v-if="!product.finishedAt" type="button" @click="product.expirationDates.push(null)"
                class="rounded-md shadow-md bg-amber-300 pt-1 mt-2 text-sm font-semibold text-white w-4/5">
          <font-awesome-icon icon="fa-solid fa-plus" class="text-xl"/>
        </button>

        <DatepickerContainer :display="displayDatepicker && product"
                             :date="selectedExpirationDate.value ?? moment().format('DD/MM/YYYY')"
                             @update-date="(newDate) => { product.expirationDates[selectedExpirationDate.key] = newDate; displayDatepicker = false; }"/>

        <label for="image" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Lien de
          l'image</label>
        <input type="text" name="image" id="image" v-model="product.image"
               class="w-4/5 rounded-md border-0 px-3 py-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6 truncate"/>

        <hr class="w-2/3 mx-auto my-5">
      </div>

      <div class="w-screen flex justify-evenly">
        <EatButton v-if="!product.finishedAt" @click="finish"/>
        <button v-else @click="updateShoppingList(!product.toPurchase)"
                class="rounded-md px-2.5 py-1.5 text-sm font-medium text-white shadow-sm"
                :class="[product.toPurchase ? 'bg-green-500' : 'bg-red-400']">
          <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
        </button>
        <button v-if="product.finishedAt" @click="refillProduct"
                class="rounded-md border-2 px-2.5 py-1.5 text-sm font-medium shadow-sm">
          J'en ai acheté
        </button>
        <button class="rounded-md px-2.5 py-1.5 text-sm font-medium shadow-sm text-white"
                style="background-color: #0e3b4c"
                @click="remove(product).then(() => router.push('/'))">
          <font-awesome-icon icon="fa-solid fa-trash"/>
        </button>
      </div>

    </div>

  </section>
</template>