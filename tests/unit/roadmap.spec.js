import { shallowMount } from "@vue/test-utils";
import RoadmapView from "@/components/RoadmapView.vue";
import { addDays } from "date-fns";

describe("Roadmap View", () => {
  it("renders props.tasks when passed", () => {
    const tasks = [
      {
        id: 1,
        title: "Description",
        start: new Date(),
        end: addDays(new Date(), 2),
      },
      {
        id: 2,
        title: "Description II",
        start: new Date(),
        end: addDays(new Date(), 4),
      },
    ];

    const wrapper = shallowMount(RoadmapView, {
      props: {
        tasks: tasks,
      },
    });
    expect(wrapper.text()).toMatch(tasks[0].title);
  });

  it("Goes to today", () => {});

  it("Zoom in to next mode", () => {});

  it("Zoom out to previous mode", () => {});

  it("Changes view mode", () => {});
});
