<script setup>
import {computed, ref} from "vue";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps(['date']);

let firstDayOfSelectedMonth = ref(moment(props.date).startOf('month').format('YYYY-MM-DD'));

let month = computed(() => {
  return moment(firstDayOfSelectedMonth.value).format('MMMM');
});
let year = computed(() => {
  return moment(firstDayOfSelectedMonth.value).format('YYYY');
});

const days = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

let calendarData = computed(() => {
  return {
    firstDayInCalendar: moment(firstDayOfSelectedMonth.value).startOf("month").subtract(moment(firstDayOfSelectedMonth.value).startOf('month').weekday(), 'days'),
    selectedMonth: moment(firstDayOfSelectedMonth.value).format('MMMM')
  };
})

const calendar = computed(() => {
  const tempCalendar = [];

  let tempFirstDayInCalendar = moment(calendarData.value.firstDayInCalendar);

  for (let i = 0; i < 42; i++) {
    tempCalendar.push({
      value: tempFirstDayInCalendar.format('D'),
      currentDay: tempFirstDayInCalendar.format('L') === moment().format('L'),
      selectedMonth: tempFirstDayInCalendar.format('MMMM') === calendarData.value.selectedMonth,
      selected: tempFirstDayInCalendar.format('L') === moment(props.date).format('L')
    });

    tempFirstDayInCalendar.add(1, 'day');
  }

  return tempCalendar;
});

function changeMonth(next = true) {
  if (next) {
    firstDayOfSelectedMonth.value = moment(firstDayOfSelectedMonth.value).add(1, 'month').format('YYYY-MM-DD')
  } else {
    firstDayOfSelectedMonth.value = moment(firstDayOfSelectedMonth.value).subtract(1, 'month').format('YYYY-MM-DD')
  }
}
</script>

<template>
  <section>
    <div class="absolute top-0 left-0 w-screen bg-black opacity-80 screen-height"></div>
    <div class="absolute top-0 left-0 w-screen screen-height flex flex-1 flex-col justify-center">

      <div class="w-4/5 mx-auto bg-white rounded">

        <div class="flex justify-between items-center p-3">

          <h2 class="text-xl text-gray-900 capitalize">{{ month }} {{ year }}</h2>
          <div>
            <button type="button" class="text-sm text-gray-500 px-1.5" @click="changeMonth(false)">
              <font-awesome-icon icon="fa-solid fa-chevron-left"/>
            </button>
            <button type="button" class="text-sm text-gray-500 px-1.5" @click="changeMonth">
              <font-awesome-icon icon="fa-solid fa-chevron-right"/>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          <p v-for="day in days">{{ day }}</p>
        </div>


        <div class="mt-2 grid grid-cols-7 text-center text-sm">
          <div v-for="(day, dayIdx) in calendar" :class="[dayIdx > 6 && 'border-t border-gray-200', 'py-2']">

            <button type="button" class="mx-auto flex h-8 w-8 items-center justify-center"
                    :class="[
                  day.selected && 'rounded-full bg-gray-900 font-semibold text-white',
                  day.currentDay && 'text-indigo-600 font-bold',
                  !day.currentDay && !day.selected && day.selectedMonth && 'text-gray-900',
                  !day.currentDay && !day.selected && !day.selectedMonth && 'text-gray-400',
                ]">
              {{ day.value }}
            </button>

          </div>
        </div>


      </div>

    </div>
  </section>
</template>
