---
title: Timer Component
---

<script setup>
    import { ref, reactive } from "vue";
    import { RoadmapView } from "../src/components";
    import addDays from "date-fns/addDays";
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


### Full timer
<RoadmapView
    :tasks="tasks"
    :show-search="true"
    :show-toolbar="true"
    focused-text-class="text-green-500"
    marker-bg-class="bg-green-400"
/>