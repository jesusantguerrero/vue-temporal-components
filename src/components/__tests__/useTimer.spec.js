import "@testing-library/jest-dom";
import { useTimer } from "../Timer/useTimer";
import { vi, describe, it, expect } from "vitest";
import { PROMODORO_TEMPLATE } from "../Timer/useTimeTracker";

const task = {
  uid: undefined,
  title: "",
  description: "",
  due_date: "",
  duration: "",
  tags: [],
  contacts: [],
  checklist: [],
  tracks: [],
  order: 0,
  duration_ms: 0,
  done: false,
  commit_date: null,
  matrix: "todo",
};

describe("useTimer", () => {
  it("Play and stop pomodoro correctly", async () => {
    vi.useFakeTimers();
    const { ui, controls } = useTimer({
      task,
      template: PROMODORO_TEMPLATE,
      confirmFunction: () => console.log("DEBUG::confirm"),
    });
    let time = "";
    expect(ui.currentTime.value).toBe("25:00");
    controls.play();
    vi.advanceTimersByTime(2000);
    time = ui.currentTime.value;
    vi.clearAllTimers();
    controls.stop();
    expect(time).toBe("24:58");
    expect(ui.currentTime.value).toBe("05:00");
  });
});
