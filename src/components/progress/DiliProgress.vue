<script setup lang="ts">

import type { DiliProgressProps } from "@/components/progress/DiliProgress";
import { computed } from "vue";

const props = withDefaults(defineProps<DiliProgressProps>(), {
  min: 0,
  max: 100,
  value: 0,
});

const right = computed(() => {
  return (props.max - props.value) / (props.max - props.min) * 100;
});

</script>

<template>
  <div class="dili-progress-bar">
    <div class="dili-progress-bar__front" :style="{'right': `${right}%`}">

    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.dili-progress-bar {
  height: .5rem;
  min-width: 5rem;
  border-radius: .5rem;
  background-color: $color-grey-200;
  position: relative;
  overflow: hidden;

  &__front {
    @extend %transition-all-circ;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: $color-primary;
  }
}
</style>