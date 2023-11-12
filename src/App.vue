<script setup lang="ts">
import { RouterView } from 'vue-router';
import CommonHeader from "@/components/header/CommonHeader.vue";
</script>

<template>
  <CommonHeader />
  <RouterView v-slot="{ Component }">
    <Transition name="slide-fade">
      <component  class="child-view" :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss">
@import "@/assets/animations";
.child-view {
  transition: all .2s cubic-bezier(.55, 0, .1, 1);
}
</style>
