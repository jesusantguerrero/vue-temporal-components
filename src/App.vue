<template>
  <gant-vue :tasks="tasks" />
</template>

<script>
import { reactive, toRefs } from "vue";
import GantVue from "./components/GantVue";

export default {
  name: "App",
  components: {
    GantVue,
  },
  setup() {
    const state = reactive({
      tasks: [
        {
          id: 1,
          title: "Description",
        },
        {
          id: 2,
          title: "Description II",
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
