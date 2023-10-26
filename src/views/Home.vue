<script setup>
import {onMounted, ref} from "vue";
import {collection, query, where, getDocs, getFirestore, doc, updateDoc} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import HorizontalList from "@/components/HorizontalLIst.vue";
import moment from "moment";
import {getNearestExpirationTimestampDate} from "@/functions/product";

let productsByCategory = ref({
  week: {values: [], loading: true},
  month: {values: [], loading: true},
  finished: {values: [], loading: true},
  other: {values: [], loading: true}
});
let selectedCategory = ref('week');

const db = getFirestore(getApp());

onMounted(async () => {
      // Get all unfinished products
      new Promise(async (resolve) => {
        const unfinishedProducts = [];
        const querySnapshot = await getDocs(
            query(
                collection(db, "products"),
                where("user", "==", getAuth().currentUser.uid),
                where("finishedAt", "==", false),
            )
        );

        querySnapshot.forEach((doc) => {
          unfinishedProducts.push({...doc.data(), id: doc.id});
        });

        resolve(unfinishedProducts);
      }).then((unfinishedProducts) => {
        // Fill week products category
        new Promise((resolve) => {
          productsByCategory.value.week.values = unfinishedProducts.filter(product =>
              moment().add(1, 'week').valueOf() >= Math.min(...product.expirationDates.map(date => moment(date, 'L').valueOf()))
          )

          productsByCategory.value.week.values.sort((a, b) => {
            return getNearestExpirationTimestampDate(a) - getNearestExpirationTimestampDate(b);
          })

          resolve();
        }).then(() => {
          productsByCategory.value.week.loading = false
        });
        // Fill month products category
        new Promise((resolve) => {
          productsByCategory.value.month.values = unfinishedProducts.filter(product =>
              moment().add(1, 'week').valueOf() < Math.min(...product.expirationDates.map(date => moment(date, 'L').valueOf()))
              && moment().add(1, 'month').valueOf() >= Math.min(...product.expirationDates.map(date => moment(date, 'L').valueOf()))
          )

          productsByCategory.value.month.values.sort((a, b) => {
            return getNearestExpirationTimestampDate(a) - getNearestExpirationTimestampDate(b);
          })

          resolve();
        }).then(() => {
          productsByCategory.value.month.loading = false
        });
        // Fill other products category
        new Promise((resolve) => {
          productsByCategory.value.other.values = unfinishedProducts.filter(product =>
              moment().add(1, 'month').valueOf() < Math.min(...product.expirationDates.map(date => moment(date, 'L').valueOf()))
          )

          productsByCategory.value.other.values.sort((a, b) => {
            return getNearestExpirationTimestampDate(a) - getNearestExpirationTimestampDate(b);
          })

          resolve();
        }).then(() => {
          productsByCategory.value.other.loading = false
        });
      })

      // Get finished products and fill category
      new Promise(async (resolve) => {
        const notFinishedProductsQuerySnapshot = await getDocs(
            query(
                collection(db, "products"),
                where("user", "==", getAuth().currentUser.uid),
                where("finishedAt", "!=", false),
            )
        );

        notFinishedProductsQuerySnapshot.forEach((doc) => {
          productsByCategory.value.finished.values.push({...doc.data(), id: doc.id});
        });

        productsByCategory.value.finished.values.sort((a, b) => {
          return new Date(moment(b.finishedAt, 'L').format('YYYY-MM-DD')) - new Date(moment(a.finishedAt, 'L').format('YYYY-MM-DD'));
        })

        resolve();
      }).then(() => {
        productsByCategory.value.finished.loading = false;
      })
    }
);
</script>

<template>
  <div class="h-5"></div>


  <div class="w-screen flex justify-evenly">
    <button class="text-sm rounded-sm font-medium uppercase" @click="selectedCategory = 'week'"
            :class="[selectedCategory === 'week' ? 'text-white green-background px-4 py-1.5' : 'green-color bg-white px-2 py-1.5 tracking-wide ring-inset ring-1 green-ring']">
      Semaine
    </button>
    <button class="text-sm rounded-sm font-medium uppercase" @click="selectedCategory = 'month'"
            :class="[selectedCategory === 'month' ? 'text-white green-background px-4 py-1.5' : 'green-color bg-white px-2 py-1.5 tracking-wide ring-inset ring-1 green-ring']">
      Mois
    </button>
    <button class="text-sm rounded-sm font-medium uppercase" @click="selectedCategory = 'other'"
            :class="[selectedCategory === 'other' ? 'text-white green-background px-4 py-1.5' : 'green-color bg-white px-2 py-1.5 tracking-wide ring-inset ring-1 green-ring']">
      Année
    </button>
    <button class="text-sm rounded-sm font-medium uppercase" @click="selectedCategory = 'finished'"
            :class="[selectedCategory === 'finished' ? 'text-white green-background px-4 py-1.5' : 'green-color bg-white px-2 py-1.5 tracking-wide ring-inset ring-1 green-ring']">
      Terminé
    </button>
  </div>

  <Transition mode="out-in">
    <HorizontalList v-if="selectedCategory === 'week'" :products="productsByCategory.week"/>
    <HorizontalList v-else-if="selectedCategory === 'month'" :products="productsByCategory.month"/>
    <HorizontalList v-else-if="selectedCategory === 'other'" :products="productsByCategory.other"/>
    <HorizontalList v-else :products="productsByCategory.finished"/>
  </Transition>

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