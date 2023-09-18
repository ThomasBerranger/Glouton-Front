<script setup>
import {onMounted, ref} from "vue";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {RouterLink} from "vue-router";

let products = ref([]);

let weekCategoryClosed = ref(true);
let monthCategoryClosed = ref(true);
let productsByCategory = ref({week: [], month: [], other: [], finished: []});

const db = getFirestore(getApp());
const q = query(collection(db, "products"), where("user", "==", getAuth().currentUser.uid));

onMounted(async () => {
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {

    const timeDifference = new Date(doc.data().expirationDate) - new Date();
    const remainingDays = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));

    switch (true) {
      case remainingDays < 7:
        productsByCategory.value.week.push({...doc.data(), ...{id: doc.id}});
        break;
      case remainingDays < 31:
        productsByCategory.value.month.push({...doc.data(), ...{id: doc.id}});
        break;
      default:
        productsByCategory.value.other.push({...doc.data(), ...{id: doc.id}});
        break
    }
  });

});
</script>

<template>
  <div class="my-5 bg-white shadow">
    <div class="flex justify-between p-3 items-center w-screen" @click="weekCategoryClosed = !weekCategoryClosed">
      <h2>Périmés dans la semaine <span class="text-xs">{{ productsByCategory.week.length }}</span></h2>
      <font-awesome-icon v-if="weekCategoryClosed" icon="fa-solid fa-chevron-down"></font-awesome-icon>
      <font-awesome-icon v-else icon="fa-solid fa-chevron-up"></font-awesome-icon>
    </div>

    <Transition mode="out-in">
      <div v-if="weekCategoryClosed" class="relative overflow-auto px-3">
        <div class="w-full flex gap-2 snap-x overflow-x-auto pb-5">
          <div v-for="product in productsByCategory.week" class="snap-start scroll-ml-6 shrink-0 relative">

            <RouterLink :to="'/product/' + product.id">
              <img class="relative h-20 mx-auto" :src="product.image">
            </RouterLink>

          </div>
        </div>
      </div>
      <div v-else class="w-screen flex flex-wrap px-2 pb-3">

        <RouterLink v-for="product in productsByCategory.week" :to="'/product/' + product.id">
          <img class="relative h-20 px-1 mb-2" :src="product.image">
        </RouterLink>

      </div>
    </Transition>
  </div>

  <div class="my-5 bg-white shadow">
    <div class="flex justify-between p-3 items-center w-screen" @click="monthCategoryClosed = !monthCategoryClosed">
      <h2>Périmés dans le mois <span class="text-xs">{{ productsByCategory.month.length }}</span></h2>
      <font-awesome-icon v-if="monthCategoryClosed" icon="fa-solid fa-chevron-down"></font-awesome-icon>
      <font-awesome-icon v-else icon="fa-solid fa-chevron-up"></font-awesome-icon>
    </div>

    <Transition mode="out-in">
      <div v-if="monthCategoryClosed" class="relative overflow-auto px-3">
        <div class="w-full flex gap-2 snap-x overflow-x-auto pb-5">
          <div v-for="product in productsByCategory.month" class="snap-start scroll-ml-6 shrink-0 relative">

            <RouterLink :to="'/product/' + product.id">
              <img class="relative h-20 mx-auto" :src="product.image">
            </RouterLink>

          </div>
        </div>
      </div>
      <div v-else class="w-screen flex flex-wrap px-2 pb-3">

        <RouterLink v-for="product in productsByCategory.month" :to="'/product/' + product.id">
          <img class="relative h-20 px-1 mb-2" :src="product.image">
        </RouterLink>

      </div>
    </Transition>
  </div>

  <div class="my-5 bg-white shadow">
    <div class="flex justify-between p-3 items-center w-screen" @click="monthCategoryClosed = !monthCategoryClosed">
      <h2>Périmés dans longtemps <span class="text-xs">{{ productsByCategory.other.length }}</span></h2>
      <font-awesome-icon v-if="monthCategoryClosed" icon="fa-solid fa-chevron-down"></font-awesome-icon>
      <font-awesome-icon v-else icon="fa-solid fa-chevron-up"></font-awesome-icon>
    </div>

    <Transition mode="out-in">
      <div v-if="monthCategoryClosed" class="relative overflow-auto px-3">
        <div class="w-full flex gap-2 snap-x overflow-x-auto pb-5">
          <div v-for="product in productsByCategory.other" class="snap-start scroll-ml-6 shrink-0 relative">

            <RouterLink :to="'/product/' + product.id">
              <img class="relative h-20 mx-auto" :src="product.image">
            </RouterLink>

          </div>
        </div>
      </div>
      <div v-else class="w-screen flex flex-wrap px-2 pb-3">

        <RouterLink v-for="product in productsByCategory.other" :to="'/product/' + product.id">
          <img class="relative h-20 px-1 mb-2" :src="product.image">
        </RouterLink>

      </div>
    </Transition>
  </div>

  <div class="h-20"></div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>