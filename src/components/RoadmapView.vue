<template>
  <div class="gant-vue">
    <div class="search-bar border w-full text-left py-2 space-x-5 text-sm">
      <input
        type="search"
        class="px-4 w-4/12 focus:outline-none border-r-2"
        placeholder="Search by task name or custom field value"
      />
      <button
        class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none"
        @click="scrollToToday(true)"
      >
        Today
      </button>
      <button class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none">
        +
      </button>
      <button class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none">
        -
      </button>
      <select
        class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none"
        v-model="viewType"
      >
        <option value="d">Day</option>
        <option value="w">Week</option>
        <option value="m">Month</option>
      </select>
    </div>
    <div class="custom-table flex w-full overflow-hidden border-t">
      <div class="task-column w-52">
        <div class="task-col__header h-14 bg-gray-200">Task Title</div>
        <div
          class="task-col__cell h-10 border-b-2"
          v-for="task in tasks"
          :key="task.id"
        >
          {{ task.title }}
        </div>
      </div>
      <div
        class="months flex w-full overflow-x-auto gantt-scroller"
        ref="gantDate"
      >
        <template v-if="viewType == 'w'">
          <roadmap-view-week
            :year="year"
            :tasks="tasks"
            :focused-text-class="focusedTextClass"
            :marker-bg-class="markerBgClass"
          />
        </template>
        <template v-else-if="viewType == 'm'">
          <roadmap-view-month
            :year="year"
            :tasks="tasks"
            :focused-text-class="focusedTextClass"
            :marker-bg-class="markerBgClass"
          />
        </template>
        <template v-else>
          <roadmap-view-days
            :year="year"
            :tasks="tasks"
            :focused-text-class="focusedTextClass"
            :marker-bg-class="markerBgClass"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { startOfMonth, isSameMonth, isBefore, isAfter } from "date-fns";
import format from "date-fns/format";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import endOfMonth from "date-fns/endOfMonth";
import isSameDay from "date-fns/fp/isSameDay";
import { nextTick, onMounted, reactive, toRefs } from "vue";
import RoadmapViewWeek from "./RoadmapViewWeek.vue";
import RoadmapViewDays from "./RoadmapViewDays.vue";

export default {
  name: "RoadmapView",
  props: {
    tasks: Array,
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
    RoadmapViewWeek,
    RoadmapViewDays,
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

    const scrollToToday = (smooth) => {
      const day = document.querySelector(".marker-day");
      day.scrollIntoView(
        smooth
          ? { behavior: "smooth", block: "center", inline: "start" }
          : { inline: "center" }
      );
    };

    onMounted(() => {
      nextTick(() => {
        scrollToToday();
      });
    });

    const state = reactive({
      year: new Date(),
      viewType: "d",
    });

    return {
      ...toRefs(state),
      isCurrentMonth,
      isCurrentDay,
      isHourBetween,
      isSameDay,
      format: format,
      getDaysForMonth,
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
