<script setup>
import {computed, onMounted, ref} from "vue";
import router from "@/router";
import axios from "axios";
import moment from "moment";
import {Html5QrcodeScanner} from 'html5-qrcode';
import {getAuth} from 'firebase/auth';
import {getApp} from "firebase/app";
import {getFirestore, collection, addDoc, query, where, getDocs} from 'firebase/firestore';
import ScoresValue from "@/components/ScoresValue.vue";
import DatepickerContainer from "@/components/Datepicker/DatepickerContainer.vue";
import {add} from "@/functions/product";
import {renameScanTexts} from "@/functions/scan";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

let scanActive = ref(true);
let productNotFound = ref(false);
let displayDatepicker = ref(false);
let product = ref({expirationDates: [null]});
let selectedExpirationDate = ref({key: null, value: null});
let availableImages = ref([]);

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

  renameScanTexts();
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
        .get(`https://world.openfoodfacts.net/api/v2/product/${decodedText}?fields=product_name,nutriscore_data,ecoscore_data,selected_images,generic_name_fr,nova_group`)
        .then(response => {
          product.value.code = decodedText;
          product.value.name = response.data.product.product_name;
          product.value.nutriscore = response.data.product.nutriscore_data.grade ?? '';
          product.value.ecoscore = response.data.product.ecoscore_data.grade ?? '';
          product.value.novagroup = response.data.product.nova_group ?? '';
          product.value.description = response.data.product.generic_name_fr ? response.data.product.generic_name_fr.charAt(0).toUpperCase() + response.data.product.generic_name_fr.slice(1).toLowerCase() : '';

          for (const [key, value] of Object.entries(response.data.product.selected_images.front.display)) {
            availableImages.value.push(value);
          }

          product.value.image = availableImages.value ? availableImages.value[0] : '';

          scanActive.value = false;
          productNotFound.value = false;
        })
        .catch(error => {
          productNotFound.value = true;
        });
  }
}

async function saveProduct() {
  add({
    code: product.value.code,
    user: getAuth().currentUser.uid,
    name: product.value.name,
    description: product.value.description,
    image: product.value.image,
    finishedAt: false,
    nutriscore: product.value.nutriscore,
    ecoscore: product.value.ecoscore,
    novagroup: product.value.novagroup,
    expirationDates: product.value.expirationDates,
  }).then(() => {
    router.push('/');
  });
}
</script>

<template>
  <div v-if="scanActive" id="qrCodeScanner" class="bg-white shadow"></div>
  <div v-else class="bg-white mt-10">

    <div class="w-screen p-5">

      <div class="mb-5 text-center text-xl">{{ product.name }}</div>

      <img :src="product.image" class="mx-auto max-h-52 w-auto" :alt="product.name">
      <div v-if="availableImages.length > 1" class="w-4/5 mx-auto mt-3 p-2 flex justify-between flex-wrap">
        <img v-for="image in availableImages" :src="image" alt="product.name"
             @click="product.image = image" class="h-16 px-1.5 py-1 border-2"
             :class="[image === product.image ? 'rounded border-indigo-500' : 'border-transparent']">
      </div>

      <div v-for="(expirationDate, key) in product.expirationDates" :key="key" class="text-center">
        <label v-if="key === 0" for="expirationDate" class="w-4/5 text-sm font-medium leading-6 text-gray-900">
          Date{{ product.expirationDates.length > 1 ? 's' : null }} de péremption</label>
        <div class="h-8 my-2 grid grid-cols-12">
          <input type="text" name="expirationDate" id="expirationDate" placeholder="? / ? / ?"
                 @click="displayDatepicker = true; selectedExpirationDate.key = key; selectedExpirationDate.value = product.expirationDates[key];"
                 v-model="product.expirationDates[key]"
                 readonly
                 :class="[expirationDate ? 'ring-gray-300' : 'ring-red-400', product.expirationDates.length === 1 ? 'col-span-12 rounded-md' : 'col-span-10 rounded-tl-md rounded-bl-md']"
                 class="text-center h-full shadow-md ring-1 ring-inset text-sm"/>
          <button v-if="product.expirationDates.length > 1" type="button"
                  @click="product.expirationDates.splice(key, 1)"
                  class="col-span-2 rounded-tr-md rounded-br-md shadow-md bg-red-400 text-sm font-semibold text-white">
            <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl mt-1"/>
          </button>
        </div>
      </div>

      <button type="button" @click="product.expirationDates.push(null)"
              class="rounded-md shadow-md bg-amber-300 text-sm font-semibold text-white w-full h-6">
        <font-awesome-icon icon="fa-solid fa-plus" class="text-xl mt-0.5"/>
      </button>

      <DatepickerContainer :display="displayDatepicker && product"
                           :date="selectedExpirationDate.value ?? moment().format('L')"
                           @update-date="(newDate) => { product.expirationDates[selectedExpirationDate.key] = newDate; displayDatepicker = false; }"/>

      <ScoresValue :product="product"/>

      <div class="grid grid-cols-12">
        <div class="col-span-1">
          <font-awesome-icon icon="fa-regular fa-file-lines" class="mx-2 text-xl mt-1 float-left"></font-awesome-icon>
        </div>
        <div class="col-span-11 pt-1 pl-2">
          {{ product.description }}
        </div>
      </div>

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
