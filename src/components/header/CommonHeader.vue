<template>
  <header>
    <ul class="left-entry">
      <li v-for="entry in leftEntries" :key="entry.key" @click="(e) => handleEntryClick(e, entry)">
        <span>{{ entry.name }}</span>
      </li>
    </ul>
    <div class="center-search-container">
      <div class="center-search-bar">
        <form>
          <input v-model="form.searchVal" @change="e => form.searchVal = e.target.value" type="text" id="nav-search-input" placeholder="搜索" />
          <Search />
        </form>
        <div id="search-panel">

        </div>
      </div>
    </div>
    <ul class="right-entry">
      <li v-for="entry in rightEntries" :key="entry.key" @click="(e) => handleEntryClick(e, entry)">
        <span>{{ entry.name }}</span>
      </li>
    </ul>
    <Button @click="e => handleEntryClick(e, {key: 'upload', name: '投稿', href: '/upload'})">
      投稿
    </Button>
  </header>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Search } from "@icon-park/vue-next";
import { useRouter } from "vue-router";
import showToast from "@/components/toast/toast";

type Entry = {
  key: string;
  name: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
};
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

const form = reactive({
  searchVal: "",
});
</script>

<style scoped lang="scss">
@import "@/assets/main";

header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 3rem;
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
    height: 100%;
    cursor: pointer;
    padding: .75rem 1rem;
    box-sizing: border-box;
    transition: background-color .2s $ease-out-circ;
    &:hover {
      background-color: $color-hover;
    }
    span {
      a {
        text-decoration: none;
        color: $color-black;
      }
    }
  }
}
.left-entry {

}
.center-search {
  flex: 1;
  &-container {
    flex: 1;

  }
  &-bar {
    height: 1.75rem;
    min-width: 180px;
    max-width: 500px;
    position: relative;
    margin: 0 auto;
    padding: .25rem .5rem;
    background: $color-grey;
    border-radius: .5rem;
    transition: background-color .2s $ease-out-circ;
    &:focus-within {
      background: $color-active;
    }

    form {
      height: 100%;
      border-radius: .5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      input {
        flex: 1;
        width: 100%;
        outline: none;
        border: none;
        background-color: transparent;
      }
    }
  }
}
.right-entry {

}
</style>