<script setup>
import {onMounted, ref} from "vue";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import HorizontalList from "@/components/HorizontalLIst.vue";
import moment from "moment";

let productsByCategory = ref({week: [], month: [], other: [], finished: []});

const db = getFirestore(getApp());
const q = query(collection(db, "products"), where("user", "==", getAuth().currentUser.uid));

onMounted(async () => {
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const timeDifference = new Date(moment(doc.data().expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) - new Date();
    const remainingDays = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));

    switch (true) {
      case doc.data().finishedAt && doc.data().finishedAt !== null:
        productsByCategory.value.finished.push({...doc.data(), ...{id: doc.id}});
        break;
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

  for (const key in productsByCategory.value) {
    if (key === 'finished') {
      productsByCategory.value[key].sort((a, b) => {
        return new Date(moment(b.finishedAt, 'DD/MM/YYYY').format('YYYY-MM-DD')) - new Date(moment(a.finishedAt, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      })
    } else {
      productsByCategory.value[key].sort((a, b) => {
        return new Date(moment(a.expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) - new Date(moment(b.expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      })
    }
  }
});
</script>

<template>
  <HorizontalList :products="productsByCategory.week" category-name="Périme dans la semaine"/>
  <HorizontalList :products="productsByCategory.month" category-name="Périme dans le mois"/>
  <HorizontalList :products="productsByCategory.other" category-name="Périme dans longtemps"/>
  <HorizontalList :products="productsByCategory.finished" category-name="Terminé"/>

  <div class="h-20"></div>
</template>