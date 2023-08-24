<script setup>
import {onMounted, ref} from "vue";
import {Html5QrcodeScanner} from 'html5-qrcode';
import axios from "axios";
import {Datepicker, initTE, Input} from "tw-elements";

const productFound = ref(false);
const product = ref({
  code: '',
  name: '',
  genericNameFr: '',
  imageUrl: '',
  brands: ''
});

onMounted(() => {
  const html5QrcodeScanner = new Html5QrcodeScanner(
      'qrCodeScanner',
      {
        fps: 10,
        qrbox: 250,
      }
  );
  html5QrcodeScanner.render(onScanSuccess);

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
        product.value.imageUrl = response.data.product.selected_images.front.display.en;

        product.value.name = response.data.product.product_name;
        product.value.name_fr = response.data.product.product_name_fr;
        // Description ?
        // product.value.genericNameFr = response.data.product.generic_name_fr;
        product.value.product_quantity = response.data.product.product_quantity;
        product.value.brands = response.data.product.brands;
        product.value.nutriscore_score = response.data.product.nutriscore_score;
        product.value.nutriscore_grade = response.data.product.nutrition_grade_fr;


      })
      .catch(error => console.log(error));
}
</script>

<template>
  <div v-show="!productFound" id="qrCodeScanner"></div>
  <div v-show="productFound">

    <div class="w-screen p-5">
      <div class="mb-5">{{ product.name }}</div>
      <img class="mb-5" :src="product.imageUrl" alt="product picture">

      <div
          class="relative"
          id="datepicker"
          data-te-input-wrapper-init>
        <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            data-te-datepicker-toggle-ref
            data-te-datepicker-toggle-button-ref/>
        <label
            for="floatingInput"
            class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
          Date de péremption
        </label>
      </div>

      <div class="mt-5">{{ product.brands }}</div>

    </div>
  </div>

</template>

<style>
</style>
