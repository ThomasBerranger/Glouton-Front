<script setup>
import {computed, ref} from "vue";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps(['date']);

let firstDayOfSelectedMonth = ref(moment(props.date, 'DD-MM-YYYY', 'DD-MM-YYYY').startOf('month').format('YYYY-MM-DD'));

// Computed properties
let selectedMonth = computed(() => {
  return {
    name: moment(firstDayOfSelectedMonth.value).format('MMMM'),
    number: parseInt(moment(firstDayOfSelectedMonth.value).format('M'))
  };
});
let selectedYear = computed(() => {
  return parseInt(moment(firstDayOfSelectedMonth.value).format('YYYY'));
});
let selectableYears = computed(() => {
  let tempSelectableDates = [];

  for (let i = 0; i <= 3; i++) {
    tempSelectableDates.unshift(selectedYear.value - i);
  }
  for (let i = 1; i <= 100; i++) {
    tempSelectableDates.push(selectedYear.value + i);
  }

  return tempSelectableDates;
})

// Calendar constants
const days = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const months = {
  1: 'Janvier',
  2: 'Février',
  3: 'Mars',
  4: 'Avril',
  5: 'Mai',
  6: 'Juin',
  7: 'Juillet',
  8: 'Août',
  9: 'Septembre',
  10: 'Octobre',
  11: 'Novembre',
  12: 'Décembre'
};

// Calendar display booleans
let showMonths = ref(false);
let showYears = ref(false);

// Calendar configuration data
let calendarData = computed(() => {
  return {
    firstDayInCalendar: moment(firstDayOfSelectedMonth.value).startOf("month").subtract(moment(firstDayOfSelectedMonth.value).startOf('month').weekday(), 'days'),
    selectedMonth: moment(firstDayOfSelectedMonth.value).format('MMMM')
  };
})

// Calendar
const calendar = computed(() => {
  const tempCalendar = [];

  let tempFirstDayInCalendar = moment(calendarData.value.firstDayInCalendar);

  for (let i = 0; i < 42; i++) {
    tempCalendar.push({
      date: tempFirstDayInCalendar.format('L'),
      dayNumber: tempFirstDayInCalendar.format('D'),
      currentDay: tempFirstDayInCalendar.format('L') === moment().format('L'),
      selectedMonth: tempFirstDayInCalendar.format('MMMM') === calendarData.value.selectedMonth,
      selected: tempFirstDayInCalendar.format('L') === moment(props.date, 'DD-MM-YYYY').format('L')
    });

    tempFirstDayInCalendar.add(1, 'day');
  }

  return tempCalendar;
});

// Functions
function changeYear(newYear) {
  firstDayOfSelectedMonth.value = moment(firstDayOfSelectedMonth.value).add(newYear - moment(firstDayOfSelectedMonth.value).year(), 'year').format('YYYY-MM-DD');

  showYears.value = false;
  showMonths.value = true;
}

function changeMonth(newMonthSameYear, next = true) {
  if (newMonthSameYear) {
    firstDayOfSelectedMonth.value = moment(firstDayOfSelectedMonth.value).month(newMonthSameYear - 1).format('YYYY-MM-DD')
  } else if (next) {
    firstDayOfSelectedMonth.value = moment(firstDayOfSelectedMonth.value).add(1, 'month').format('YYYY-MM-DD')
  } else {
    firstDayOfSelectedMonth.value = moment(firstDayOfSelectedMonth.value).subtract(1, 'month').format('YYYY-MM-DD')
  }

  showMonths.value = false;
}
</script>

<template>
  <section>
    <div class="absolute top-0 left-0 w-screen bg-black opacity-80 screen-height" @click="$emit('updateDate', props.date, 'DD-MM-YYYY')"></div>
    <div class="absolute-center w-10/12 mx-auto bg-white rounded">

      <div class="flex justify-between items-center p-3">
        <h2 class="text-xl text-gray-900 capitalize">
          <span @click="showMonths = !showMonths; showYears = false">{{ selectedMonth.name }}</span>
          <span @click="showYears = !showYears; showMonths = false" class="pl-2">{{ selectedYear }}</span>
        </h2>
        <div>
          <button type="button" class="text-sm text-gray-500 px-1.5" @click="changeMonth(null, false)">
            <font-awesome-icon icon="fa-solid fa-chevron-left"/>
          </button>
          <button type="button" class="text-sm text-gray-500 px-1.5" @click="changeMonth(null)">
            <font-awesome-icon icon="fa-solid fa-chevron-right"/>
          </button>
        </div>
      </div>

      <Transition mode="out-in">
        <div v-if="!showMonths && !showYears" class="grid grid-cols-7 text-center text-xs">
          <p v-for="day in days" :key="day">{{ day }}</p>

          <div v-for="(day, dayIdx) in calendar" :key="day.date"
               :class="[dayIdx > 6 && 'border-t border-gray-200', 'py-2']">
            <button type="button" class="mx-auto flex h-8 w-8 items-center justify-center"
                    :class="[
                  day.selected && day.currentDay && 'rounded-full bg-red-500 text-red-900',
                  day.selected && 'rounded-full bg-red-400 font-semibold text-white',
                  day.currentDay && 'text-indigo-600 font-bold',
                  !day.currentDay && !day.selected && day.selectedMonth && 'text-gray-900',
                  !day.currentDay && !day.selected && !day.selectedMonth && 'text-gray-400',
                ]"
                    @click="$emit('updateDate', day.date)">
              {{ day.dayNumber }}
            </button>
          </div>
        </div>

        <div v-else-if="showMonths" class="mt-2 grid grid-cols-3 gap-2 px-2 text-center text-sm">
          <div v-for="(month, monthNumber) in months" :key="month" class="my-2 py-2 rounded-lg ring-inset"
               :class="[selectedMonth.number === parseInt(monthNumber) ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-300']"
               @click="changeMonth(monthNumber)">
            {{ month }}
          </div>
        </div>

        <div v-else-if="showYears" class="mt-1 text-center text-lg h-60 overflow-auto">
          <ul>
            <li v-for="year in selectableYears" :key="year" @click="changeYear(year)" class="py-0.5"
                :class="{'font-bold text-indigo-600' : year === selectedYear}">{{ year }}
            </li>
          </ul>
        </div>
      </Transition>

    </div>

  </section>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>