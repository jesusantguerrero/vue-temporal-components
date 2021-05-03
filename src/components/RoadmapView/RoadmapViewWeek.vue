<template>
  <div
    class="task-col__header border-r text-left relative"
    v-for="week in mainIntervalTime"
    :key="week"
  >
    <span
      class="font-bold text-gray-400 pl-2 text-sm"
      :class="{ [`${focusedTextClass} marker`]: isCurrentWeek(week) }"
    >
      {{ format(week, "MMM dd") }} - {{ format(addDays(week, 6), "MMM dd") }}
    </span>
    <div class="units flex">
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
          class="inline-block pb-2 text-gray-400 text-sm w-full"
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
            class="border h-10 w-full relative"
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
import { nextTick, onMounted, ref } from "vue";
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

    const scrollToToday = (smooth) => {
      const day = document.querySelector(".marker-day");
      day.scrollIntoView(
        smooth
          ? { behavior: "smooth", block: "center", inline: "start" }
          : { inline: "center" }
      );
    };

    const gantDate = ref(null);

    onMounted(() => {
      nextTick(() => {
        scrollToToday();
      });
    });

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
      scrollToToday,
    };
  },
};
</script>

<style scoped lang="scss">
.gantt-scroller {
  &::-webkit-scrollbar-thumb {
    background-color: transparentize($color: #000000, $amount: 0.7);
    border-radius: 4px;

    &:hover {
      background-color: transparentize($color: #000000, $amount: 0.7);
    }
  }

  &::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
    height: 5px;
  }

  &-slim {
    transition: all ease 0.3s;
    &::-webkit-scrollbar {
      height: 0;
    }

    &:hover {
      &::-webkit-scrollbar {
        height: 3px;
      }
    }
  }
}
</style>
