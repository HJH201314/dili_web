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
import usePartitionStore from "@/stores/usePartitionStore";
import UserCard from "@/components/user-card/UserCard.vue";
import type { UserCardProps } from "@/components/user-card/UserCard";

const route = useRoute();
const router = useRouter();

const searchLoadingRef = ref<HTMLDivElement>();

onMounted(() => {
  refresh();
});

// 创建 Intersection Observer 实例
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 当目标元素进入视口
    if (entry.isIntersecting) {
      if (entry.target.id == 'search-loading') {
        console.log('元素可见');
        if (hasMoreVideo.value) {
          if (searchForm.type == 'video') {
            getVideos();
          } else if (searchForm.type == 'person') {
            getPersons();
          }
        }
      }
    } else {
      // console.log('元素不可见');
    }
  });
});

type SortType = 'auto' | 'new' | 'hot' | 'dm' | 'star';
type SearchType = 'video' | 'person';
const searchForm = reactive({
  keyword: ref(''),
  type: ref<SearchType>('video'),
  partition: ref<number>(0),
  sort: ref<SortType>('auto'),
  time: ref<number>(0),
  level: ref<number>(0),
  expanded: false,
});

function getSorterIdByName(sorterName: SortType) {
  switch (sorterName) {
    case 'auto':
      return 0;
    case 'new':
      return 2;
    case 'hot':
      return 1;
    case 'dm':
      return 3;
    case 'star':
      return 4;
    default:
      return 0;
  }
}

function refresh() {
  if (route.query.keyword) {
    searchForm.keyword = route.query.keyword as string;
  }
  if (route.query.type as string in ['video', 'person']) {
    // @ts-ignore
    searchForm.type = route.query.type;
    if (searchForm.type == 'video') {
      pageSize.value = 1;
    } else if (searchForm.type == 'person') {
      pageSize.value = 1;
    }
  }
  if (route.query.partition) {
    // @ts-ignore
    searchForm.partition = route.query.partition;
  }
  if (route.query.sort) {
    // @ts-ignore
    searchForm.sort = route.query.sort;
  }
  if (route.query.time) {
    // @ts-ignore
    searchForm.time = route.query.time;
  }
  if (route.query.level) {
    // @ts-ignore
    searchForm.level = route.query.level;
  }
  refreshTabCursor(searchForm.type);
  videoList.value = [];
  userList.value = [];
  pageNum.value = 0;
  hasMoreVideo.value = true;
  observer.unobserve(searchLoadingRef.value!);
  observer.observe(searchLoadingRef.value!);
}

/**
 * 执行搜索，仅改变路由地址
 */
function search() {
  if (searchForm.type == 'video') {
    router.replace(`/search?type=${searchForm.type}&keyword=${searchForm.keyword}&partition=${searchForm.partition}&sort=${searchForm.sort}&time=${searchForm.time}`).then(() => {
      refresh();
    });
  } else if (searchForm.type == 'person') {
    router.replace(`/search?type=${searchForm.type}&keyword=${searchForm.keyword}&level=${searchForm.level}`).then(() => {
      refresh();
    });
  }
}

function handleSearchClick() {
  search();
}

const tabCursorRef = ref<HTMLDivElement>();
function handleTypeChange(type: SearchType) {
  searchForm.type = type;
  pageNum.value = 1;
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

function handleTimeChange(time: number) {
  searchForm.time = time;
  search();
}

function handleLevelChange(level: number) {
  searchForm.level = level;
  search();
}

function handleSearchKeyDown(e: KeyboardEvent) {
  if (e.key == 'Enter' && searchForm.keyword) {
    search();
  }
}

const videoList = ref<VideoCardProps[]>([]);
const userList = ref<UserCardProps[]>([]);
const hasMoreVideo = ref(true);
const pageNum = ref(1);
const pageSize = ref(1);
async function getVideos() {
  if (!hasMoreVideo.value) return;
  pageNum.value += 1;
  try {
    const res = await services.adminService.videoController.searchVideoUsingGet({
      page: pageNum.value,
      size: pageSize.value,
      key: searchForm.keyword,
      pid: searchForm.partition,
      sortBy: getSorterIdByName(searchForm.sort),
      time: searchForm.time,
    });
    if (res.data.code == 200) {
      res.data.data?.list?.forEach((v) => {
        videoList.value?.push({
          pid: v.id,
          title: v.title,
          coverUrl: undefined, // 让组件自己获取
          upName: v.upName,
          upId: undefined,
          duration: v.totalTime,
          dmNum: v.dmNum,
          playNum: v.playNum,
          createTime: v.uploadTime,
        });
      });
      if (res.data.data?.list?.length == 0) {
        hasMoreVideo.value = false;
      } else {
        observer.unobserve(searchLoadingRef.value!);
        observer.observe(searchLoadingRef.value!);
      }
    }
    // for (let i = 0; i < 10; i++) {
    //   videoList.value?.push({
    //     vid: videoList.value?.length + 1,
    //   });
    // }
    // if (res.data.data.list.length == 0) hasMoreVideo.value = false;
  } catch (ignore) {}
}

async function getPersons() {
  if (!hasMoreVideo.value) return;
  pageNum.value += 1;
  try {
    const res = await services.adminService.videoController.searchUserUsingGet({
      page: pageNum.value,
      size: pageSize.value,
      key: searchForm.keyword,
      sortBy: searchForm.level,
    });
    if (res.data.code == 200) {
      res.data.data?.list?.forEach((v) => {
        userList.value?.push({
          uid: v.id,
          level: v.level,
          name: v.name,
          videoNum: v.video,
          fanNum: v.fan,
        });
      });
      if (res.data.data?.list?.length == 0) {
        hasMoreVideo.value = false;
      } else {
        observer.unobserve(searchLoadingRef.value!);
        observer.observe(searchLoadingRef.value!);
      }
    }
    // for (let i = 0; i < 10; i++) {
    //   videoList.value?.push({
    //     vid: videoList.value?.length + 1,
    //   });
    // }
    // if (res.data.data.list.length == 0) hasMoreVideo.value = false;
  } catch (ignore) {}
}

const partitionStore = usePartitionStore();
function handlePartitionChange(pid: number) {
  searchForm.partition = pid;
  handleSearchClick();
}
</script>

<template>
  <div class="search-page">
<!--    <section class="search-bar">-->
<!--      <div class="search-bar-container">-->
<!--        <CusInput class="search-bar-input" placeholder="搜点什么呢..?" v-model="searchForm.keyword"-->
<!--                  @keydown="handleSearchKeyDown" />-->
<!--        <DiliButton class="search-bar-button" text="搜索" type="primary" :button-style="{ 'height': '100%', 'padding-inline': '2rem'}" @click="handleSearchClick" />-->
<!--&lt;!&ndash;        <form @submit.prevent="handleSearch">&ndash;&gt;-->
<!--&lt;!&ndash;          <input ref="searchInputRef" v-model="searchForm.keyword" type="text" id="nav-search-input" placeholder="搜点什么呢...?"/>&ndash;&gt;-->
<!--&lt;!&ndash;          <Search class="search" size="1.25rem" @click="handleSearch" />&ndash;&gt;-->
<!--&lt;!&ndash;        </form>&ndash;&gt;-->
<!--      </div>-->
<!--    </section>-->
    <section class="search-tab" style="margin-top: 2rem">
      <div id="search-tab-type-video" class="search-tab-item" :class="{'search-tab-item--active': searchForm.type == 'video'}" @click="handleTypeChange('video')">
        视频
      </div>
      <div id="search-tab-type-person" class="search-tab-item" :class="{'search-tab-item--active': searchForm.type == 'person'}" @click="handleTypeChange('person')">
        用户
      </div>
      <div ref="tabCursorRef" class="search-tab-cursor"></div>
    </section>
    <hr />
    <div style="display: contents;" v-if="searchForm.type == 'video'">
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
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.sort == 'dm'}" @click="handleSortChange('dm')">
          最多弹幕
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.sort == 'star'}" @click="handleSortChange('star')">
          最多收藏
        </div>
        <div style="margin-left: auto;" class="search-sort-item" :class="{'search-sort-item--active': searchForm.expanded}" @click="searchForm.expanded = !searchForm.expanded">
          {{ searchForm.expanded ? '收起' : '展开' }}
        </div>
      </section>
      <section class="search-sort" v-if="searchForm.expanded">
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.time == 0}" @click="handleTimeChange(0)">
          全部
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.time == 1}" @click="handleTimeChange(1)">
          1-10分钟
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.time == 2}" @click="handleTimeChange(2)">
          10-30分钟
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.time == 3}" @click="handleTimeChange(3)">
          30-60分钟
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.time == 4}" @click="handleTimeChange(4)">
          60分钟以上
        </div>
      </section>
      <section class="search-sort" v-if="searchForm.expanded">
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.partition == 0}" @click="handlePartitionChange(0)">
          全部
        </div>
        <div class="search-sort-item" v-for="item in partitionStore.partition" :class="{'search-sort-item--active': searchForm.partition == item.id!}" @click="handlePartitionChange(item.id!)">
          {{ item.name }}
        </div>
      </section>
      <section class="search-result">
        <TransitionGroup name="ease-in">
          <VideoCard :key="item.vid" v-for="item in videoList" v-bind="item" auto-fetch />
        </TransitionGroup>
      </section>
    </div>
    <div style="display: contents" v-else-if="searchForm.type == 'person'">
      <section class="search-sort">
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.level == 0}" @click="handleLevelChange(0)">
          默认排序
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.level == 1}" @click="handleLevelChange(1)">
          粉丝数由高到低
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.level == 2}" @click="handleLevelChange(2)">
          粉丝数由低到高
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.level == 3}" @click="handleLevelChange(3)">
          Lv等级由高到低
        </div>
        <div class="search-sort-item" :class="{'search-sort-item--active': searchForm.level == 4}" @click="handleLevelChange(4)">
          Lv等级由低到高
        </div>
      </section>
      <section class="search-result">
        <TransitionGroup name="ease-in">
          <UserCard :key="item.uid" v-for="item in userList" v-bind="item" auto-fetch />
        </TransitionGroup>
      </section>
    </div>
    <section ref="searchLoadingRef" class="search-loading" id="search-loading">
      {{ hasMoreVideo ? '加载中...' : '没有更多了>_<' }}
    </section>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
@import "@/assets/animations";
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
    margin: .5rem 0;
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