<template>
  <roadmap-view
    :tasks="tasks"
    focused-text-class="text-green-500"
    marker-bg-class="bg-green-400"
  />
</template>

<script>
import { reactive, toRefs } from "vue";
import { RoadmapView } from "./components";
import addDays from "date-fns/addDays";

export default {
  name: "App",
  components: {
    RoadmapView,
  },
  setup() {
    const state = reactive({
      tasks: [
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
      ],
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
