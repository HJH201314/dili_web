<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useUserStore from "@/stores/useUserStore";

const userStore = useUserStore();

const commentCount = ref(0);
const sortMode = ref<'hot'|'new'>('hot');

type Comment = {
  userAvatar: string;
  userName: string;
  userLevel?: number;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createTime: string;
  subComments: Comment[];
};


onMounted(() => {
  Promise.all([
    getComments(),
  ]);
});

const comments = ref<Comment[]>([]);

const form = reactive({
  comment: '',
});

async function getComments() {
  const subComments: Comment[] = [];
  for (let i = 1; i < 3; i++) {
    subComments.push({
      userAvatar: userStore.avatar ?? '',
      userName: '测试用户',
      userLevel: 1,
      content: '测试'.repeat(100),
      likeCount: i * i,
      isLiked: false,
      createTime: new Date().toLocaleString(),
      subComments: [],
    });
  }
  for (let i = 1; i < 10; i++) {
    comments.value.push({
      userAvatar: userStore.avatar ?? '',
      userName: '测试用户',
      userLevel: 1,
      content: '测试'.repeat(100),
      likeCount: i * i,
      isLiked: false,
      createTime: new Date().toLocaleString(),
      subComments: subComments,
    });
  }
}

function changeSortMode(mode: 'hot'|'new') {
  sortMode.value = mode;
}
</script>

<template>
  <div class="comment-view">
    <div class="header">
      <span class="title">评论</span>
      <span class="count">{{ commentCount }}</span>
      <span class="sort-hot" :class="{'active': sortMode == 'hot'}" @click="changeSortMode('hot')">最热</span>
      <span>|</span>
      <span class="sort-new" :class="{'active': sortMode == 'new'}" @click="changeSortMode('new')">最新</span>
    </div>
    <div class="comment-publish">
      <div class="avatar">
        <img :src="userStore.avatar" alt="avatar" />
      </div>
      <div class="input">
        <textarea placeholder="你猜我的评论区在等谁？" v-model="form.comment" />
      </div>
      <div class="publish" :class="{'enable': form.comment.length > 0}">
        <span>发布</span>
      </div>
    </div>
    <div class="comment-list">
      <div class="item" v-for="comment in comments">

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.comment-view {

  .header {
    height: 3rem;
    color: $color-grey-500;

    .title {
      font-size: 1.5rem;
      color: $color-black-lighter;
      margin-left: 1rem;
    }
    .count {
      margin-left: 1rem;
      margin-right: 3rem;
    }
    .sort-hot, .sort-new {
      margin: 0 1rem;
      &:not(&.active) {
        cursor: pointer;
      }
      &.active {
        color: $color-black-lighter;
      }
    }
  }
  .comment-publish {
    margin-left: 2rem;
    display: flex;
    gap: .5rem;

    .avatar {
      width: 3rem;
      height: 3rem;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    .input {
      @extend %transition-all-circ;
      flex: 1;
      border-radius: .5rem;
      background-color: $color-grey-100;
      padding: .5rem;
      &:focus-within {
        background-color: $color-grey-200;
      }

      textarea {
        width: 100%;
        background: transparent;
        height: 2rem;
      }
    }
    .publish {
      @extend %button-like;
      @extend %transition-all-circ;
      color: white;
      width: 5rem;
      background-color: $color-primary-lighter;
      display: grid;
      place-items: center;
      &.enable {
        background-color: $color-primary;
      }
    }
  }

}
</style>