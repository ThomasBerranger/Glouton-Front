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
      let q = query(
          collection(db, "products"),
          where("user", "==", getAuth().currentUser.uid),
          where("finishedAt", "==", false),
          where('expirationDates', 'array-contains-any',
              Array.from({length: 7}, (_, index) => {
                return moment().add(index, 'day').format('DD/MM/YYYY');
              })
          )
      );

      let querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        productsByCategory.value.week.values.push({...doc.data(), id: doc.id});
      });

      productsByCategory.value.week.loading = false;

      q = query(
          collection(db, "products"),
          where("user", "==", getAuth().currentUser.uid),
          where("finishedAt", "==", false),
          where('expirationDates', 'array-contains-any',
              Array.from({length: 24}, (_, index) => {
                return moment().add(7 + index, 'day').format('DD/MM/YYYY');
              })
          ),
      );

      querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (new Date().getTime() > Math.min(...doc.data().expirationDates.map(date => new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()))) {
          productsByCategory.value.week.values.push({...doc.data(), id: doc.id});
        } else if (!productsByCategory.value.week.values.map(product => product.id).includes(doc.data().id)) {
          productsByCategory.value.month.values.push({...doc.data(), id: doc.id});
        }
      });

      productsByCategory.value.month.loading = false;

      q = query(collection(db, "products"),
          where("user", "==", getAuth().currentUser.uid),
          where("finishedAt", "!=", false)
      );

      querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        productsByCategory.value.finished.values.push({...doc.data(), id: doc.id});
      });

      productsByCategory.value.finished.loading = false;

      q = query(collection(db, "products"),
          where("user", "==", getAuth().currentUser.uid),
          where("id", "not-in", [
            ...productsByCategory.value.finished.values.map(product => product.id),
            ...productsByCategory.value.week.values.map(product => product.id),
            ...productsByCategory.value.month.values.map(product => product.id)
          ])
      );

      querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {

        if (new Date().getTime() > Math.min(...doc.data().expirationDates.map(date => new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()))) {
          productsByCategory.value.week.values.push({...doc.data(), id: doc.id});
        } else {
          productsByCategory.value.other.values.push({...doc.data(), id: doc.id});
        }
      });

      productsByCategory.value.other.loading = false;

      for (const key in productsByCategory.value) {
        if (key === 'finished') {
          productsByCategory.value[key].values.sort((a, b) => {
            return new Date(moment(b.finishedAt, 'DD/MM/YYYY').format('YYYY-MM-DD')) - new Date(moment(a.finishedAt, 'DD/MM/YYYY').format('YYYY-MM-DD'));
          })
        } else {
          productsByCategory.value[key].values.sort((a, b) => {
            return Math.min(...a.expirationDates.map(date => new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()))
                - Math.min(...b.expirationDates.map(date => new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()));
          })
        }
      }
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