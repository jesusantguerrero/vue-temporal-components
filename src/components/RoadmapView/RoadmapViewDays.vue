<template>
  <div
    class="relative text-left border-r task-col__header"
    v-for="month in months"
    :key="month"
  >
    <span
      class="pl-2 text-sm font-bold text-gray-400"
      :class="{ [`${focusedTextClass} marker`]: isCurrentMonth(month) }"
    >
      {{ format(month, "MMM yyyy") }}
    </span>
    <div class="flex units">
      <div
        v-for="day in getDaysForMonth(month)"
        :key="day"
        class="w-10 text-center"
        :class="{
          'text-blue-400 marker-day font-bold': isCurrentDay(day),
          'bg-gray-100 font-bold': isWeekend(day),
        }"
      >
        <span
          class="inline-block w-full pb-2 text-sm text-gray-400"
          :class="{
            [`${focusedTextClass} font-bold`]: isCurrentDay(day),
          }"
        >
          {{ format(day, "dd") }}
        </span>
        <!-- Task Cells -->
        <div class="units-body">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="relative w-full h-10 border"
          >
            <marker-point
              :marker-bg-class="task.colorClass || markerBgClass"
              :is-left-side="isSameDay(task.start, day)"
              :is-right-side="isSameDay(task.end, day)"
              :title="`${task.title} ${format(task.start, 'dd')}`"
              v-if="isHourBetween(task.start, task.end, day)"
            ></marker-point>
          </div>
        </div>
        <!-- Task cells -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  startOfMonth,
  isSameMonth,
  isBefore,
  isAfter,
} from "date-fns";
import format from "date-fns/format";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import endOfMonth from "date-fns/endOfMonth";
import isSameDay from "date-fns/fp/isSameDay";
import { nextTick, onMounted, ref } from "vue";
import MarkerPoint from "./MarkerPoint.vue";
import isWeekend from "date-fns/isWeekend";
import { scrollToToday } from "./utils";

export default {
  name: "RoadmapViewDays",
  props: {
    tasks: Array,
    year: Date,
    focusedTextClass: {
      type: String,
      default: "text-blue-500",
    },
    markerBgClass: {
      type: String,
      default: "bg-red-500",
    },
  },
  components: {
    MarkerPoint,
  },
  setup() {
    const getDaysForMonth = (month) => {
      return eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      });
    };

    const isCurrentMonth = (month) => {
      return isSameMonth(month, new Date());
    };

    const isCurrentDay = (day) => {
      return isSameDay(day, new Date());
    };

    const isHourBetween = (start, end, date) => {
      return (
        (isAfter(date, start) && isBefore(date, end)) ||
        isSameDay(date, start) ||
        isSameDay(end, date)
      );
    };

    const gantDate = ref(null);

    onMounted(() => {
      nextTick(() => {
        scrollToToday();
      });
    });

    return {
      months: eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      }),
      isCurrentMonth,
      isCurrentDay,
      isHourBetween,
      isSameDay,
      isWeekend,
      format: format,
      gantDate,
      getDaysForMonth,
      scrollToToday,
    };
  },
};
</script>
