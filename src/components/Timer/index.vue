<template>
  <div
    class="flex items-center justify-center font-bold"
    :class="[
      isMini
        ? 'flex-row space-x-5'
        : 'flex-col space-y-4 rounded-md text-2xl py-4',
    ]"
  >
    <div
      class="text-md"
      :class="[ui.trackerMode.color, ui.trackerMode.colorBorder]"
    >
      {{ ui.trackerMode.text }}
    </div>

    <div class="flex items-center">
      <button
        v-if="!isMini"
        class="flex items-center justify-center text-4xl text-gray-400 rounded-full focus:outline-none h-14 w-14"
        :class="{ 'hover:bg-gray-100': ui.hasPrevMode }"
        @click="controls.prevMode"
        :disabled="!ui.hasPrevMode"
      >
        <icon-sharp-chevron-left />
      </button>
      <div
        class="flex items-center justify-center cursor-pointer"
        @click="controls.toggleTracker"
        :class="[
          ui.trackerMode.color,
          ui.trackerMode.colorBorder,
          isMini
            ? 'w-20 flex-row-reverse'
            : 'h-52 w-52 rounded-full flex-col space-y-3 border-2',
        ]"
        data-test-id="btn-play"
        title="Click here to start"
      >
        <div data-test-id="current-time"
          class="select-none"
          :class="[isMini ? 'w-full text-center text-2xl' : 'text-5xl']"
        >
          {{ ui.currentTime }}
          <div class="flex w-full h-1" :class="[isMini ? '' : 'mt-2']">
            <div
              v-for="(stage, index) in ui.promodoroTotal"
              :title="`Round ${index + 1}: ${stage.name}`"
              class="w-full h-1 mr-1 cursor-pointer bg-red hover:ring hover:ring-offset-1"
              :class="[
                state.currentStep >= stage.originalIndex
                  ? ui.currentStateColor
                  : 'bg-gray-200',
              ]"
              :key="stage.name"
            />
          </div>
        </div>

        <div :class="[isMini ? 'mr-1 text-4xl' : 'text-5xl']">
          <component :is="trackerIcon" />
        </div>
      </div>
      <button
        v-if="!isMini"
        class="flex items-center justify-center text-4xl text-gray-400 rounded-full hover:bg-gray-100 focus:outline-none h-14 w-14"
        @click="controls.nextMode"
      >
        <icon-sharp-chevron-right />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useTimer } from "./useTimer";
import { PROMODORO_TEMPLATE } from "./useTimeTracker";
import IconSharpPlayArrow from "../atoms/IconSharpPlayArrow.vue";
import IconSharpPause from "../atoms/IconSharpPause.vue";
import IconSharpChevronRight from "../atoms/IconSharpChevronRight.vue";
import IconSharpChevronLeft from "../atoms/IconSharpChevronLeft.vue";

const props = defineProps({
  task: {
    type: Object,
  },
  timer: {
    type: Object,
  },
  size: {},
  disabled: {
    type: Boolean,
    default: false,
  },
  template: {
    type: Array,
    default() {
      return PROMODORO_TEMPLATE;
    },
  },
});

const { state, controls, ui } = useTimer({
  task: props.task,
  template: props.template,
});

const isMini = computed(() => {
  return props.size == "mini";
});

const trackerIcon = computed(() => {
  return state.now ? IconSharpPause : IconSharpPlayArrow;
});
</script>
