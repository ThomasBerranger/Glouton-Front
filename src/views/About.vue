<script setup>
import {onMounted, ref} from "vue";
import {Html5QrcodeScanner} from 'html5-qrcode';
import axios from "axios";

import {Datepicker, Input, initTE} from "tw-elements";

let productImageUrl = ref('');
let productName = ref('');
let productName2 = ref('');

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

  const confirmDateOnSelect = document.getElementById('datepicker-close-without-confirmation');
  new Datepicker(confirmDateOnSelect, {
    confirmDateOnSelect: true,
    disablePast: true,
    removeOkBtn: true,
    removeCancelBtn: true,
    removeClearBtn: true,
  });
});

function onScanSuccess(decodedText, decodedResult) {
  findScannedArticle(decodedText);
}

function findScannedArticle(decodedText) {
  console.log(`Code found : ${decodedText}`);

  axios
      .get(`https://world.openfoodfacts.org/api/v2/product/${decodedText}`)
      .then(response => {
        productImageUrl.value = response.data.product.selected_images.front.display.fr;
        productName.value = response.data.product.generic_name_fr;
        productName2.value = response.data.product.product_name_fr;
      })
      .catch(error => console.log(error));
}

</script>

<template>
  <div class="about pb-20">
    <div class="py-4">
      <div id="qrCodeScanner"></div>
      <br>
      <img :src="productImageUrl" alt="product image">


      <br>
      <div
          class="relative mb-3"
          id="datepicker-close-without-confirmation"
          data-te-input-wrapper-init>
        <input
            type="text"
            class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            data-te-datepicker-toggle-ref
            data-te-datepicker-toggle-button-ref/>
        <label
            for="floatingInput"
            class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Date de péremption</label
        >
      </div>


    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .about > div {
    text-align: center;
  }
}
</style>
