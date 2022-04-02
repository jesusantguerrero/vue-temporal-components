<template>
  <div class="gant-vue">
    <div
      class="search-bar w-full text-left py-2 space-x-5 text-sm"
      v-if="showToolbar"
    >
      <input
        v-if="showSearch"
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
      <button
        class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none"
        @click="zoomOut"
        :disabled="!canZoomOut"
      >
        -
      </button>
      <button
        class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none"
        @click="zoomIn"
        :disabled="!canZoomIn"
      >
        +
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
      <div class="task-column border-r min-w-min">
        <div
          class="task-col__header h-14 bg-gray-100 text-gray-500 font-bold flex items-center justify-center"
        >
          Task Title
        </div>
        <div
          class="task-col__cell h-10 border-b-2 cursor-pointer"
          v-for="task in tasks"
          :key="task.id"
          @click="$emit('task-clicked', task)"
        >
          <div class="mx-2 text-left">
            {{ task.title }}
            <span class="text-sm font-bold" :class="focusedTextClass">
              {{ differenceInCalendarDays(task.end, task.start) }} days
            </span>
          </div>
        </div>
      </div>
      <div
        class="months flex w-full overflow-x-auto gantt-scroller"
        ref="gantDate"
      >
        <component
          :is="componentName"
          :year="year"
          :tasks="tasks"
          :focused-text-class="focusedTextClass"
          :marker-bg-class="markerBgClass"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import RoadmapViewWeek from "./RoadmapViewWeek.vue";
import RoadmapViewDays from "./RoadmapViewDays.vue";
import RoadmapViewMonth from "./RoadmapViewMonth.vue";

import { differenceInCalendarDays } from "date-fns";
import { computed, nextTick, onMounted, reactive, toRefs } from "vue";

defineProps({
  tasks: Array,
  focusedTextClass: {
    type: String,
    default: "text-blue-500",
  },
  showToolbar: {
    type: Boolean,
    default: false,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  markerBgClass: {
    type: String,
    default: "bg-red-500",
  },
});

const scrollToToday = (smooth) => {
  const day = document.querySelector(".marker-day");
  if (day && day.scrollIntoView) {
    day.scrollIntoView(
      smooth
        ? { behavior: "smooth", block: "center", inline: "center" }
        : { inline: "center" }
    );
  }
};

onMounted(() => {
  nextTick(() => {
    scrollToToday();
  });
});

const state = reactive({
  year: new Date(),
  viewType: "d",
  viewTypes: {
    d: "days",
    w: "week",
    m: "month",
  },
  modes: computed(() => {
    return Object.keys(state.viewTypes);
  }),
  currentMode: computed(() => {
    return state.modes.findIndex((mode) => mode == state.viewType);
  }),
  canZoomIn: computed(() => {
    return state.currentMode !== 0;
  }),
  canZoomOut: computed(() => {
    return state.currentMode !== state.modes.length - 1;
  }),

  componentName: computed(() => {
    const components = {
      d: RoadmapViewDays,
      w: RoadmapViewWeek,
      m: RoadmapViewMonth,
    };
    return components[state.viewType];
  }),
});

const zoomIn = () => {
  if (state.canZoomIn) {
    state.viewType = state.modes[state.currentMode - 1];
  }
};

const zoomOut = () => {
  if (state.canZoomOut) {
    state.viewType = state.modes[state.currentMode + 1];
  }
};

const { year, viewType, canZoomIn, canZoomOut, componentName } = toRefs(state);
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
