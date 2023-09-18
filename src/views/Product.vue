<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {doc, getDoc, getFirestore, updateDoc, deleteDoc} from "firebase/firestore";
import {getApp} from "firebase/app";
import router from "@/router";
import {Html5QrcodeScanner} from "html5-qrcode";
import {Datepicker, initTE, Input} from "tw-elements";
import {format, unFormat} from "@/helpers/date";
import EatButton from "@/components/EatButton.vue";

const db = getFirestore(getApp());
const route = useRoute();

let productId = ref('');
let product = ref({});

productId = route.params.id;

onMounted(async () => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    product.value = docSnap.data();
    product.value.expirationDate = unFormat(product.value.expirationDate);

    initTE({Datepicker, Input});

    const confirmDateOnSelect = document.getElementById('datepicker');
    new Datepicker(confirmDateOnSelect, {
      confirmDateOnSelect: true,
      disablePast: true,
      removeOkBtn: true,
      removeCancelBtn: true,
      removeClearBtn: true
    });
  } else {
    console.log("No such document!");
  }

});

async function editProduct() {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    name: product.value.name,
    expirationDate: format(product.value.expirationDate)
  });
}

async function deleteProduct() {
  await deleteDoc(doc(db, 'products', productId)).then(() => {
    router.push('/')
  });
}
</script>

<template>
  <section class="grid min-h-full place-items-center">

    <div v-show="Object.keys(product).length !== 0" class="w-screen">

      <img class="h-60 mx-auto px-2" :src="product.image" :alt="product.name"/>

      <div class="flex flex-wrap justify-center">
        <label for="first-name" class="block w-3/4 mt-4 text-sm font-medium leading-6 text-gray-900">Nom du
          produit</label>
        <input type="text" name="name" id="name" placeholder="Nom de l'article" v-model="product.name"
               @input="editProduct"
               class="block w-3/4 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"/>

        <div class="relative mt-5 w-3/4" id="datepicker" data-te-input-wrapper-init @input="editProduct">
          <input
              v-model='product.expirationDate'
              type="text"
              :class="{'border-2 border-rose-600': !product.expirationDate}"
              class="peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
              data-te-datepicker-toggle-ref
              data-te-datepicker-toggle-button-ref
              data-te-input-state-active/>
          <label
              for="floatingInput"
              class="font-medium pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
            Date de péremption
          </label>
        </div>

        <hr class="w-2/3 mx-auto my-5">
      </div>

      <div class="w-screen flex justify-around">
        <EatButton @click="deleteProduct"/>
      </div>

    </div>

  </section>
</template>

<style></style>