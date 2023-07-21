<script setup>
import {onMounted, ref} from "vue";
import {Html5QrcodeScanner} from 'html5-qrcode';
import axios from "axios";

let productImageUrl = ref('');

onMounted(() => {
  const html5QrcodeScanner = new Html5QrcodeScanner(
      'qrCodeScanner',
      {
        fps: 10,
        qrbox: 250,
      }
  );

  html5QrcodeScanner.render(onScanSuccess);
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
      })
      .catch(error => console.log(error));
}

</script>

<template>
  <div class="about">
    <div>
      <h1>Scan or logout</h1>
      <div id="qrCodeScanner"></div>
      <br>
      <img :src="productImageUrl" alt="product image">
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
