<template>
  <div
    class="relative text-left border-r task-col__header"
    v-for="week in mainIntervalTime"
    :key="week"
  >
    <span
      class="pl-2 text-sm font-bold text-gray-400"
      :class="{ [`${focusedTextClass} marker`]: isCurrentWeek(week) }"
    >
      {{ format(week, "MMM dd") }} - {{ format(addDays(week, 6), "MMM dd") }}
    </span>
    <div class="flex units">
      <div
        v-for="day in getDaysForInterval(week, addDays(week, 6))"
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
  format,
  startOfYear,
  endOfYear,
  isBefore,
  isAfter,
  addDays,
  isSameDay,
  isSameWeek,
  eachDayOfInterval,
  eachWeekOfInterval,
  isWeekend
} from "date-fns";
import { ref } from "vue";
import MarkerPoint from "./MarkerPoint.vue";

export default {
  name: "RoadmapViewWeek",
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
    const getDaysForInterval = (start, end) => {
      return eachDayOfInterval({
        start: start,
        end: end,
      });
    };

    const isCurrentWeek = (week) => {
      return isSameWeek(week, new Date());
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

    return {
      mainIntervalTime: eachWeekOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      }),
      isCurrentWeek,
      isCurrentDay,
      isHourBetween,
      isSameDay,
      isWeekend,
      format: format,
      addDays,
      gantDate,
      getDaysForInterval,
    };
  },
};
</script>
