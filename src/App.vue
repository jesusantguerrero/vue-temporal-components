<script setup>
import { reactive } from "vue";
import { RoadmapView } from "./components";
import addDays from "date-fns/addDays";
import Timer from "./components/Timer/index.vue";
import WeekPlanner from "./components/WeekPlanner/WeekPlanner.vue";
import { addHours } from "date-fns";

const tasks = reactive([
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
]);

const debugEvent = (evt) => console.log(evt);

const setISOTime = (hoursToAdd = 0, daysToAdd = 0) => {
  return addHours(addDays(new Date(), daysToAdd), hoursToAdd);
};

const events = [
  {
    id: "1",
    title: "Item 1",
    description: "Item 1 description",
    image: "https://picsum.photos/200/300",
    startTime: setISOTime(8),
    endTime: setISOTime(9),
  },
  {
    id: "2",
    title: "Item 2",
    description: "Item 2 description",
    image: "https://picsum.photos/200/300",
    startTime: setISOTime(10),
    endTime: setISOTime(11),
  },
];

const state = {
  value: new Date(),
  nextMode: "week",
  placeholder: "Select a date",
  items: events,
};
</script>

<template>
  <div class="px-5">
    <RoadmapView
      :tasks="tasks"
      :show-search="true"
      :show-toolbar="true"
      focused-text-class="text-green-500"
      marker-bg-class="bg-green-400"
    />
    <Timer :task="tasks[0]" />

    <Timer
      :task="tasks[0]"
      size="mini"
      move-on-stop
      @started="debugEvent"
      @stopped="debugEvent"
      @tick="debugEvent"
    />

    <week-planner v-model="value" v-bind="state" />
  </div>
</template>
