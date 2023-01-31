---
title: Timer Component
---

<script setup>
    import { ref } from "vue";
    import Timer  from '../src/components/Timer/index.vue';

    const task = { title: 'Timer'};
    const timerRef = ref();

    const toggleTimer = () => {
        timerRef.value.toggleTracker();
    }
</script>


### Full timer
<Timer :task="task" />


### Mini timer
<Timer :task="task" size="mini" />


### Mini timer programmatic
<Timer :task="task" size="mini" ref="timerRef" />
<button @click="toggleTimer()">
    Timer is running
</button>