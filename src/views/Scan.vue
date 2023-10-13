<script setup>
import {computed, onMounted, ref} from "vue";
import router from "@/router";
import axios from "axios";
import moment from "moment";
import {Html5QrcodeScanner} from 'html5-qrcode';
import {getAuth} from 'firebase/auth';
import {getApp} from "firebase/app";
import {getFirestore, collection, addDoc, doc, getDoc, query, where, getDocs} from 'firebase/firestore';
import ScoreValue from "@/components/ScoreValue.vue";
import DatepickerContainer from "@/components/Datepicker/DatepickerContainer.vue";
import logger from "@fortawesome/vue-fontawesome/src/logger";

const db = getFirestore(getApp());

let scanActive = ref(true);
let productNotFound = ref(false);
let displayDatepicker = ref(false);
let product = ref({
  code: '',
  name: '',
  description: '',
  image: '',
  nutriscore: '',
  ecoscore: '',
  expirationDates: [null]
});
let selectedExpirationDate = ref({key: null, value: null});
let availableImages = ref(null);
const productDescription = computed(() => product.value.description.charAt(0).toUpperCase() + product.value.description.slice(1).toLowerCase())

onMounted(() => {
  const html5QrcodeScanner = new Html5QrcodeScanner(
      'qrCodeScanner',
      {
        fps: 10,
        qrbox: 250,
      },
      false
  );
  html5QrcodeScanner.render(onScanSuccess, (error) => {
    console.error(error)
  });
});

async function onScanSuccess(decodedText, decodedResult) {
  const db = getFirestore(getApp());
  const q = query(
      collection(db, "products"),
      where("user", "==", getAuth().currentUser.uid),
      where('code', '==', decodedText)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs[0]) {
    await router.push('/product/' + querySnapshot.docs[0].id);
  } else {
    axios
        .get(`https://world.openfoodfacts.org/api/v2/product/${decodedText}`)
        .then(response => {
          scanActive.value = false;
          productNotFound.value = false;

          product.value.code = decodedText;

          if (Object.keys(response.data.product.selected_images.front.display).length < 2) {
            product.value.image = Object.values(response.data.product.selected_images.front.display)[0];
          } else {
            availableImages.value = response.data.product.selected_images.front.display;
          }

          product.value.name = response.data.product.product_name;
          product.value.description = response.data.product.generic_name_fr;
          product.value.nutriscore = response.data.product.nutriscore_score;
          product.value.ecoscore = response.data.product.ecoscore_score;

        })
        .catch(error => {
          productNotFound.value = true;
        });
  }
}

async function saveProduct() {
  await addDoc(collection(db, 'products'), {
    code: product.value.code,
    user: getAuth().currentUser.uid,
    name: product.value.name,
    image: product.value.image,
    finishedAt: false,
    expirationDates: product.value.expirationDates,
  }).then((data) => {
    router.push('/');
  }).catch((error) => {
    console.log(error);
  });
}
</script>

<template>
  <div v-show="scanActive" id="qrCodeScanner" class="bg-white shadow"></div>
  <div v-show="!scanActive" class="bg-white mt-10 shadow">

    <div class="w-screen p-5">
      <div class="mb-5 text-center text-xl">{{ product.name }}</div>

      <h2 v-show="availableImages">Choisissez une image</h2>
      <div :class="availableImages ? 'justify-around' : 'justify-center'"
           class="flex flex-wrap mt-2">
        <div v-if="availableImages" class="w-24 flex mb-5" v-for="imageUrl in availableImages" :key="imageUrl">
          <img :src="imageUrl" @click="product.image = imageUrl"
               :class="{'border-4 border-green-700' : product.image === imageUrl}" class="self-center rounded"
               alt="product picture">
        </div>
        <div v-else class="w-24 flex mb-5">
          <img :src="product.image" class="self-center rounded-md" alt="product picture">
        </div>
      </div>

      <div v-for="(expirationDate, key) in product.expirationDates" :key="key" class="text-center my-2">
        <label v-if="key === 0" for="expirationDate" class="w-4/5 text-sm font-medium leading-6 text-gray-900">Date de
          péremption</label>
        <div class="h-8 my-3 grid grid-cols-12">
          <input type="text" name="expirationDate" id="expirationDate" placeholder="? / ? / ?"
                 @click="displayDatepicker = true; selectedExpirationDate.key = key; selectedExpirationDate.value = product.expirationDates[key];"
                 v-model="product.expirationDates[key]"
                 readonly
                 :class="[expirationDate ? 'ring-gray-300' : 'ring-red-400', product.expirationDates.length === 1 ? 'col-span-12 rounded-md' : 'col-span-10 rounded-tl-md rounded-bl-md']"
                 class="text-center h-full shadow-md ring-1 ring-inset text-sm"/>
          <button v-if="product.expirationDates.length > 1" type="button" @click="product.expirationDates.splice(key, 1)"
                  class="col-span-2 rounded-tr-md rounded-br-md shadow-md bg-red-400 text-sm font-semibold text-white">
            <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl"/>
          </button>
        </div>
      </div>

      <button type="button" @click="product.expirationDates.push(null)"
              class="rounded-md shadow-md bg-amber-300 pt-1 text-sm font-semibold text-white w-full">
        <font-awesome-icon icon="fa-solid fa-plus" class="text-xl"/>
      </button>

      <DatepickerContainer :display="displayDatepicker && product"
                           :date="selectedExpirationDate.value ?? moment().format('L')"
                           @update-date="(newDate) => { product.expirationDates[selectedExpirationDate.key] = newDate; displayDatepicker = false; }"/>

      <div class="mt-5 grid grid-cols-2 text-center">
        <div>
          <p>Nutriscore</p>
          <ScoreValue :score="product.nutriscore"/>
        </div>
        <div>
          <p>Ecosocore</p>
          <ScoreValue :score="product.ecoscore"/>
        </div>
      </div>

      <div class="mt-5 text-center">{{ productDescription }}</div>

      <div v-show="product.image && product.expirationDates[0]" class="text-center">
        <button type="button" @click="saveProduct"
                class="rounded bg-white mt-5 px-4 py-2 text-md font-semibold text-gray-900 shadow ring-1 ring-inset ring-gray-300">
          Ajouter
        </button>
      </div>

    </div>
  </div>

  <p v-if="productNotFound" class="w-screen text-center pt-5">Article inconnu</p>

  <div class="h-20"></div>
</template>

<style>
#qrCodeScanner {
  width: 90vw;
  margin: 10vh 5vw 0 5vw !important;
}

#qrCodeScanner img {
  margin: auto;
}
</style>
