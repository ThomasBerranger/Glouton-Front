<script setup>
import {computed, onMounted, ref} from "vue";
import router from "@/router";
import {Html5QrcodeScanner} from 'html5-qrcode';
import {getAuth} from 'firebase/auth';
import {getApp} from "firebase/app";
import {getFirestore, doc, collection, addDoc} from 'firebase/firestore';
import axios from "axios";
import {Datepicker, initTE, Input} from "tw-elements";
import ScoreValue from "@/components/ScoreValue.vue";
import {format} from "@/helpers/date";

const db = getFirestore(getApp());

const productFound = ref(false);
const product = ref({
  code: '',
  name: '',
  description: '',
  image: '',
  nutriscore: '',
  ecoscore: ''
});
const availableImages = ref(null);
const expirationDate = ref(null);
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

  initTE({Datepicker, Input});

  const confirmDateOnSelect = document.getElementById('datepicker');
  new Datepicker(confirmDateOnSelect, {
    confirmDateOnSelect: true,
    disablePast: true,
    removeOkBtn: true,
    removeCancelBtn: true,
    removeClearBtn: true,
  });
});

function onScanSuccess(decodedText, decodedResult) {
  axios
      .get(`https://world.openfoodfacts.org/api/v2/product/${decodedText}`)
      .then(response => {
        productFound.value = true;

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
      .catch(error => console.log(error));
}

async function saveProduct() {
  await addDoc(collection(db, 'products'), {
    code: product.value.code,
    user: getAuth().currentUser.uid,
    name: product.value.name,
    expirationDate: format(expirationDate.value),
    image: product.value.image,
  }).then((data) => {
    router.push('/');
  }).catch((error) => {
    console.log(error);
  });
}
</script>

<template>
  <div v-show="!productFound" id="qrCodeScanner" class="bg-white shadow"></div>
  <div v-show="productFound" class="bg-white mt-10 shadow">

    <div class="w-screen p-5">
      <div class="mb-5 text-center text-xl">{{ product.name }}</div>

      <h2 v-show="availableImages">Choisissez une image</h2>
      <div :class="availableImages ? 'justify-between' : 'justify-center'"
           class="flex flex-wrap mt-2">
        <div v-if="availableImages" class="w-24 flex mb-5" v-for="imageUrl in availableImages">
          <img :src="imageUrl" @click="product.image = imageUrl"
               :class="{'border-4 border-green-700' : product.image === imageUrl}" class="self-center rounded-md"
               alt="product picture">
        </div>
        <div v-else class="w-24 flex mb-5">
          <img :src="product.image" class="self-center rounded-md" alt="product picture">
        </div>
      </div>

      <div
          class="relative"
          id="datepicker"
          data-te-input-wrapper-init>
        <input
            v-model='expirationDate'
            type="text"
            :class="{'border-2 border-rose-600': !expirationDate}"
            class="peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            data-te-datepicker-toggle-ref
            data-te-datepicker-toggle-button-ref/>
        <label
            for="floatingInput"
            class="font-medium pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
          Date de péremption
        </label>
      </div>

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

      <div class="text-center">
        <button type="button" @click="saveProduct"
                class="rounded bg-white mt-5 px-4 py-2 text-md font-semibold text-gray-900 shadow ring-1 ring-inset ring-gray-300">
          Ajouter
        </button>
      </div>

    </div>
  </div>

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
