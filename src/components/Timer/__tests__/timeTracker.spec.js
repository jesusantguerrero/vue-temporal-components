import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";

import { tasks } from "@/__tests__/utils";
import Timer from "../index.vue";
import { addMinutes, format } from "date-fns";

describe("Timer component zen use cases", () => {
  it("should be disabled", async () => {
    vi.useFakeTimers();
    const { getByTestId, queryByTestId } = render(Timer, {
      props: {
        task: tasks[0],
        disabled: true,
      },
    });
    let time = "";
    const btnPlay = getByTestId("btn-play");

    fireEvent.click(btnPlay);
    vi.advanceTimersByTime(2000);
    time = getByTestId("current-time").textContent;
    vi.clearAllTimers();
    fireEvent.click(getByTestId("btn-play"));

    expect(time).toBe("25:00");
    expect(queryByTestId("current-time")?.textContent).toBe("25:00");
  });

  it("should emit start event", async () => {
    vi.useFakeTimers();
    const { emitted } = render(Timer, {
      props: {
        task: tasks[0],
      },
    });
    const btnPlay = screen.queryByTestId("btn-play");

    await fireEvent.click(btnPlay);
    const trackData = emitted("started")[0][0];

    expect(emitted()).toHaveProperty("started");
    expect(trackData).toContain({
      type: "pomodoro",
      target_time: "PT25M",
      expected_end_at: format(
        addMinutes(trackData.started_at, 25),
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
      completed: false,
      description: "Description",
    });
  });

  it("should emit tick event", async () => {
    vi.useFakeTimers();
    const { emitted } = render(Timer, {
      props: {
        task: tasks[0],
      },
    });
    const btnPlay = screen.queryByTestId("btn-play");

    await fireEvent.click(btnPlay);

    vi.advanceTimersByTime(1000);
    expect(emitted()).toHaveProperty("tick");
    vi.clearAllTimers();
  });
  it("should emit stopped event", async () => {
    vi.useFakeTimers();
    const { emitted } = render(Timer, {
      props: {
        task: tasks[0],
      },
    });

    const btnPlay = screen.queryByTestId("btn-play");
    await fireEvent.click(btnPlay);

    vi.advanceTimersByTime(1000);
    await fireEvent.click(btnPlay);
    const trackData = emitted("stopped")[0][0];

    expect(emitted()).toHaveProperty("stopped");
    expect(emitted("stopped")[0][0]).toContain({
      type: "pomodoro",
      target_time: "PT25M",
      completed: false,
      description: "Description",
      expected_end_at: format(
        addMinutes(trackData.started_at, 25),
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
      duration_ms: 1000,
      duration_iso: "PT1S",
    });
  });
});
