<script setup>
import {useRoute} from "vue-router";
import router from "@/router";
import {onMounted, ref, watch} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {getApp} from "firebase/app";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {remove, update} from "@/functions/product";
import moment from "moment";
import EatButton from "@/components/EatButton.vue";
import NotificationContainer from "@/components/Notification/NotificationContainer.vue";
import DatepickerContainer from "@/components/Datepicker/DatepickerContainer.vue";
import ScoresValue from "@/components/ScoresValue.vue";

const db = getFirestore(getApp());
const route = useRoute();

let productId = ref('');
productId = route.params.id;

let product = ref({});
let displayDatepicker = ref(false);
let selectedExpirationDate = ref({key: null, value: null});
let notification = ref({show: false, message: '', timeout: 3000});

onMounted(async () => {
  getDoc(doc(db, "products", productId)).then((data) => {
    product.value = {...data.data(), id: data.id};
  })
});

watch(product, async () => {
  await update(product.value);
}, {deep: true})

async function finish() {
  product.value.finishedAt = moment().format('L');
  product.value.toPurchase = true;
  product.value.expirationDates.splice(1);

  update(product.value).then(() => {
    notification.value.show = true;
    notification.value.message = `${product.value.name} a été jouté à la liste de courses.`;
  })
}

async function updateShoppingList(add = true) {
  product.value.toPurchase = add;
  update(product.value).then(() => {
    notification.value.show = true;
    notification.value.message = `${product.value.name} a été ${add ? 'ajouté à' : 'retiré de'} la liste de courses.`;
  });
}

function refill() {
  product.value.finishedAt = false;
  product.value.toPurchase = false;

  update(product.value).then(() => {
    selectedExpirationDate.value.key = 0;
    selectedExpirationDate.value.value = product.value.expirationDates[0];
    displayDatepicker.value = true;
  })
}
</script>

<template>

  <NotificationContainer :notification="notification" @close="notification.show = false"/>

  <section v-if="! product.code"
           class="w-screen screen-height flex justify-center items-center">
    <font-awesome-icon icon="fa-solid fa-circle-notch" spin class="h-12"></font-awesome-icon>
  </section>
  <section v-else>
    <div class="bg-white py-5 w-screen">

      <h1 class="text-lg px-4 pb-4 truncate" @click="this.$router.go(-1)">
        <font-awesome-icon icon="fa-solid fa-arrow-left-long"></font-awesome-icon>
        {{ product.name }}
      </h1>

      <img class="w-1/3 mx-auto px-2" :src="product.image" :alt="product.name"/>

      <div class="flex flex-wrap justify-center">
        <label for="name" class="w-4/5 mt-4 text-sm font-medium leading-6 text-gray-900">Nom du
          produit</label>
        <input type="text" name="name" id="name" v-model="product.name"
               class="text-center w-4/5 mb-4 rounded-md border-0 p-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"/>

        <div v-if="!product.finishedAt" v-for="(expirationDate, key) in product.expirationDates" :key="key"
             class="w-4/5">
          <label v-if="key === 0" for="expirationDate"
                 class="w-4/5 text-sm font-medium leading-6 text-gray-900">
            Date{{ product.expirationDates.length > 1 ? 's' : null }} de péremption</label>
          <div class="h-8 mb-2 grid grid-cols-12">
            <input type="text" name="expirationDate" id="expirationDate" placeholder="? / ? / ?"
                   v-model="product.expirationDates[key]"
                   @click="displayDatepicker = true; selectedExpirationDate.key = key; selectedExpirationDate.value = product.expirationDates[key];"
                   readonly
                   :class="new Date((moment(expirationDate, 'L').format('YYYY-MM-DD'))) > new Date() ?
               (new Date((moment(expirationDate, 'L').subtract(1, 'week').format('YYYY-MM-DD'))) > new Date() ? null : 'bg-orange-200') : 'bg-red-200',
               product.expirationDates.length === 1 ? 'col-span-12 rounded-md' : 'col-span-10 rounded-tl-md rounded-bl-md'"
                   class="text-center shadow-md ring-1 ring-inset ring-gray-300 text-sm"/>
            <button v-if="product.expirationDates.length > 1" type="button"
                    @click="product.expirationDates.splice(key, 1);"
                    class="col-span-2 rounded-tr-md rounded-br-md shadow-md bg-red-400 text-sm font-semibold text-white">
              <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl"/>
            </button>
          </div>
        </div>

        <button v-if="!product.finishedAt" type="button"
                @click="
                  product.expirationDates.push(null);
                  displayDatepicker = true;
                  selectedExpirationDate.key = product.expirationDates.length-1;
                  selectedExpirationDate.value = product.expirationDates[product.expirationDates.length-1];
                "
                class="rounded-md shadow-md bg-amber-300 pt-1 mt-1 text-sm font-semibold text-white w-4/5">
          <font-awesome-icon icon="fa-solid fa-plus" class="text-xl"/>
        </button>

        <DatepickerContainer :display="displayDatepicker && product"
                             :date="selectedExpirationDate.value ?? moment().format('L')"
                             @update-date="(newDate) => { product.expirationDates[selectedExpirationDate.key] = newDate; displayDatepicker = false; }"/>

        <ScoresValue :product="product" class="mt-3 px-5"/>

        <label for="image" class="w-4/5 mt-2 text-sm font-medium leading-6 text-gray-900">Lien de
          l'image</label>
        <input type="text" name="image" id="image" v-model="product.image"
               class="w-4/5 rounded-md border-0 px-3 py-1.5 shadow-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6 truncate"/>

        <hr class="w-2/3 mx-auto my-5">
      </div>

      <div class="w-screen flex justify-evenly">
        <EatButton v-if="!product.finishedAt" @click="finish"/>
        <button v-else @click="updateShoppingList(!product.toPurchase)"
                class="rounded-md px-2.5 py-1.5 text-sm font-medium text-white shadow-sm"
                :class="[product.toPurchase ? 'bg-green-400' : 'bg-red-400']">
          <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
        </button>
        <button v-if="product.finishedAt" @click="refill"
                class="rounded-md border-2 px-2.5 py-1.5 text-sm font-medium shadow-sm">
          J'en ai acheté
        </button>
        <button class="rounded-md px-2.5 py-1.5 text-sm font-medium shadow-sm text-white black-background"
                @click="remove(product).then(() => router.push('/'))">
          <font-awesome-icon icon="fa-solid fa-trash"/>
        </button>
      </div>

    </div>

  </section>

  <div class="h-20"></div>
</template>