//@ts-ignore 
import { computed, onBeforeUnmount, reactive, watch } from "vue";
//@ts-ignore 
import { Duration, Interval, DateTime } from "luxon";
import {
  useTimeTracker,
  PROMODORO_TEMPLATE,
  POMODORO_MODES,
} from "./useTimeTracker";
import { addMinutes, addSeconds, format } from "date-fns";
import { cloneDeep } from "lodash-es";

export interface ITaskPartial {
  uid: string;
  title: string;
}

export interface ITimerMode {
  label?: string;
  min: number;
  sec: number;
  color: string;
  colorBg: string;
  colorBorder: string;
  text: string
}

export type ITimerModes = Record<string, ITimerMode>
interface ITrack {
  uid?: null | string | number;
  task_uid: null | string | number;
  started_at: null | Date;
  ended_at: null | Date;
  expected_end_at: null | Date | string;
  type: 'pomodoro' | 'timer' | 'stopwatch';
  description?: string;
  subtype?: string;
  target_time: null | string;
  duration_ms: number;
  duration_iso: string; 
  completed: boolean;
  currentTime: null | Duration;
}

interface ITimerState {
  templateStep: number;
  now: null | Date;
  mode: string;
  volume: number;
  timer: null | number | any;
  durationTarget: null | Duration;
}
export interface ITimerConfig  {
    task: ITaskPartial,
    template: string[],
    modes: ITimerModes,
    moveOnStop: boolean,
    confirmFunction: (data: any) => {},
    onStarted: (data: ITrack | null) => {},
    onStopped: (data: ITrack | null) => {},
    onTick: (data: ITrack | null) => {},
}

export const trackerConfig = {
  task: {},
  template: PROMODORO_TEMPLATE,
  modes: POMODORO_MODES,
  moveOnStop: true,
  confirmFunction: confirm,
  onStarted: (data: ITrack | null) => {
    console.log("DEBUG::onStarted", data);
  },
  onStopped: (data: ITrack | null) => {
    console.log("DEBUG::onStopped", data);
  },
  onTick: () => {},
};

export const mergeConfig = (propsData: Record<string, any>): ITimerConfig => {
  return Object.keys(trackerConfig).reduce((config, key) => {
    if (propsData[key] !== undefined || propsData[key] !== null) {
      // @ts-ignore
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
  }, trackerConfig) as unknown as ITimerConfig;
};

export const useTimer = (config: ITimerConfig) => {
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
  const state = reactive<ITimerState>({
    templateStep: 0,
    now: null,
    mode: "promodoro",
    volume: 100,
    timer: null,
    durationTarget: null,
  });

  const track = reactive<ITrack>({
    uid: null,
    task_uid: null,
    started_at: null,
    ended_at: null,
    expected_end_at: null,
    type: "pomodoro",
    target_time: null,
    duration_ms: 0,
    duration_iso: '', 
    completed: false,
    currentTime: null,
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
    return modes[template[state.templateStep]].colorBg;
  });
  
  const hasPrevMode = computed(() => {
    return state.templateStep > 0;
  });

  // Time manipulation
  const setDurationTarget = (startedAt: Date = new Date()) => {
    const { min, sec } = modes[state.mode];
    state.durationTarget = Duration.fromISO(`PT${min}M${sec}S`);
    if (startedAt) {
      const expectedEndAt = addSeconds(addMinutes(startedAt, min), sec);
      track.expected_end_at = format(expectedEndAt, "yyyy-MM-dd'T'HH:mm:ss");
    }
  };

  setDurationTarget();

  const targetTime = computed(() => {
    if (track.started_at && state.now) {
      const targetTime = DateTime.fromJSDate(track.started_at).plus(
        state.durationTarget
      );
      return targetTime;
    }
    return null;
  });

  const currentTime = computed(() => {
    if (track.started_at && state.now && state.durationTarget) {
      let duration = Interval.fromDateTimes(
        track.started_at,
        state.now
      ).toDuration();
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      track.currentTime = duration;
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
    () => state.now,
    (now) => {
      if (targetTime.value && now && targetTime.value.diffNow() < 0) {
        track.completed = true;
        stop();
      }
    }
  );

  // Settings
  const { playSound, stopSound, showNotification } = useTimeTracker();

  // Controls
  const toggleTracker = () => {
    track.started_at ? stop(moveOnStop, true) : play();
  };

  function play() {
    stopSound();
    track.started_at = new Date();
    state.now = track.started_at;
    let formData: ITrack | null = null;

    formData = createTrack();

    onStarted && onStarted(formData);
    onTick && onTick(track);
    state.timer = setInterval(() => {
      state.now = new Date();
      onTick && onTick(track);
    }, 100);
  }

  const stop = (shouldCallNextMode: boolean = moveOnStop, silent: boolean = false) => {
    track.ended_at = new Date();
    let formData = null;
    if (state.now) {
      formData = closeTrack({ ...track });
    }

    const wasRunning = Boolean(state.now);
    const previousMode = state.mode;
    const message = track.completed ? "finished" : "stopped";

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
    state.templateStep = 0;
    setDurationTarget();
  };

  //  resume
  const resume = (currentTimer: Record<string, any>) => {
    track.uid = currentTimer.uid;
    track.started_at = currentTimer.started_at;
    track.task_uid = currentTimer.task_uid;
    track.description = currentTimer.description;
    track.target_time = currentTimer.target_time;
    track.subtype = currentTimer.subtype;
    track.completed = false;
    state.durationTarget = Duration.fromISO(currentTimer.target_time);
    state.timer = setInterval(() => {
      state.now = new Date();
    }, 100);
  };
  // Template steps controls

  const moveToStep = (index: number) => {
    if (state.now) {
      stop(false);
    }

    state.mode = template[index];
    state.templateStep = index;
    setDurationTarget();
  };

  const moveToStage = (index: number) => {
    if (state.now) {
      stop(false);
    }
    moveToStep(index);
  };

  const prevMode = () => {
    const nextMode = hasPrevMode.value ? state.templateStep - 1 : 0;
    moveToStep(nextMode);
  };

  const nextMode = () => {
    const canIncrement = state.templateStep < template.length - 1;
    const nextMode = canIncrement ? state.templateStep + 1 : 0;
    moveToStep(nextMode);
  };

  // data management / persistence
  const clearTrack = () => {
    clearInterval(state.timer);
    track.started_at = null;
    track.ended_at = null;
    track.target_time = null;
    track.completed = false;
  };

  const createTrack = () => {
    track.task_uid = task.uid;
    track.description = task.title;
    track.target_time = state.durationTarget.toISO();
    const formData = cloneDeep(track);
    return formData;
  };

  const closeTrack = (track: ITrack): ITrack => {
    const formData = cloneDeep(track);
    const duration = Interval.fromDateTimes(
      formData.started_at,
      formData.ended_at
    ).toDuration();
    formData.duration_ms = duration.as("milliseconds");
    formData.duration_iso = duration.toISO();
    formData.currentTime;
    return formData;
  };

  // checks to stop
  onBeforeUnmount(() => {
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
