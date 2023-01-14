import { shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { RoadmapView } from "../..";
import { tasks } from "@/__tests__/utils";

describe("Roadmap View", () => {
  it("renders props.tasks when passed", () => {
    const wrapper = shallowMount(RoadmapView, {
      props: {
        tasks: tasks,
      },
    });
    expect(wrapper.text()).toMatch(tasks[0].title);
  });

  it("Goes to today", async () => {
    render(RoadmapView, {
      props: {
        tasks,
        year: new Date(),
        showToolbar: true,
        showSearchBar: true,
      },
    });

    const today = screen.getByText("Today");
    await fireEvent.click(today);
  });

  it("Can zoom in and zoom out", async () => {
    const { getByDisplayValue } = render(RoadmapView, {
      props: {
        tasks,
        year: new Date(),
        showToolbar: true,
        showSearchBar: true,
      },
    });

    expect(getByDisplayValue("Day")).toBeTruthy();

    const zoomIn = screen.getByText("+");
    const zoomOut = screen.getByText("-");

    await fireEvent.click(zoomOut);
    expect(getByDisplayValue("Week")).toBeTruthy();
    await fireEvent.click(zoomOut);
    expect(getByDisplayValue("Month")).toBeTruthy();
    await fireEvent.click(zoomIn);
    expect(getByDisplayValue("Week")).toBeTruthy();
  });
});
