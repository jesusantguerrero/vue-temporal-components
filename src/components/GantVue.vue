<template>
  <div class="gant-vue">
    <div class="search-bar border w-full text-left py-2 space-x-5 text-sm">
      <input
        type="search"
        class="px-4 w-4/12 focus:outline-none border-r-2"
        placeholder="Search by task name or custom field value"
      />
      <button class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none">Today</button>
      <button class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none">+</button>
      <button class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none">-</button>
      <select class="hover:bg-gray-100 px-2 py-1 rounded-md focus:outline-none">
        <option value="">Day</option>
        <option value="">Week</option>
        <option value="">Month</option>
      </select>
    </div>
    <div class="custom-table flex w-full overflow-hidden border-t">
      <div class="task-column w-52">
        <div class="task-col__header h-14 bg-gray-200">Task Title</div>
        <div class="task-col__cell h-10 border-b-2 " v-for="task in tasks" :key="task.id">
          {{ task.title }}
        </div>
      </div>
      <div class="months flex w-full overflow-x-auto">
        <div class="task-col__header border-r text-left" v-for="month in months" :key="month">
          <span class="font-bold text-gray-400 pl-2 text-sm">
            {{ format(month, "MMM yyyy") }}
          </span>
          <div class="units flex">
            <div v-for="day in getDaysForMonth(month)" :key="day" class="w-10 text-center">
              <span class="inline-block pb-2 text-gray-400 text-sm">
                {{ format(day, "dd") }}
              </span>
              <div class="units-body">
                <div v-for="task in tasks" :key="task.id" class="border h-10">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  startOfMonth,
} from "date-fns";
import format from "date-fns/format";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import endOfMonth from "date-fns/endOfMonth";
export default {
  name: "GantVue",
  props: {
    tasks: Array,
  },
  setup() {
    const getDaysForMonth = (month) => {
      return eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      });
    };
    return {
      months: eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      }),
      format: format,
      getDaysForMonth,
    };
  },
};
</script>

<style scoped lang="scss"></style>
