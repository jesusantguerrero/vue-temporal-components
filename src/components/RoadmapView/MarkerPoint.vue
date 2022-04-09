<template>
  <span
    class="absolute left-0 inline-block w-full h-4 mt-2 cursor-pointer marker-point"
    :class="{
      [`${markerBgClass}`]: true,
      'rounded-l-lg task-marker__side': isLeftSide,
      'rounded-r-lg task-marker__side': isRightSide,
    }"
    :title="title"
  ></span>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    isLeftSide: {
      type: Boolean,
    },
    isRightSide: {
      type: Boolean,
    },
    markerBgClass: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.marker-point {
  width: 118%;
  z-index: 100;
}
</style>