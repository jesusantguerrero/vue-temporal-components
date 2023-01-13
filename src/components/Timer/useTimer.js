import { computed, onBeforeUnmount, reactive, watch } from "vue";
import { Duration, Interval, DateTime } from "luxon";
import {
  useTimeTracker,
  PROMODORO_TEMPLATE,
  POMODORO_MODES,
} from "./useTimeTracker";
import { useTitle } from "@vueuse/core";

export const trackerConfig = {
  task: {},
  template: PROMODORO_TEMPLATE,
  modes: POMODORO_MODES,
  confirmFunction: confirm,
  moveOnStop: true,
  onStarted: (data) => {
    console.log("DEBUG::onStarted", data);
  },
  onStopped: (data) => {
    console.log("DEBUG::onStopped", data);
  },
  onTick: () => {},
};

export const mergeConfig = (propsData) => {
  return Object.keys(trackerConfig).reduce((config, key) => {
    if (propsData[key] !== undefined || propsData[key] !== null) {
      config[key] = propsData[key];
    }
    if (key == "modes") {
      config[key] = {
        long: {
          ...POMODORO_MODES.long,
          ...(propsData.modes?.long ?? {}),
        },
        rest: {
          ...POMODORO_MODES.rest,
          ...(propsData.modes?.rest ?? {}),
        },
        promodoro: {
          ...POMODORO_MODES.promodoro,
          ...(propsData.modes?.promodoro ?? {}),
        },
      };
    }

    return config;
  }, trackerConfig);
};

export const useTimer = (config) => {
  const {
    task,
    template,
    moveOnStop,
    modes,
    confirmFunction,
    onStarted,
    onStopped,
    onTick,
  } = mergeConfig(config);
  // state
  const state = reactive({
    currentStep: 0,
    now: null,
    mode: "promodoro",
    volume: 100,
    timer: null,
    durationTarget: null,
    track: reactive({
      uid: null,
      task_uid: null,
      started_at: null,
      ended_at: null,
      type: "pomodoro",
      target_time: null,
      completed: false,
    }),
  });

  // UI
  const trackerMode = computed(() => modes[state.mode]);
  const promodoroTotal = computed(() => {
    return template
      .map((mode, index) => {
        return {
          name: mode,
          originalIndex: index,
        };
      })
      .filter((mode) => mode.name.includes("promodoro"));
  });
  const currentStateColor = computed(() => {
    return modes[template[state.currentStep]].colorBg;
  });
  const hasPrevMode = computed(() => {
    return state.currentStep > 0;
  });

  // Time manipulation
  const setDurationTarget = () => {
    const { min, sec } = modes[state.mode];
    state.durationTarget = Duration.fromISO(`PT${min}M${sec}S`);
  };

  setDurationTarget();

  const targetTime = computed(() => {
    if (state.track.started_at && state.now) {
      const targetTime = DateTime.fromJSDate(state.track.started_at).plus(
        state.durationTarget
      );
      return targetTime;
    }
    return null;
  });

  const currentTime = computed(() => {
    if (state.track.started_at && state.now && state.durationTarget) {
      let duration = Interval.fromDateTimes(
        state.track.started_at,
        state.now
      ).toDuration();
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      state.track.currentTime = duration;
      if (duration && state.durationTarget) {
        duration = state.durationTarget.minus(duration).plus({ seconds: 0.9 });
        return duration.as("seconds") < 0
          ? "00:00"
          : duration.toFormat("mm:ss");
      }
      return "00:00";
    } else {
      return state.durationTarget.toFormat("mm:ss");
    }
  });

  watch(
    () => currentTime.value,
    () => {
      if (state.now) {
        useTitle(`Zen.  ${currentTime.value}`);
      } else {
        useTitle("Zen.");
      }
    }
  );

  watch(
    () => state.now,
    (now) => {
      if (targetTime.value && now && targetTime.value.diffNow() < 0) {
        state.track.completed = true;
        stop();
      }
    }
  );

  // Settings
  const { playSound, stopSound, showNotification } = useTimeTracker();

  // Controls
  const toggleTracker = () => {
    state.track.started_at ? stop(moveOnStop, true) : play();
  };

  function play() {
    stopSound();
    state.track.started_at = new Date();
    state.now = state.track.started_at;
    let formData = {};

    if (state.mode == "promodoro") {
      formData = createTrack(state.track);
    }

    onStarted && onStarted(formData);
    onTick && onTick(state.track);
    state.timer = setInterval(() => {
      state.now = new Date();
      onTick && onTick(state.track);
    }, 100);
  }

  const stop = (shouldCallNextMode = moveOnStop, silent) => {
    state.track.ended_at = new Date();
    let formData = {};
    if (state.mode == "promodoro" && state.now) {
      formData = closeTrack({ ...state.track });
    }

    const wasRunning = Boolean(state.now);
    const previousMode = state.mode;
    const message = state.track.completed ? "finished" : "stopped";

    clearTrack();
    clearInterval(state.timer);
    state.now = null;
    onStopped && onStopped(formData);

    if (shouldCallNextMode) {
      nextMode();
    }

    if (!silent) {
      playSound();
      if (wasRunning && previousMode == "promodoro") {
        showNotification("Pomodoro session finished");
        confirmFunction && confirmFunction(`Pomodoro session ${message}`);
      }
    }
  };

  const reset = () => {
    stop();
    state.mode = "promodoro";
    state.currentStep = 0;
    setDurationTarget();
  };

  const moveToStep = (index) => {
    if (state.now) {
      stop(false);
    }

    state.mode = template[index];
    state.currentStep = index;
    setDurationTarget();
  };

  const moveToStage = (index) => {
    if (state.now) {
      stop(false);
    }
    moveToStep(index);
  };

  const prevMode = () => {
    const nextMode = hasPrevMode.value ? state.currentStep - 1 : 0;
    moveToStep(nextMode);
  };

  const nextMode = () => {
    const canIncrement = state.currentStep < template.length - 1;
    const nextMode = canIncrement ? state.currentStep + 1 : 0;
    moveToStep(nextMode);
  };

  //  resume
  const resume = (currentTimer) => {
    state.track.uid = currentTimer.uid;
    state.track.started_at = currentTimer.started_at;
    state.track.task_uid = currentTimer.task_uid;
    state.track.description = currentTimer.description;
    state.track.target_time = currentTimer.target_time;
    state.track.subtype = currentTimer.subtype;
    state.track.completed = false;
    state.durationTarget = Duration.fromISO(currentTimer.target_time);
    state.timer = setInterval(() => {
      state.now = new Date();
    }, 100);
  };

  // data management / persistence
  const clearTrack = () => {
    clearInterval(state.timer);
    state.track.started_at = null;
    state.track.ended_at = null;
    state.track.target_time = null;
    state.track.completed = false;
  };

  const createTrack = () => {
    state.track.task_uid = task.uid;
    state.track.description = task.title;
    state.track.target_time = state.durationTarget.toISO();
    const formData = { ...state.track };
    delete formData.currentTime;
    return formData;
  };

  const closeTrack = (track) => {
    const formData = { ...track };
    const duration = Interval.fromDateTimes(
      formData.started_at,
      formData.ended_at
    ).toDuration();
    formData.duration_ms = duration.as("milliseconds");
    formData.duration_iso = duration.toISO();
    delete formData.currentTime;
    return formData;
  };

  // checks to stop
  onBeforeUnmount(() => {
    useTitle("Zen.");
    stop(false, true);
  });

  watch(
    () => task.title,
    (_newValue, oldValue) => {
      if (oldValue && state.now && state.mode == "promodoro") {
        stop(false, true);
      }
    }
  );

  return {
    state,
    ui: reactive({
      trackerMode,
      promodoroTotal,
      currentStateColor,
      hasPrevMode,
      targetTime,
      currentTime,
    }),
    controls: {
      toggleTracker,
      stop,
      play,
      reset,
      prevMode,
      nextMode,
      moveToStage,
      clearTrack,
      resume,
    },
  };
};
