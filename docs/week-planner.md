---
title: Planner Component
---

<script setup>
    import WeekPlanner  from '../src/components/WeekPlanner/WeekPlanner.vue';
    import { addDays, addHours } from "date-fns";

    const setISOTime = (hoursToAdd = 0, daysToAdd = 0) => {
        return addHours(addDays(new Date(), daysToAdd), hoursToAdd);
    };

    const items = [
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
      items,
    }

            // `from` and `to` are expected in minutes.
        const dailyHours = [{ from: 9 * 60, to: 18 * 60, class: 'bg-yellow-200/20' }]

        // In your component's data, special hours from Monday to Friday.
        // Note that you can provide an array of multiple blocks for the same day.
        const specialHours = {
            1: dailyHours,
            2: dailyHours,
            3: [
                { from: 9 * 60, to: 12 * 60, class: 'bg-yellow-200/20' },
                { from: 14 * 60, to: 18 * 60, class: 'bg-yellow-200/20' }
            ],
            4: dailyHours,
            5: dailyHours
        }
</script>


### Full timer
<section class="w-full">
    <WeekPlanner 
        v-model="value" 
        v-bind="state" 
        class="text-white border border-slate-400 bg-slate-600"
        header-class="bg-slate-900"
        cell-class="text-white bg-slate-600 hover:bg-slate-700"
        style="height: 250px" 
     />
</section>

### No Time and hidden weekends 
<section class="w-full">
    <WeekPlanner 
        v-model="value" 
        v-bind="state" 
        class="text-white border border-slate-400 bg-slate-600"
        header-class="bg-slate-900"
        cell-class="text-white bg-slate-600 hover:bg-slate-700"
        style="height: 250px" 
        :time="false" 
        hide-weekends
     />
</section>

### No Time and hidden weekends 
<section class="w-full">
    <WeekPlanner 
        v-model="value" 
        v-bind="state" 
        class="text-white border border-slate-400 bg-slate-600"
        header-class="bg-slate-900"
        cell-class="text-white bg-slate-600 hover:bg-slate-700"
        style="height: 250px" 
       :time-from="8 * 60"
        :time-to="19 * 60"
        :time-step="30"
        hide-weekends
     />
</section>

### Show time in cells 
<section class="w-full">
    <WeekPlanner 
        v-model="value" 
        v-bind="state" 
        class="text-white border border-slate-400 bg-slate-600"
        header-class="bg-slate-900"
        cell-class="text-white bg-slate-600 hover:bg-slate-700"
        style="height: 250px" 
        :time-from="8 * 60"
        :time-to="19 * 60"
        :time-step="30"
        hide-weekends
        show-time-in-cells
     />
</section>

### Special hours
<section class="w-full">
    <WeekPlanner 
        v-model="value" 
        v-bind="state" 
        class="text-white border border-slate-400 bg-slate-600"
        header-class="bg-slate-900"
        cell-class="text-white bg-slate-600 hover:bg-slate-700"
        style="height: 250px" 
        :time-step="60"
        hide-weekends
        :special-hours="specialHours"
     />
</section>