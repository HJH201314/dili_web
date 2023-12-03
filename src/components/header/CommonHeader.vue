
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { Search } from "@icon-park/vue-next";
import { useRouter } from "vue-router";
import showToast from "@/components/toast/toast";
import useUserStore from "@/stores/useUserStore";
import LoginModal from "@/components/login-modal/LoginModal.vue";
import type { CommonModalFunc } from "@/components/modal/CommonModal";
import DiliTooltip from "@/components/tooltip/DiliTooltip.vue";

const userStore = useUserStore();

/* 页面挂载时初始化 */
onMounted(() => {
  /* TODO: 初始化搜索框 */
});

/* 定义入口项属性 */
type Entry = {
  key: string;
  name: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
};
/* 左侧列表 */
const leftEntries = ref<Entry[]>([
  {
    key: "home",
    name: "首页",
    icon: 'home',
    href: "/home",
  },
  {
    key: "anime",
    name: "番剧",
    icon: 'anime',
    href: "/anime",
  },
  {
    key: "live",
    name: "直播",
    icon: 'live',
    href: "/live",
  },
  {
    key: "game",
    name: "游戏中心",
    icon: 'game',
    href: "/game",
  },
]);
/* 右侧列表 */
const rightEntries = ref<Entry[]>([
  {
    key: "vip",
    name: "会员",
    icon: 'vip',
    href: "/vip",
  },
  {
    key: "message",
    name: "消息",
    icon: 'message',
    href: "/message",
  },
  {
    key: "post",
    name: "动态",
    icon: 'post',
    href: "/post",
  },
  {
    key: "later",
    name: "稍后再看",
    icon: 'later',
    href: "/later",
  },
  {
    key: "history",
    name: "历史",
    icon: 'history',
    href: "/history",
  },
  {
    key: "platform",
    name: "创作中心",
    icon: 'platform',
    href: "/platform",
  },
]);

const router = useRouter();
function handleEntryClick(e: Event, entry: Entry) {
  if (entry.href) {
    if (entry.href == router.currentRoute.value.path) return;
    router.push(entry.href);
  } else if (entry.onClick) {
    entry.onClick();
  }
  showToast({text: entry.name, position: 'top'});
}

const refLoginModal = ref<CommonModalFunc>();
function handleLoginClick() {
  // 展示登录模态框
  refLoginModal.value?.open();
}
async function handleLogoutClick() {
  const res = await userStore.logout();
  if (res) {
    showToast({text: '登出成功', position: 'top'});
  } else {
    showToast({text: '登出请求失败，已强制登出', position: 'top'});
  }
}

const isSearching = ref(false);
const searchContainer = ref<HTMLDivElement>();
const form = reactive({
  searchVal: "",
});
</script>

<template>
  <div class="common-header">
    <div class="header-placeholder" style="height: 3.5rem;"></div>
    <header>
      <ul class="left-entry">
        <li v-for="entry in leftEntries" :key="entry.key" @click="(e) => handleEntryClick(e, entry)">
          <span>{{ entry.name }}</span>
          <div v-if="entry.href == router.currentRoute.value.path" class="active-underline" />
        </li>
      </ul>
      <div class="center-search-container" ref="searchContainer" @focusout="() => isSearching = false">
        <div class="center-search-bar" :class="{'center-search-bar-focus': isSearching}" @focusin="() => isSearching = true">
          <form :class="{'focus': isSearching}">
            <input v-model="form.searchVal" type="text" id="nav-search-input" placeholder="搜点什么呢...?" />
            <Search class="search" size="1.25rem" />
          </form>
          <Transition name="opacity-circ">
            <div v-if="isSearching" class="center-search-panel">
              123<br>123<br>123<br>123<br>123<br>123<br>123<br>123<br>123<br>123<br>
            </div>
          </Transition>
        </div>
      </div>
      <ul class="right-entry">
        <DiliTooltip position="bottom" :enabled="userStore.isLogin">
          <div class="nav-user-container" @click="showToast({text: userStore.userInfo, position: 'top', duration: 'long'})">
            <span v-if="!userStore.isLogin" @click="handleLoginClick">登录/注册</span>
            <img class="nav-user-avatar" v-if="userStore.isLogin" :src="userStore.avatar ?? '/favicon.ico'"  alt="avatar"/>
          </div>
          <template #tip>
            <div class="nav-user-logout" @click="handleLogoutClick">点我登出</div>
          </template>
        </DiliTooltip>
        <li v-for="entry in rightEntries" :key="entry.key" @click="(e) => handleEntryClick(e, entry)">
          <span>{{ entry.name }}</span>
          <div v-if="entry.href == router.currentRoute.value.path" class="active-underline" />
        </li>
      </ul>
      <button id="upload-button" @click="e => handleEntryClick(e, {key: 'upload', name: '投稿', href: '/upload'})">
        投稿
      </button>
      <LoginModal ref="refLoginModal" />
    </header>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  background-color: white;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
  z-index: 1;

  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);

  ul {
    height: 100%;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
  }
  li {
    @extend %click-able;
    position: relative;
    height: 100%;
    cursor: pointer;
    padding: 1rem;
    box-sizing: border-box;
    span {
      a {
        text-decoration: none;
        color: $color-black;
      }
    }

    .active-underline {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      right: 0;
      background-color: $color-primary;
      height: 2px;
    }
  }
}
.left-entry {

}
.center-search {
  flex: 1;
  &-container {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  &-bar {
    flex: 1;
    height: 2.5rem;
    min-width: 180px;
    max-width: 500px;
    position: relative;
    background: $color-grey;
    border-radius: .5rem;
    transition: background-color .2s $ease-out-circ;
    //&:focus-within {
    //  background: $color-active;
    //}

    form {
      height: 100%;
      padding: 0 .25rem;
      border-radius: .5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      gap: .5rem;
      background-color: $color-grey;
      @extend %transition-all-circ;
      &.focus {
        background: white;
        border-radius: .5rem .5rem 0 0;
        border-left: solid 1px $color-grey-400;
        border-right: solid 1px $color-grey-400;
        border-top: solid 1px $color-grey-400;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
      }
      input {
        flex: 1;
        line-height: 2rem;
        border-radius: .25rem;
        width: 100%;
        outline: none;
        border: none;
        background: $color-grey;
        padding: 0 .5rem;
      }
      .search {
        cursor: pointer;
        padding: .4rem;
        margin-right: .25rem;
        border-radius: .5rem;
        @extend %click-able;
      }
    }
  }

  &-panel {
    @extend %transition-all-circ;
    background: white;
    border-radius: 0 0 .5rem .5rem;
    border-left: solid 1px $color-grey-400;
    border-right: solid 1px $color-grey-400;
    border-bottom: solid 1px $color-grey-400;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.08);
  }
}
.nav-user {
  &-container {
    @extend %click-able;
    height: 100%;
    padding: 1rem;
    cursor: pointer;
    box-sizing: border-box;
  }
  &-avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    transition: transform .2s $ease-out-circ;
    &:hover {
      transform: rotate(-360deg);
    }
  }
  &-logout {
    background-color: white;
    white-space: nowrap;
    cursor: pointer;
    font-size: .8rem;
  }
}
.right-entry {
}
#upload-button {
  border: none;
  cursor: pointer;
  height: 2rem;
  width: 4.5rem;
  padding: 0 1rem;
  border-radius: .5rem;
  background: $color-primary;
  color: white;
  transition: background-color .2s $ease-out-circ;
  &:hover {
    background-color: shade-color($color-primary, 5%);
  }
  &:active {
    background-color: shade-color($color-primary, 10%);
  }
}
</style>