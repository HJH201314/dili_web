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

const videoList = ref<VideoCardProps[]>([]);

onMounted(() => {
  Promise.all([
    getVideos()
  ]).then(() => {
  });
});

const containerRef = ref<HTMLDivElement>();
const loadingRef = ref<HTMLDivElement>();

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

let intersectionObserver;

onMounted(() => {
  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        getVideos();
      }
    });
  }, {
    root: containerRef.value,
  });
  intersectionObserver.observe(loadingRef.value!);
})

const hasMore = ref(true);
async function getVideos() {
  if (!props.uid) return;
  if (hasMore.value) {
    currentPage.value += 1;
  } else return;
  try {
    const res = await services.adminService.userInfoController.getUserVideoUsingGet({
      uid: props.uid,
      page: currentPage.value,
      size: pageSize.value,
    });
    if (res.data?.code == 200 && res.data?.data?.list) {
      if (res.data.data.list.length > 0) {
        res.data?.data?.list?.map((v) => {
          videoList.value?.push({
            pid: v?.id!,
            coverUrl: v?.url,
            title: v?.title,
            upId: undefined,
            upName: v?.upName,
            duration: v?.totalTime,
            createTime: v?.uploadTime,
          });
        });
      } else {
        hasMore.value = false;
      }
    }
  } finally {

  }
}

const currentPage = ref(0);
const pageSize = ref(20);

</script>

<template>
  <div ref="containerRef" id="space-tab-video" class="space-tab-video" :style="getContainerStyle()">
    <section class="video-list">
      <VideoCard class="video-list-item" v-for="item in videoList" v-bind="item" auto-fetch />
    </section>
    <section ref="loadingRef" class="video-loading">
      {{ hasMore ? '加载中...' : '没有更多啦~' }}
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
  overflow: auto;
  padding: .5rem;
  .video-list {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: .5rem .75rem;
    &-item {
      width: calc((100% - 2.25rem) / 4); // 展示四列
      &-footer {
        padding-left: .2rem;
        font-size: .8rem;
        color: $color-grey-500;
      }
    }
  }
  .video-loading {
    text-align: center;
    color: $color-grey-500;
  }
}
</style>