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
      <Button
        v-if="!isMini"
        class="mr-2"
        @click="controls.prevMode"
        :disabled="!ui.hasPrevMode"
      >
        <IconSharpChevronLeft />
      </Button>
      <button
        type="button"
        class="flex items-center justify-center cursor-pointer"
        role="button"
        :class="[
          ui.trackerMode.color,
          ui.trackerMode.colorBorder,
          isMini
            ? 'w-20 flex-row-reverse'
            : 'h-52 w-52 rounded-full flex-col space-y-3 border-2',
        ]"
        data-testid="btn-play"
        title="Click here to start"
        @click="toggleTracker()"
      >
        <div
          class="select-none"
          :class="[isMini ? 'w-full text-center text-2xl' : 'text-5xl']"
        >
          <span data-testid="current-time"> {{ ui.currentTime }}</span>
          <div class="flex w-full h-1" :class="[isMini ? '' : 'mt-2']">
            <div
              v-for="(stage, index) in ui.promodoroTotal"
              :title="`Round ${index + 1}: ${stage.name}`"
              class="w-full h-1 mr-1 cursor-pointer bg-red hover:ring hover:ring-offset-[0.2px] ring-gray-300 ring-offset-gray-500"
              :class="[
                state.currentStep >= stage.originalIndex
                  ? ui.currentStateColor
                  : 'bg-gray-200/50',
              ]"
              @click.stop="controls.moveToStage(stage.originalIndex)"
              :key="stage.name"
            />
          </div>
        </div>

        <div :class="[isMini ? 'mr-1 text-4xl' : 'text-5xl']">
          <component :is="trackerIcon" />
        </div>
      </button>
      <Button v-if="!isMini" @click="controls.nextMode" class="ml-2">
        <IconSharpChevronRight />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onUnmounted, watch } from "vue";
import { useTimer } from "./useTimer";
import { POMODORO_MODES, PROMODORO_TEMPLATE } from "./useTimeTracker";
import IconSharpPlayArrow from "../atoms/IconSharpPlayArrow.vue";
import IconSharpPause from "../atoms/IconSharpPause.vue";
import IconSharpChevronRight from "../atoms/IconSharpChevronRight.vue";
import IconSharpChevronLeft from "../atoms/IconSharpChevronLeft.vue";
import Button from "./Button.vue";
import clone from "lodash/clone"

interface Props {
  task: ITaskPartial;
  timer: any;
  size?: 'mini'|'normal',
  disabled: Boolean;
  template?: string[];
  modes?: ITimerModes;
  moveOnStop: boolean
}
const props = withDefaults(defineProps<Props>(),{
  size: 'normal',
  template: clone(PROMODORO_TEMPLATE),
  modes: clone(POMODORO_MODES),
  moveOnStop: true,
});

const emit = defineEmits(["started", "stopped", "tick"]);

const { state, controls, ui } = useTimer({
  task: props.task,
  template: props.template,
  moveOnStop: props.moveOnStop,
  onStarted,
  onStopped,
  onTick,
});

const isMini = computed(() => {
  return props.size == "mini";
});

const trackerIcon = computed(() => {
  return state.now ? IconSharpPause : IconSharpPlayArrow;
});

const toggleTracker = () => {
  !props.disabled && controls.toggleTracker();
};

function onStarted(track) {
  emit("started", track);
}

function onStopped(track) {
  emit("stopped", track);
}

function onTick(track) {
  emit("tick", track);
}

watch(
  () => props.timer,
  (timer) => {
    if (timer && timer.uid !== state.timer) {
      timer?.started_at && controls.resume(timer);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (state.timer) {
    clearInterval(state.timer);
  }
});

// checks to stop
onBeforeUnmount(() => {
  controls.stop(false, true);
});

watch(
  () => props.task.title,
  (newValue, oldValue) => {
    if (oldValue && state.now && state.mode == "pomodoro") {
      controls.stop(false, true);
    }
  }
);
</script>
