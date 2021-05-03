<template>
  <span
    class="marker-point inline-block h-4 w-full mt-2 cursor-pointer absolute left-0"
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
  width: 108%;
  z-index: 100;
}
</style>