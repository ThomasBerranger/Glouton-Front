<script setup>
import {onMounted, ref} from "vue";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import HorizontalList from "@/components/HorizontalLIst.vue";
import moment from "moment";

let productsByCategory = ref({
  week: {values: [], loading: true},
  month: {values: [], loading: true},
  finished: {values: [], loading: true},
  other: {values: [], loading: true}
});

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
            return Math.min(...a.expirationDates.map(date => new Date(moment(date, 'L').format('YYYY-MM-DD')).getTime()))
                - Math.min(...b.expirationDates.map(date => new Date(moment(date, 'L').format('YYYY-MM-DD')).getTime()));
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
            return Math.min(...a.expirationDates.map(date => new Date(moment(date, 'L').format('YYYY-MM-DD')).getTime()))
                - Math.min(...b.expirationDates.map(date => new Date(moment(date, 'L').format('YYYY-MM-DD')).getTime()));
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
            return Math.min(...a.expirationDates.map(date => new Date(moment(date, 'L').format('YYYY-MM-DD')).getTime()))
                - Math.min(...b.expirationDates.map(date => new Date(moment(date, 'L').format('YYYY-MM-DD')).getTime()));
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
          return new Date(moment(b.finishedAt, 'DD/MM/YYYY').format('YYYY-MM-DD')) - new Date(moment(a.finishedAt, 'DD/MM/YYYY').format('YYYY-MM-DD'));
        })

        resolve();
      }).then(() => {
        productsByCategory.value.finished.loading = false;
      })
    }
);
</script>

<template>
  <HorizontalList :products="productsByCategory.week" category-name="Périme dans la semaine"/>
  <HorizontalList :products="productsByCategory.month" category-name="Périme dans le mois"/>
  <HorizontalList :products="productsByCategory.other" category-name="Périme dans longtemps"/>
  <HorizontalList :products="productsByCategory.finished" category-name="Terminé"/>

  <div class="h-20"></div>
</template>