<script setup>
import {onMounted, ref, watch} from "vue";
import {collection, query, where, getDocs, getFirestore, doc, updateDoc} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import HorizontalList from "@/components/HorizontalLIst.vue";
import moment from "moment";
import {getNearestExpirationTimestampDate} from "@/functions/product";
import {Carousel, Slide} from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import store from "@/assets/store";

let productsByCategory = ref({
  week: {slideKey: 0, values: [], loading: true},
  month: {slideKey: 1, values: [], loading: true},
  other: {slideKey: 3, values: [], loading: true},
  finished: {slideKey: 2, values: [], loading: true}
});

const myCarousel = ref(null);

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

function handleSlideStart(data) {
  store.commit('changeActiveSlide', data.slidingToIndex);
}
</script>

<template>
  <section class="w-screen flex justify-evenly h-16 fixed z-10 white-background items-center">
    <button class="text-sm rounded-sm font-medium uppercase" @click="myCarousel.slideTo(0)"
            :class="[store.state.activeSlide === 0 ? 'text-white green-background px-4 py-2' : 'green-color bg-white px-2 py-2 tracking-wide ring-inset ring-1 green-ring']">
      Semaine
    </button>
    <button class="text-sm rounded-sm font-medium uppercase" @click="myCarousel.slideTo(1)"
            :class="[store.state.activeSlide === 1 ? 'text-white green-background px-4 py-2' : 'green-color bg-white px-2 py-2 tracking-wide ring-inset ring-1 green-ring']">
      Mois
    </button>
    <button class="text-sm rounded-sm font-medium uppercase" @click="myCarousel.slideTo(2)"
            :class="[store.state.activeSlide === 2 ? 'text-white green-background px-4 py-2' : 'green-color bg-white px-2 py-2 tracking-wide ring-inset ring-1 green-ring']">
      Année
    </button>
    <button class="text-sm rounded-sm font-medium uppercase" @click="myCarousel.slideTo(3)"
            :class="[store.state.activeSlide === 3 ? 'text-white green-background px-4 py-2' : 'green-color bg-white px-2 py-2 tracking-wide ring-inset ring-1 green-ring']">
      Terminé
    </button>
  </section>

  <Carousel ref="myCarousel" :items-to-show="1" @slide-start="handleSlideStart" :modelValue="store.state.activeSlide">
    <Slide v-for="category in productsByCategory" :key="category.slideKey" v-model="store.state.activeSlide">
      <HorizontalList :products="category"/>
    </Slide>
  </Carousel>

  <div class="h-20 w-screen white-background"></div>
</template>

<style>
.carousel {
  top: 4vh;
}

.carousel__slide {
  align-items: flex-start;
}
</style>