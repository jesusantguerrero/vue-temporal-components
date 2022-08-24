---
title: Timer Component
---

<script setup>
    import Timer  from '../src/components/Timer/index.vue';
    const task = { title: 'Timer'};
</script>


### Full timer
<Timer :task="task" />


### Mini timer
<Timer :task="task" size="mini" />