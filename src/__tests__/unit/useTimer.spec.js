import "@testing-library/jest-dom";
import { useTimer } from "../../components/Timer/useTimer";
import { vi, describe, it, expect } from "vitest";
import { PROMODORO_TEMPLATE } from "../../components/Timer/useTimeTracker";
import { tasks } from "../utils";

describe("useTimer", () => {
  it("Play and stop pomodoro correctly", async () => {
    vi.useFakeTimers();
    const { ui, controls } = useTimer({
      task: tasks[0],
      template: PROMODORO_TEMPLATE,
      confirmFunction: () => console.log("DEBUG::confirm"),
      onStarted() {
        console.log("Here starting");
      },
    });
    let time = "";
    expect(ui.currentTime).toBe("25:00");
    controls.play();
    vi.advanceTimersByTime(2000);
    time = ui.currentTime;
    vi.clearAllTimers();
    controls.stop();
    expect(time).toBe("24:58");
    expect(ui.currentTime).toBe("05:00");
  });
});
