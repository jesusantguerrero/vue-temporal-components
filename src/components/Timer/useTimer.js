import { computed, onBeforeUnmount, reactive, watch } from "vue";
import { Duration, Interval, DateTime } from "luxon";
import { useTimeTracker, PROMODORO_TEMPLATE } from "./useTimeTracker";
import { useTitle } from "@vueuse/core";

export const useTimer = (
  { task, template, confirmFunction, onStarted, onStopped, onTick } = {
    task: {},
    template: PROMODORO_TEMPLATE,
    confirmFunction: confirm,
    onStarted: (data) => { console.log("DEBUG::onStarted", data); },
    onStopped: () => {},
    onTick: () => {},
  }
) => {
  // state
  const state = reactive({
    currentStep: 0,
    now: null,
    mode: "promodoro",
    volume: 100,
    timer: null,
    durationTarget: null,
    modes: {
      long: {
        label: "Long Rest",
        text: "Long Rest",
        min: 15,
        sec: 0,
        color: "text-green-400",
        colorBg: "bg-green-400",
        colorBorder: "border-green-400",
      },
      promodoro: {
        min: 25,
        sec: 0,
        color: "text-red-400",
        colorBg: "bg-red-400",
        colorBorder: "border-red-400",
        text: "Pomodoro session",
      },
      rest: {
        min: 5,
        sec: 0,
        color: "text-blue-400",
        colorBg: "bg-blue-400",
        colorBorder: "border-blue-400",
        text: "Take a short break",
      },
    },
    track: reactive({
      uid: null,
      task_uid: null,
      started_at: null,
      ended_at: null,
      type: "promodoro",
      duration: null,
      target_time: null,
      completed: false,
    }),
  });

  // UI
  const trackerIcon = computed(() =>
    state.now ? "fas fa-stop" : "fas fa-play"
  );
  const trackerMode = computed(() => state.modes[state.mode]);
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
    return state.modes[template[state.currentStep]].colorBg;
  });
  const hasPrevMode = computed(() => {
    return state.currentStep > 0;
  });

  // Time manipulation
  const setDurationTarget = () => {
    const { min, sec } = state.modes[state.mode];
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
      if (duration) {
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
    state.track.started_at ? stop(null, true) : play();
  };

  const play = () => {
    stopSound();
    state.track.started_at = new Date();
    state.now = state.track.started_at;

    if (state.mode == "promodoro") {
      createTrack(state.track);
    }

    state.timer = setInterval(() => {
      state.now = new Date();
    }, 100);
  };

  const stop = (shouldCallNextMode = true, silent) => {
    state.track.ended_at = new Date();
    if (state.mode == "promodoro" && state.now) {
      updateTrackFromLocal({ ...state.track });
    }

    const wasRunning = Boolean(state.now);
    const previousMode = state.mode;
    const message = state.track.completed ? "finished" : "stopped";

    clearTrack();
    clearInterval(state.timer);
    state.now = null;

    if (shouldCallNextMode) {
      nextMode();
    }

    if (!silent) {
      playSound();
      if (wasRunning && previousMode == "promodoro") {
        showNotification("Promodoro session finished");
        confirmFunction(`Promodoro session ${message}`);
      }
    }
  };

  const reset = () => {
    stop();
    state.mode = "promodoro";
    state.currentStep = 0;
    setDurationTarget();
  };

  const prevMode = () => {
    if (state.now) {
      stop(false);
    }

    const nextMode = hasPrevMode.value ? state.currentStep - 1 : 0;
    state.mode = template[nextMode];
    state.currentStep = nextMode;
    setDurationTarget();
  };

  const nextMode = () => {
    if (state.now) {
      stop(false);
    }

    const canIncrement = state.currentStep < template.length - 1;
    const nextMode = canIncrement ? state.currentStep + 1 : 0;
    state.mode = template[nextMode];
    state.currentStep = nextMode;
    setDurationTarget();
  };

  // data management / persistence
  const clearTrack = () => {
    clearInterval(state.timer);
    state.track.started_at = null;
    state.track.ended_at = null;
    state.track.duration = null;
    state.track.target_time = null;
    state.track.completed = false;
  };

  const createTrack = () => {
    state.track.task_uid = task.uid;
    state.track.description = task.title;
    state.track.target_time = state.durationTarget.toISO();
    const formData = { ...state.track };
    delete formData.currentTime;
    onStarted && onStarted(formData);
    onTick && onTick(state.track);
  };

  const updateTrackFromLocal = (track) => {
    const formData = { ...track };
    const duration = Interval.fromDateTimes(
      formData.started_at,
      formData.ended_at
    ).toDuration();
    (formData.duration_ms = duration.as("milliseconds")),
      (formData.duration_iso = duration.toISO()),
      delete formData.currentTime;
    onStopped && onStopped(formData);
    onTick && onTick({});
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
      trackerIcon,
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
      clearTrack,
    },
  };
};
