import "@testing-library/jest-dom";
import { useTimer } from "../../components/Timer/useTimer";
import { vi, describe, it, expect } from "vitest";
import { PROMODORO_TEMPLATE } from "../../components/Timer/useTimeTracker";
import { tasks } from "../utils";

describe("useTimer", () => {
  const setTimer = (props = {}) => {
    return useTimer({
      task: tasks[0],
      template: PROMODORO_TEMPLATE,
      moveOnStop: true,
      confirmFunction: () => console.log("DEBUG::confirm"),
      onStarted() {
        console.log("Here starting");
      },
      ...props,
    });
  };
  it("Should display the assigned time", async () => {
    vi.useFakeTimers();
    const { ui } = setTimer({
      template: ["promodoro"],
      modes: {
        promodoro: {
          min: 45,
          sec: 0,
        },
      },
    });

    expect(ui.currentTime).toBe("45:00");
  });
  it("Should display a custom assigned time", async () => {
    vi.useFakeTimers();
    const { ui } = setTimer({
      template: {},
    });

    expect(ui.currentTime).toBe("25:00");
  });

  it("Play the pomodoro correctly", async () => {
    vi.useFakeTimers();
    const { ui, controls } = setTimer();
    let time = "";

    controls.play();
    vi.advanceTimersByTime(2000);
    time = ui.currentTime;
    vi.clearAllTimers();
    controls.stop();

    expect(time).toBe("24:58");
  });

  it("Should stop pomodoro and move to the next stage", async () => {
    vi.useFakeTimers();
    const { ui, controls } = setTimer();

    expect(ui.currentTime).toBe("25:00");
    controls.play();
    vi.advanceTimersByTime(2000);
    vi.clearAllTimers();
    controls.stop();

    expect(ui.currentTime).toBe("05:00");
  });
  it("Should stop pomodoro but not move to the next stage", async () => {
    vi.useFakeTimers();
    const { ui, controls } = setTimer({
      moveOnStop: false,
    });

    expect(ui.currentTime).toBe("25:00");
    controls.play();
    vi.advanceTimersByTime(2000);
    vi.clearAllTimers();
    controls.stop();

    expect(ui.currentTime).toBe("25:00");
  });
});
