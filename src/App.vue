<script setup lang="ts">
import { RouterView } from 'vue-router';
import CommonHeader from "@/components/header/CommonHeader.vue";
import PostItemCard from "@/pages/common/post/components/PostItemCard.vue";
</script>

<template>
  <div class="background"></div>
  <CommonHeader />
  <RouterView v-slot="{ Component }">
    <Transition name="slide-fade">
      <component  class="child-view" :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss">
@import "@/assets/animations";
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-image: url("@/assets/img/bg.png");
}
.child-view {
  transition: all .2s cubic-bezier(.55, 0, .1, 1);
}
</style>
