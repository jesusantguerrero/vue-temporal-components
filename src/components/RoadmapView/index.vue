<template>
  <div class="gant-vue">
    <div
      class="flex justify-between w-full py-2 space-x-5 text-sm text-left search-bar"
      v-if="showToolbar"
    >
      <div class="">
        <input
          v-if="showSearch"
          type="search"
          class="w-4/12 px-4 border-r-2 focus:outline-none"
          placeholder="Search by task name or custom field value"
        />
        <button
          class="px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none"
          @click="scrollToToday(true)"
        >
          Today
        </button>
        <button
          class="px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none"
          @click="zoomOut"
          :disabled="!canZoomOut"
        >
          -
        </button>
        <button
          class="px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none"
          @click="zoomIn"
          :disabled="!canZoomIn"
        >
          +
        </button>
        <select
          class="px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none"
          v-model="viewType"
        >
          <option value="d">Day</option>
          <option value="w">Week</option>
          <option value="m">Month</option>
        </select>
      </div>
      <div>
        <slot name="actionsRight"></slot>
      </div>
    </div>
    <div class="flex w-full overflow-hidden border-t custom-table">
      <div class="border-r task-column min-w-fit">
        <div
          class="flex items-center justify-center font-bold text-gray-500 bg-gray-100 task-col__header h-14"
        >
          Task Title
        </div>
        <div
          class="h-10 border-b-2 cursor-pointer min-w-max task-col__cell"
          v-for="task in tasks"
          :key="task.id"
          @click="$emit('task-clicked', task)"
        >
          <slot
            name="description"
            :item="task"
            :focused-text-class="focusedTextClass"
            :diference-in-calendar-days="
              differenceInCalendarDays(task.end, task.start)
            "
          >
            <div class="mx-2 text-left">
              {{ task.title }}
              <span class="text-sm font-bold" :class="focusedTextClass">
                {{ differenceInCalendarDays(task.end, task.start) }} days
              </span>
            </div>
          </slot>
        </div>
      </div>
      <div
        class="flex w-full overflow-x-auto months gantt-scroller"
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
import { scrollToToday } from "./utils";

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

<style lang="scss">
.gantt-scroller {
  &::-webkit-scrollbar-thumb {
    background-color: transparentize($color: #000000, $amount: 0.7);
    border-radius: 4px;
    cursor: pointer;

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
