<script setup>
import { reactive } from "vue";
import { RoadmapView } from "./components";
import addDays from "date-fns/addDays";

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
</script>

<template>
  <div class="px-5">
    <roadmap-view
      :tasks="tasks"
      :show-search="true"
      :show-toolbar="true"
      focused-text-class="text-green-500"
      marker-bg-class="bg-green-400"
    />
  </div>
</template>
