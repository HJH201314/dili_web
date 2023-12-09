<script setup lang="ts">
import { RouterView } from 'vue-router';
import CommonHeader from "@/components/header/CommonHeader.vue";

</script>

<template>
  <div class="background"></div>
  <RouterView v-slot="{ Component, route }">
    <Transition name="slide-fade">
      <div style="display: flex; flex-direction: column; height: 100%;">
        <CommonHeader v-if="route.meta.showCommonHeader == undefined || route.meta.showCommonHeader"
                      :search-bar-style="{'opacity': 0.9}"
        />
        <component class="child-view" :is="Component" />
      </div>
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
  z-index: -1;
  background-image: url("@/assets/img/bg.png");
}

.child-view {
  transition: all .2s cubic-bezier(.55, 0, .1, 1);
  flex: 1;
}
</style>

<style>
/*全局样式，em标签包裹搜索关键字高亮 */
em {
  color: #f25d8e;
  font-style: normal;
}
</style>