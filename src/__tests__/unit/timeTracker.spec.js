import { describe, it, expect, vi } from "vitest";
import { Timer } from "../../components";
import { render, fireEvent } from "@testing-library/vue";
import { tasks } from "../utils";

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
    expect(getByTestId("current-time").textContent).toBe("25:00");
    fireEvent.click(btnPlay);
    vi.advanceTimersByTime(2000);
    time = getByTestId("current-time").textContent;
    vi.clearAllTimers();
    fireEvent.click(getByTestId("btn-play"));
    console.log(time);
    expect(time).toBe("25:00");
    expect(queryByTestId("current-time")?.textContent).toBe("25:00");
  });

  it("should emit events", async () => {
    vi.useFakeTimers();
    const { getByTestId, emitted } = render(Timer, {
      props: {
        task: tasks[0],
        disabled: true,
      },
    });

    const btnPlay = getByTestId("btn-play");
    expect(getByTestId("current-time").textContent).toBe("25:00");
    await fireEvent.click(btnPlay);
    expect(emitted()).toHaveProperty("started");
    vi.advanceTimersByTime(2000);
    expect(emitted()).toHaveProperty("tick");
    vi.clearAllTimers();
    await fireEvent.click(btnPlay);
    expect(emitted()).toHaveProperty("stopped");
  });
});
