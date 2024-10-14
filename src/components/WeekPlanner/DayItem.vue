<template>
  <div class="relative w-full" :key="day">
    <DatePoint
      v-for="item in itemsOfDay"
      :key="item.id"
      :item="item"
      :day="day"
      @update="emit('update', item)"
      @update:soft="emit('update:soft', $event)"
      class="cursor-pointer"
    />
    <HourPoint v-if="isCurrentDay" color-class="bg-red-500" :is-marked="true" />
    <div
      @click="emitCreatePoint(hour)"
      v-for="hour in hoursOfDay"
      :key="hour"
      :title="hour"
      class="relative flex items-center justify-center w-full px-5 py-1 transition border cursor-pointer"
      :style="hourClass"
      :class="[cellClass, getSpecialHourClass(hour)]"

    >
      <div class="absolute -left-5 -top-2.5 text-xs z-20" v-if="isFirstDay">
        {{ formatHour(hour) }} 
      </div>
      <span v-if="options.showTimeInCells" class="text-xm">
        {{ formatHour(hour) }} 
      </span>
    </div>
  </div>
</template>

<script setup>
import { addHours, addMinutes, format, isToday, startOfDay } from "date-fns";
import { computed, inject, provide, ref } from "vue";
import { useDateTime } from "../../composables/useDateTime";
import DatePoint from "./DatePoint.vue";
import { useTimeGrid } from "../../composables/useTimeGrid";
import HourPoint from "./HourPoint.vue";

const props = defineProps({
  day: {
    type: Date,
    default: () => new Date(),
  },
  dayIndex: {
    type: Number,
    default: () => 0,
  },
  items: {
    type: Array,
    default: () => [],
  },
  cellClass: {
    type: String,
    default: "bg-gray-50 hover:bg-gray-100"
  }
});

const emit = defineEmits(["create", "update", "update:soft", "delete"]);
const options = inject("options", {});

const timeFrom = options.timeFrom ?? 0;
const timeTo = options.timeTo ?? 24 * 60;
const timeStep = options.timeStep ?? 60;

const hoursOfDay = computed(() => {
  const hours = []
  for (let index = timeFrom; index < timeTo; index+=timeStep) {
    hours.push(index);
    
  }
  return hours;
});

const defaultMinutes = ref(60);
const { pixelMinutes } = useTimeGrid(defaultMinutes, props.day);
const hourClass = computed(() => {
  return {
    height: `${pixelMinutes.value}px`,
  };
});

const itemsOfDay = computed(() => {
  const { formatDate } = useDateTime();
  return props.items.filter((item) => {
    return formatDate(new Date(item.startTime)) == formatDate(props.day);
  });
});

const isFirstDay = computed(() => {
  return options.time && props.dayIndex == 0;
});


const formatHour = (minutes) => {
  return format(addMinutes(startOfDay(new Date()), minutes), 'HH:mm')
};

const isCurrentDay = computed(() => {
  return isToday(props.day);
});

const dayKey = computed(() => {
  return props.day.getDay()
})


const getSpecialHourClass = (minutes) => {
  const daySpacialHours = options.specialHours[dayKey.value] 
  if (!daySpacialHours) return false;
  return daySpacialHours.find(range =>  minutes >= range.from  &&  minutes <= range.to )?.class;
}

provide("day", props.day);

const emitCreatePoint = (hour) => {
  let startTime = props.day;
  startTime.setHours(hour, 0, 0, 0);
  const endTime = addHours(startTime, 1);

  const draftItem = {
    id: "new",
    title: "(no title)",
    description: "(no description)",
    startTime: startTime,
    endTime: endTime,
    startDate: props.day,
    endDate: props.day,
  };

  emit("create", draftItem);
};
</script>
