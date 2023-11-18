<script setup lang="ts">
type SpinningProps = {
  show?: boolean;
  color?: string | string[];
};

const props = withDefaults(defineProps<SpinningProps>(), {
  show: true,
  color: '#fff',
});
</script>

<template>
  <div class="damping-circle" v-show="show"></div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';
@keyframes spinning-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinning-scale {
  0%, 100% {
    scale: 1;
  }
  50% {
    scale: 0.8;
  }
}

.damping-circle {
  position: relative;
  width: 1rem;
  height: 1rem;
  border: 2px solid v-bind(color);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spinning-rotate 1.5s linear infinite, spinning-scale 1.5s $ease-out-circ infinite;
}

</style>