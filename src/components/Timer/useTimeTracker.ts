import cloneDeep  from 'lodash/cloneDeep';
import { ITimerModes } from './useTimer';
// @ts-ignore: it should export reactive for sure
import { reactive } from "vue";
const SESSION_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;

export const PROMODORO_TEMPLATE = [
  "promodoro",
  "rest",
  "promodoro",
  "rest",
  "promodoro",
  "rest",
  "promodoro",
  "long",
];

export const POMODORO_MODES = {
  long: {
    label: "Long Rest",
    min: LONG_BREAK_MINUTES,
    sec: 0,
    color: "text-green-400",
    colorBg: "bg-green-400",
    colorBorder: "border-green-400",
    text: "Long break",
  },
  promodoro: {
    min: SESSION_MINUTES,
    sec: 0,
    color: "text-red-400",
    colorBg: "bg-red-400",
    colorBorder: "border-red-400",
    text: "Work session",
  },
  rest: {
    min: SHORT_BREAK_MINUTES,
    sec: 0,
    color: "text-blue-400",
    colorBg: "bg-blue-400",
    colorBorder: "border-blue-400",
    text: "Take a short break",
  }
}

export const PomodoroState = reactive<{
  template: string[];
  modes: ITimerModes;
  volume: number;
  audio: null | HTMLAudioElement;
  alarmSound: string;
  isSubscribed: boolean;
}>({
  template: PROMODORO_TEMPLATE,
  modes: cloneDeep(POMODORO_MODES),
  volume: 100,
  audio: null,
  alarmSound: "alarmwatch",
  isSubscribed: false,
});
export function useTimeTracker() {
  const setSettings = (settings: Record<string, any>) => {
    if (!settings) {
      return;
    }

    if (settings.promodoro_template) {
      PomodoroState.template = settings.promodoro_template;
    }

    PomodoroState.isSubscribed = settings.pushSubscription;

    const modes = settings.promodoro_modes;
    const { promodoro, rest, long } = PomodoroState.modes;

    if (modes) {
      promodoro.min = modes.promodoro.min;
      promodoro.sec = modes.promodoro.sec;
      rest.min = modes.rest.min;
      rest.sec = modes.rest.sec;
      long.min = modes.long.min;
      long.sec = modes.long.sec;
    }
    PomodoroState.volume = settings.promodoro_alert_volume || 100;
  };

  const playSound = async (volume: number = 80) => {
    try {
      stopSound();
      const audio = document.createElement('audio');
      const localVolume = volume || PomodoroState.volume / 100;
      audio.id = "audio";
      document.body.appendChild(audio);
      audio.currentTime = 0;
      audio.volume = localVolume;
      PomodoroState.audio = audio;
      window.navigator.vibrate([1000, 100, 1000, 100, 1000, 100, 1000]);
      audio.play();
    } catch (err) {
      console.log("we couldn't play the audio")
    }
  };

  const stopSound = () => {
    if (PomodoroState.audio && PomodoroState.audio.pause) {
      PomodoroState.audio.pause();
      window.navigator.vibrate(0);
    }
  };

  const requestNotification = () => {
    new Promise((resolve, reject) => {
      if (window.Notification && Notification.permission !== "denied") {
         resolve(Notification.requestPermission());
      }
      reject(null)
    })
  };

  const showNotification = (message: string) => {
    if (window.Notification && Notification.permission === "granted") {
      new Notification(message);
    }
  };

  return {
    playSound,
    stopSound,
    setSettings,
    PomodoroState,
    showNotification,
    requestNotification,
  };
}
