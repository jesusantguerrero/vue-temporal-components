<template>
  <div class="gant-vue">
    <div class="search-bar">
      <input
        type="search"
        placeholder="Search by task name or custom field value"
      />
      <button>Today</button>
      <button>+</button>
      <button>-</button>
      <select>
        <option value="">Day</option>
        <option value="">Week</option>
        <option value="">Month</option>
      </select>
    </div>
    <div class="custom-table flex">
      <div class="task-column">
        <div class="task-col__header">Task Title</div>
        <div class="task-col__cell" v-for="task in tasks" :key="task.id">
          {{ task.title }}
        </div>
      </div>
      <div class="months">
        <div class="task-col__header" v-for="month in months" :key="month">
          {{ month }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eachMonthOfInterval, startOfYear, endOfYear } from "date-fns"
export default {
  name: "GantVue",
  props: {
    tasks: Array,
  },
  setup() {
    return {
      months: eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date())
      })
    }
  }
};
</script>

<style scoped lang="scss"></style>
