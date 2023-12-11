<script setup lang="ts">


import VideoCard from "@/components/video-card/VideoCard.vue";
import type { VideoCardProps } from "@/components/video-card/VideoCard";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { rangeArr } from "element-plus";
import { Search } from "@icon-park/vue-next";
import CusInput from "@/components/input/CusInput.vue";
import DiliButton from "@/components/button/DiliButton.vue";
import { quickToast } from "@/components/toast/toast";
import services from "@/apis/services";

type VideoSearchResult = VideoCardProps & {};

const resultVideoList = ref<VideoSearchResult[]>();

const route = useRoute();
const router = useRouter();

const searchLoadingRef = ref<HTMLDivElement>();

onMounted(() => {
  refresh();
  observer.observe(searchLoadingRef.value!);
});

// 创建 Intersection Observer 实例
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 当目标元素进入视口
    if (entry.isIntersecting) {
      if (entry.target.id == 'search-loading') {
        console.log('元素可见');
        if (hasMoreVideo.value) {
          getVideos();
        }
      }
    } else {
      // console.log('元素不可见');
    }
  });
});

type SortType = 'auto' | 'new' | 'hot';
type SearchType = 'video' | 'person';
const searchForm = reactive({
  keyword: ref(''),
  type: ref<SearchType>('video'),
  partition: ref<string>(''),
  sort: ref<SortType>('auto')
});

function refresh() {
  if (route.query.keyword) {
    searchForm.keyword = route.query.keyword as string;
  }
  if (route.query.type as string in ['video', 'person']) {
    // @ts-ignore
    searchForm.type = route.query.type;
  }
  if (route.query.partition) {
    // @ts-ignore
    searchForm.partition = route.query.partition;
  }
  if (route.query.sort) {
    // @ts-ignore
    searchForm.sort = route.query.sort;
  }
  refreshTabCursor(searchForm.type);
}

/**
 * 执行搜索，仅改变路由地址
 */
function search() {
  router.replace(`/search?type=${searchForm.type}&keyword=${searchForm.keyword}&partition=${searchForm.partition}&sort=${searchForm.sort}`)
}

/**
 * 观测路径query参数的变化，若发生变化就要刷新
 */
watch(() => route.params, (newVal, oldVal) => {
  refresh();
});
function handleSearchClick() {
  search();

}

const tabCursorRef = ref<HTMLDivElement>();
function handleTypeChange(type: SearchType) {
  searchForm.type = type;
  search();
}
watch(() => searchForm.type, (value, oldValue) => {
  if (value !== oldValue) {
    refreshTabCursor(value);
  }
});

function refreshTabCursor(type: SearchType) {
  const currentTab = document.getElementById(`search-tab-type-${type}`) as HTMLDivElement;
  const left = currentTab?.offsetLeft;
  const width = currentTab?.offsetWidth;
  if (tabCursorRef.value) {
    tabCursorRef.value.style.width = `${width - 20}px`;
    tabCursorRef.value.style.left = `${left + 10}px`;
  }
}

function handleSortChange(method: SortType) {
  searchForm.sort = method;
  search();
}

const videoList = ref<VideoCardProps[]>([]);
const hasMoreVideo = ref(true);
const pageNum = ref(1);
const pageSize = ref(30);
async function getVideos() {
  try {
    const res = await services.adminService.videoController.searchVideoUsingGet({
      page: pageNum.value,
      size: pageSize.value,
      key: searchForm.keyword,
      pid: 0, // todo: support pid
      sortBy: 0, // todo: support sortBy
      time: 0, // todo: support time
    });
    if (res.data.code == 200) {
      res.data.data?.list?.forEach((v) => {
        videoList.value?.push({
          // vid: v.
        });
      });
    }
    for (let i = 0; i < 10; i++) {
      videoList.value?.push({
        vid: videoList.value?.length + 1,
      });
      console.log(videoList)
    }
    // if (res.data.data.list.length == 0) hasMoreVideo.value = false;
  } catch (ignore) {}
}
</script>

<template>
  <div class="search-page">
    <section class="search-bar">
      <div class="search-bar-container">
        <CusInput class="search-bar-input" placeholder="搜点什么呢..?" v-model="searchForm.keyword" />
        <DiliButton class="search-bar-button" text="搜索" type="primary" :button-style="{ 'height': '100%', 'padding-inline': '2rem'}" @click="handleSearchClick" />
<!--        <form @submit.prevent="handleSearch">-->
<!--          <input ref="searchInputRef" v-model="searchForm.keyword" type="text" id="nav-search-input" placeholder="搜点什么呢...?"/>-->
<!--          <Search class="search" size="1.25rem" @click="handleSearch" />-->
<!--        </form>-->
      </div>
    </section>
    <section class="search-tab">
      <div id="search-tab-type-video" class="search-tab-item" :class="{'search-tab-item--active': searchForm.type == 'video'}" @click="handleTypeChange('video')">
        视频
      </div>
      <div id="search-tab-type-person" class="search-tab-item" :class="{'search-tab-item--active': searchForm.type == 'person'}" @click="handleTypeChange('person')">
        用户
      </div>
      <div ref="tabCursorRef" class="search-tab-cursor"></div>
    </section>
    <hr />
    <section class="search-sort">
      <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.sort == 'auto'}" @click="handleSortChange('auto')">
        综合排序
      </div>
      <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.sort == 'hot'}" @click="handleSortChange('hot')">
        最多播放
      </div>
      <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.sort == 'new'}" @click="handleSortChange('new')">
        最新发布
      </div>
    </section>
    <section class="search-result">
      <VideoCard v-for="item in videoList" />
    </section>
    <section ref="searchLoadingRef" class="search-loading" id="search-loading">
      {{ hasMoreVideo ? '加载中...' : '没有更多了>_<' }}
    </section>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.search-page {
  position: relative;

  .search-bar {
    width: 100%;

    &-container {
      width: 30%;
      display: flex;
      justify-content: center;
      margin: 2rem auto;
      gap: 1rem;
      position: relative;
    }
    &-input {
      height: 3rem;
      width: 100%;
      font-size: 1.25rem;
    }
    &-button {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      box-sizing: border-box;
      border: 5px solid transparent;
    }
  }

  .search-tab {
    position: relative;
    padding: 0 10rem;
    display: flex;
    justify-content: flex-start;
    gap: 1rem;

    &-item {
      cursor: pointer;
      font-weight: lighter;
      font-size: 1.1rem;
      padding: .25rem .5rem 1rem .5rem;
    }

    &-cursor {
      position: absolute;
      bottom: 2px;
      background-color: $color-primary;
      height: 2px;
      width: 10px;
      border-radius: 1px;
      transition: left .2s $ease-in-out-back;
    }
  }

  .search-sort {
    margin: 1rem 0;
    padding: 0 10rem;
    display: flex;
    justify-content: flex-start;
    gap: 1rem;

    &-item {
      @extend %transition-all-circ;
      cursor: pointer;
      border-radius: .5rem;
      color: $color-black-lighter;
      padding: .25rem .5rem;

      &:hover {
        color: $color-primary;
      }

      &--active {
        background-color: lighten($color-primary, 50%);
        color: $color-primary;
      }
    }
  }

  .search-result {
    padding: 0 10rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }

  .search-loading {
    margin: 2rem 0;
    text-align: center;
    color: $color-grey-500;
  }
}
</style>