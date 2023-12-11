<script setup lang="ts">

import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import type { CSSProperties } from "vue";
import VideoCard from "@/components/video-card/VideoCard.vue";
import type { VideoCardProps } from "@/components/video-card/VideoCard";
import services from "@/apis/services";
import useUserStore from "@/stores/useUserStore";

import type { FormInstance } from "element-plus";

const userStore = useUserStore();

type SpaceVideoTabProps = {
  uid?: number;
  autoHeight?: boolean; // 是否自动计算高度，限制不超过页面
}
const props = withDefaults(defineProps<SpaceVideoTabProps>(), {
  autoHeight: true,
});

const uid = ref(props.uid ?? userStore.userInfo.id ?? 0);
const isSelf = computed(() => {
  return userStore.userInfo.id === uid.value;
});

const videoList = ref<VideoCardProps[]>();

onMounted(() => {
  Promise.all([
    getVideos()
  ]).then(() => {
  });
});

const containerRef = ref<HTMLDivElement>();

function getContainerStyle() {
  const styles: CSSProperties = {};
  if (props.autoHeight) {
    // @ts-ignore
    styles.maxHeight = `calc(100vh - ${document.querySelector('#space-tab-video')?.offsetTop}px - 5.5rem)`; // 使用原生DOM查询，避免Transition组件导致的虚拟DOM的offsetTop错误
    // @ts-ignore
    styles.height = `calc(100vh - ${document.querySelector('#space-tab-video')?.offsetTop}px - 5.5rem)`; // 使用原生DOM查询，避免Transition组件导致的虚拟DOM的offsetTop错误
  }
  return styles;
}

async function getVideos() {
  try {
    if (!props.uid) return;
    const res = await services.adminService.userInfoController.getUserVideoUsingGet({
      uid: props.uid,
      page: currentPage.value,
      size: pageSize.value,
    });
    if (res.data?.code == 200) {
      res.data?.data?.list?.map((v) => {
        videoList.value?.push({
          vid: v?.id!,
        });
      });
    }
  } finally {

  }
}

const currentPage = ref(1);
const pageSize = ref(20);

</script>

<template>
  <div ref="containerRef" id="space-tab-video" class="space-tab-video" :style="getContainerStyle()">
    <section class="video-list">
      <VideoCard class="video-list-item" v-for="item in videoList" v-bind="item" auto-fetch />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.space-tab-video {
  position: relative;
  border-radius: .5rem;
  box-shadow: $box-shadow;
  background-color: white;
  padding: .5rem;
  .video-list {
    display: grid;
    column-gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
    &-item {
      margin-bottom: .5rem;
      &-footer {
        padding-left: .2rem;
        font-size: .8rem;
        color: $color-grey-500;
      }
    }
  }
}
</style>