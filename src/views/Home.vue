<script setup>
import {onMounted, ref} from "vue";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import HorizontalList from "@/components/HorizontalLIst.vue";

let productsByCategory = ref({week: [], month: [], other: [], finished: []});

const db = getFirestore(getApp());
const q = query(collection(db, "products"), where("user", "==", getAuth().currentUser.uid));

onMounted(async () => {
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {

    const timeDifference = new Date(doc.data().expirationDate) - new Date();
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
        return b.finishedAt - a.finishedAt;
      })
    } else {
      productsByCategory.value[key].sort((a, b) => {
        return new Date(a.expirationDate) - new Date(b.expirationDate);
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