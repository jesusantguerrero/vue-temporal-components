---
title: Timer Component
---

<script setup>
    import WeekPlanner  from '../src/components/WeekPlanner/WeekPlanner.vue';
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
</script>


### Full timer
<WeekPlanner v-model="value" v-bind="state" />