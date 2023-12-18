<script setup lang="ts">

import DiliButton from "@/components/button/DiliButton.vue";
import { onMounted, ref, toValue, watch } from "vue";
import type { UserCardProps } from "@/components/user-card/UserCard";
import variables from "@/assets/variables.module.scss";
import useFollowCacheStore from "@/stores/useFollowCacheStore";
import DiliPopover from "@/components/popover/DiliPopover.vue";
import router from "@/router";

const props = withDefaults(defineProps<UserCardProps>(), {
  uid: 1,
  name: '匿名用户',
  fanNum: 2,
  videoNum: 1,
  level: 6,
  isFollowed: false,
});

const user = ref<UserCardProps>({});
const followCacheStore = useFollowCacheStore();

onMounted(() => {
  user.value = { ...props };
  user.value.isFollowed = followCacheStore.isFollowed(user.value.uid);
});

watch(() => props.name, (v) => {
  if (v) {
    user.value = { ...props };
  }
});

function handleFollow() {
  if (!user.value.isFollowed) {
    followCacheStore.follow(user.value.uid);
    user.value.isFollowed = followCacheStore.isFollowed(user.value.uid);
  }
}

function handleUnfollow() {
  followCacheStore.unfollow(user.value.uid);
  user.value.isFollowed = followCacheStore.isFollowed(user.value.uid);
}

function goToSpace() {
  router.push(`/space/${user.value.uid}`);
}
</script>

<template>
  <div class="user-card">
    <section class="avatar" @click="goToSpace">
      <img :src="avatar ?? `/avatar/${Math.ceil(Math.random() * 30)}.png`" />
    </section>
    <section class="info">
      <div class="name" @click="goToSpace">
        {{ user.name }}
      </div>
      <div class="statistic">
        {{ user.fanNum }}粉丝 · {{ user.videoNum }}视频
      </div>
      <DiliPopover class="follow" position="bottom">
        <template #body>
          <div @click="handleFollow">
            <DiliButton v-if="!user.isFollowed" :button-style="{width: '100%'}" text="+关注" type="primary" />
            <DiliButton v-else :button-style="{width: '100%'}" text="已关注" type="primary"
                        :background-color="variables.colorGrey200" :font-color="variables.colorGrey400" />
          </div>
        </template>
        <template #popover>
          <div class="action-menu" v-if="user.isFollowed">
            <DiliButton text="设置分组"></DiliButton>
            <DiliButton text="取消关注" @click="handleUnfollow"></DiliButton>
          </div>
        </template>
      </DiliPopover>
    </section>
  </div>
</template>

<style scoped lang="scss">
.user-card {
  display: flex;
  gap: 1rem;

  > .avatar {
    cursor: pointer;
    height: 6rem;
    width: 6rem;
    border-radius: 50%;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  > .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    > .name {
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: bold;
    }
    > .statistic {
      font-size: .8rem;
      font-weight: lighter;
    }
    > .follow {
      width: 100%;
    }
  }
}
.action-menu {
  display: flex;
  flex-direction: column;

  &-item {}
}
</style>