<script setup lang="ts">

import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import type { CSSProperties } from "vue";
import VideoCard from "@/components/video-card/VideoCard.vue";
import type { VideoCardProps } from "@/components/video-card/VideoCard";
import services from "@/apis/services";
import useUserStore from "@/stores/useUserStore";

const userStore = useUserStore();

type SpaceStarTabProps = {
  uid?: number;
  autoHeight?: boolean; // 是否自动计算高度，限制不超过页面
}
const props = withDefaults(defineProps<SpaceStarTabProps>(), {
  autoHeight: true,
});

const uid = ref(props.uid ?? userStore.userInfo.id ?? 0);

type CollectionItem = {
  id: string;
  name: string;
  count: number;
  creator: number;
}
const collections = ref<CollectionItem[]>();

onMounted(() => {
  Promise.all([
    getCollections()
  ]).then(() => {
  });
});

const containerRef = ref<HTMLDivElement>();

function getContainerStyle() {
  const styles: CSSProperties = {};
  if (props.autoHeight) {
    // @ts-ignore
    styles.maxHeight = `calc(100vh - ${document.querySelector('#space-tab-star')?.offsetTop}px - 5.5rem)`; // 使用原生DOM查询，避免Transition组件导致的虚拟DOM的offsetTop错误
    styles.height = `calc(100vh - ${document.querySelector('#space-tab-star')?.offsetTop}px - 5.5rem)`; // 使用原生DOM查询，避免Transition组件导致的虚拟DOM的offsetTop错误
  }
  return styles;
}

async function getCollections() {
  try {
    collections.value = [];
    const res = await services.starService.shoucang.listStarByUidUsingGet({
      uid: props.uid,
    });
    if (res.data?.code == 200) {
      res.data?.data?.list?.map((v) => {
        collections.value?.push({
          id: v.id,
          name: v.starName,
          count: v.starNum,
          creator: v.uid,
        });
      });
    }
  } finally {

  }
}

const currentCollection = ref<CollectionItem>();
const currentPage = ref(1);
const pageSize = ref(20);
function handleCollectionChange(item: CollectionItem) {
  currentCollection.value = item;
  getVideoList(item.id);
}

type StaredVideoItem = VideoCardProps & {
  starDate: string; // 收藏日期
}
const starList = ref<StaredVideoItem[]>([]);
/**
 * 获取收藏夹中的视频列表
 * @param sid 收藏夹ID
 */
async function getVideoList(sid: string) {
  try {
    const res = await services.starService.shoucang.listStarContentBySidByPageUsingGet({
      sid: sid,
      page: currentPage.value,
      size: pageSize.value,
    });
    if (res.data.code === 200) {
      res.data.data?.list?.map((v) => {
        starList.value.push({
          vid: v.vid!,
          coverUrl: undefined,
          title: v.title,
          upName: v.upName,
          playNum: v.playNum,
          createTime: v.uploadTime,
          starDate: v.starDate,
        })
      });
    }

  } finally {
    if (starList.value.length === 0) {
      for (let i = 0; i < 10; i++) {
        starList.value.push({
          vid: i,
          coverUrl: undefined,
          title: `随机标题${i}`,
          upName: `UP主${i}`,
          playNum: i * 100,
          createTime: new Date().toLocaleString(),
          starDate: new Date().toLocaleDateString(),
        })
      }
    }
  }
}


</script>

<template>
  <div ref="containerRef" id="space-tab-star" class="space-tab-star" :style="getContainerStyle()">
    <aside class="collection-list">
      <div class="collection-list-item" style="justify-content: center; border: 1px dashed grey; margin-bottom: .5rem;">
        <div class="collection-list-item__name">新建收藏夹</div>
        <div class="collection-list-item__count">+</div>
      </div>
      <div class="collection-list-item" :class="{'collection-list-item--active': currentCollection?.id == item.id}"
           v-for="item in collections"
           @click="handleCollectionChange(item)"
      >
        <div class="collection-list-item__name">{{ item.name }}</div>
        <div class="collection-list-item__count" :class="{'collection-list-item__count--active': currentCollection?.id == item.id}">{{ item.count }}</div>
      </div>
    </aside>
    <div style="width: 1px; height: 100%; background-color: #9E9E9E7F; margin: 0;" v-if="currentCollection?.id" />
    <aside class="collection-detail" v-if="currentCollection?.id">
      <section class="collection-info">
        <div class="name">
          {{ currentCollection?.name }}
        </div>
        <div class="creator">
          创建者：{{ currentCollection?.creator }}
        </div>
      </section>
      <hr style="border: 1px solid grey; opacity: 0.3; margin: .5rem 0" />
      <section class="video-list">
        <VideoCard class="video-list-item" v-for="item in starList" v-bind="item">
          <template #footer>
            <div class="video-list-item-footer">
              收藏于 {{ item.starDate }}
            </div>
          </template>
        </VideoCard>
      </section>
    </aside>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.space-tab-star {
  position: relative;
  border-radius: .5rem;
  box-shadow: $box-shadow;
  display: flex;
  gap: .5rem;
  background-color: white;
  padding: .5rem;
  .collection-list {
    flex: 2;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &-item {
      @extend %click-able;
      @extend %button-like;
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      &--active {
        color: white;
        background-color: $color-primary;
        &:hover {
          background-color: darken($color-primary, 5%);
        }
      }
      &__name {

      }
      &__count {
        color: $color-grey-500;
        &--active {
          color: white;
        }
      }
    }
  }
  .collection-detail {
    flex: 7;
    overflow: auto;
    .collection-info {
      > .name {
        font-weight: bold;
        font-size: 1.25rem;
      }
    }
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
}
</style>