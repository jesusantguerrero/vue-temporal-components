<template>
  <button
    class="flex items-center disabled:cursor-not-allowed justify-center text-4xl text-gray-400 rounded-full focus:outline-none h-14 w-14"
    :class="{ 'hover:bg-gray-100/20': !disabled }"
    v-bind="$attrs"
    v-on="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
  },
});
</script>
