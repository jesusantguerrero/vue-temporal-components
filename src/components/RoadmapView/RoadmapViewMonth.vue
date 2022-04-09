<template>
  <div
    class="task-col__header border-r text-left relative"
    v-for="month in months"
    :key="month"
  >
    <span
      class="font-bold text-gray-400 pl-2 text-sm"
      :class="{ [`${focusedTextClass} marker`]: isCurrentMonth(month) }"
    >
      {{ format(month, "MMM yyyy") }}
    </span>
    <div class="units flex">
      <div
        v-for="day in getDaysForMonth(month)"
        :key="day"
        class="w-2 text-center"
        :class="{
          'marker-day font-bold': isCurrentDay(day),
        }"
      >
        <span
          class="inline-block h-6 text-gray-400 text-xs w-full"
          :class="{
            'fix-day-height': isCurrentDay(day),
          }"
        >
          {{ isCurrentDay(day) ? "T" : "" }}
        </span>
        <!-- Task Cells -->
        <div class="units-body">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="border-t border-b h-10 w-full relative"
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
import { scrollToToday } from "./utils";

export default {
  name: "RoadmapViewMonth",
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
      format: format,
      gantDate,
      getDaysForMonth,
      scrollToToday,
    };
  },
};
</script>

<style scoped lang="scss">
.fix-day-height {
  margin-bottom: 2px;
}
</style>
