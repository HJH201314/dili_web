<script setup lang="ts">

import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import type { CSSProperties } from "vue";
import VideoCard from "@/components/video-card/VideoCard.vue";
import type { VideoCardProps } from "@/components/video-card/VideoCard";
import services from "@/apis/services";
import useUserStore from "@/stores/useUserStore";
import useUserInfo from "@/stores/publicUserInfo";
import { DeleteOne, MoreOne } from "@icon-park/vue-next";
import DiliPopover from "@/components/popover/DiliPopover.vue";
import showToast from "@/components/toast/toast";
import { DialogManager } from "@/components/dialog";
import { getRandomString } from "@/utils/string";

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
  name?: string;
  count?: number;
  creatorId?: number;
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
    // @ts-ignore
    styles.height = `calc(100vh - ${document.querySelector('#space-tab-star')?.offsetTop}px - 5.5rem)`; // 使用原生DOM查询，避免Transition组件导致的虚拟DOM的offsetTop错误
  }
  return styles;
}

async function getCollections() {
  try {
    collections.value = [];
    if (!props.uid) return;
    const res = await services.starService.shoucang.listStarByUidUsingGet({
      uid: props.uid,
    });
    if (res.data?.code == 200) {
      res.data?.data?.list?.map((v) => {
        collections.value?.push({
          id: v.id!,
          name: v.starName,
          count: v.starNum,
          creatorId: v.uid,
        });
      });
    }
    // 若没有当前收藏夹，则将列表第一个设置为当前选中的收藏夹
    if (!currentCollection.value) {
      if (collections.value?.length) {
        currentCollection.value = collections.value[0];
        handleCollectionChange(currentCollection.value);
      }
    }
    // 如果当前收藏夹消失了，那么设置首个收藏夹为当前选中收藏夹；如果没收藏夹了，那么清除当前选中收藏夹
    if (collections.value?.findIndex((v) => {
      return v.id === currentCollection.value?.id;
    }) == -1) {
      if (collections.value?.length) {
        currentCollection.value = collections.value[0];
        handleCollectionChange(currentCollection.value);
      }
      else currentCollection.value = undefined;
    }
  } finally {

  }
}

const currentCollection = ref<CollectionItem>();
const creatorId = computed(() => currentCollection.value?.creatorId); // 不单独compute的话，似乎无法响应变化
const { status: creatorStatus, userInfo: creatorInfo } = useUserInfo(creatorId);
const currentPage = ref(1);
const pageSize = ref(20);
function handleCollectionChange(item: CollectionItem) {
  currentCollection.value = item;
  getVideoList(item.id);
}
function createDialog(props?: any) {
  DialogManager.inputDialog({onCancel: close => close(), onConfirm: () => {
    createDialog({title: getRandomString(5)});
    }, ...props});
}
async function handleCollectionDelete(item: CollectionItem) {
  createDialog();
  try {
    if (parseInt(item.id) <= 0) {
      showToast({ text: '删除失败！', type: 'danger' });
      return;
    }
    const res = await services.starService.shoucang.removeStarUsingDelete({
      sid: item.id
    });
    if (res.data.code == 200) {
      showToast({ text: '删除成功！', type: 'success' });
      getCollections();
    } else {
      showToast({ text: '删除失败！', type: 'danger' });
    }
  } catch (ignore) {}
}

async function handleCollectionAdd() {
  const dialogRes = await DialogManager.inputDialog({ title: '新建收藏夹' }, { placeholder: '请输入新收藏夹的名称~' });
  if (!dialogRes.status) return;
  try {
    const res = await services.starService.shoucang.addStarUsingPost({
      uid: userStore.userInfo?.id!,
      starName: dialogRes.value,
    });
    if (res.data.code == 200) {
      showToast({ text: '创建成功！', type: 'success' });
      getCollections();
    } else {
      showToast({ text: '创建失败！', type: 'danger' });
    }
  } catch (ignore) {}
}

type StaredVideoItem = VideoCardProps & {
  starDate?: string; // 收藏日期
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
      <div class="collection-list-item" style="justify-content: center; border: 1px dashed grey; margin-bottom: .5rem;" @click="handleCollectionAdd">
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
          创建者：{{ creatorStatus == 'loading' ? '加载中...' : creatorInfo?.name }}
        </div>
        <DiliPopover class="more" position="left">
          <template #body>
            <div><MoreOne theme="outline" size="1.25rem" /></div>
          </template>
          <template #popover>
            <div class="more-actions">
              <div class="delete" @click="handleCollectionDelete(currentCollection)"><DeleteOne theme="outline" size="1.25rem" fill="#ff7875" /></div>
            </div>
          </template>
        </DiliPopover>
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
      position: relative;
      // display: grid;
      > .name {
        font-weight: bold;
        font-size: 1.25rem;
      }
      .more {
        position: absolute;
        aspect-ratio: 1;
        top: 1rem;
        right: 0;
        height: 1.75rem;
        width: 1.75rem;
        span {
          @extend %click-able;
          @extend %button-like;
          padding: .25rem;
          vertical-align: center;
        }

        .more-actions {
          z-index: 10;
          height: 1.75rem;
          //position: absolute;
          //top: .5rem;
          //right: 2.5rem;
          border-radius: .5rem;
          align-items: center;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          display: flex;

          .delete {
            height: 100%;
            aspect-ratio: 1;
          }
        }
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