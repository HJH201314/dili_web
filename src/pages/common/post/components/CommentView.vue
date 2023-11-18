<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useUserStore from "@/stores/useUserStore";
import DateFormat from "@/components/date-format/DateFormat.vue";
import { ThumbsUp, ThumbsDown } from "@icon-park/vue-next";

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
      content: '测试'.repeat(20),
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
      content: '测试'.repeat(2) + '回答',
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
        <div class="avatar"><img :src="comment.userAvatar" /></div>
        <div class="body">
          <div class="header user-info">
            <span class="name">{{ comment.userName }}</span>
            <span class="level" v-if="comment.userLevel">Lv.{{ comment.userLevel }}</span>
          </div>
          <div class="content">{{ comment.content }}</div>
          <div class="footer">
            <DateFormat :date="comment.createTime" class="time" />
            <span class="like"><thumbs-up theme="outline" size="1rem"/>{{ comment.likeCount }}</span>
            <span class="dislike"><thumbs-down theme="outline" size="1rem"/></span>
            <span class="reply">回复</span>
          </div>
          <div class="sub-comment-list">
            <div class="item" v-for="subComment in comment.subComments">
              <div class="avatar-small"><img :src="subComment.userAvatar" /></div>
              <div class="body">
                <div class="header">
                  <div class="user-info">
                    <span class="name">{{ subComment.userName }}</span>
                    <span class="level" v-if="subComment.userLevel">Lv.{{ subComment.userLevel }}</span>
                  </div>
                  <span class="content">{{ subComment.content }}</span>
                </div>
                <div class="footer">
                  <DateFormat :date="subComment.createTime" class="time" />
                  <span class="like"><thumbs-up theme="outline" size="1rem"/>{{ subComment.likeCount }}</span>
                  <span class="dislike"><thumbs-down theme="outline" size="1rem"/></span>
                  <span class="reply">回复</span>
                </div>
              </div>
            </div>
          </div>
          <hr style="margin-right: 5rem;" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.comment-view {

  > .header {
    height: 3rem;
    color: $color-grey-500;

    > .title {
      font-size: 1.5rem;
      color: $color-black-lighter;
      margin-left: 1rem;
    }
    > .count {
      margin-left: 1rem;
      margin-right: 3rem;
    }
    > .sort-hot, > .sort-new {
      margin: 0 1rem;
      &:not(&.active) {
        cursor: pointer;
      }
      &.active {
        color: $color-primary;
      }
    }
  }
  > .comment-publish {
    margin-left: 1.5rem;
    display: flex;
    gap: .5rem;

    > .avatar {
      width: 3rem;
      height: 3rem;
      > img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    > .input {
      @extend %transition-all-circ;
      flex: 1;
      border-radius: .5rem;
      background-color: $color-grey-100;
      padding: .5rem;
      &:focus-within {
        background-color: $color-grey-200;
      }

      > textarea {
        width: 100%;
        background: transparent;
        height: 2rem;
      }
    }
    > .publish {
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

  > .comment-list {
    margin-top: 1rem;
    margin-left: 1.75rem;
    .item {
      display: flex;
      gap: 1rem;
      margin-bottom: .5rem;
      .avatar {
        width: 2.5rem;
        height: 2.5rem;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
      }
      .avatar-small {
        width: 1.75rem;
        height: 1.75rem;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
      }
      .body {
        flex: 1;
        .header {
          // 前者.user-info作用于.header内，对应子评论；后者&.user-info作用于.header同级，对应一级评论
          .user-info, &.user-info {
            display: inline-flex;
            align-items: baseline;
            gap: .5rem;
            margin-right: .5rem;
            word-break: break-word;
            word-wrap: break-word;
            white-space: pre-wrap;
            overflow: hidden;
            .name {
              white-space: nowrap; // 避免挤压换行
              font-size: 1rem;
              color: $color-black-lighter;
            }
            .level {
              white-space: nowrap; // 避免挤压换行
              font-size: .75rem;
              color: $color-grey-500;
            }
          }
          > .content {
            font-size: .9rem;
            word-break: break-word;
            word-wrap: break-word;
            white-space: pre-wrap;
            vertical-align: baseline;
            overflow: hidden;
          }
        }
        > .content {
          margin-top: .5rem;
          font-size: 1rem;
          color: $color-black-lighter;
        }
        .footer {
          margin-top: .5rem;
          display: flex;
          gap: .5rem;
          .time {
            font-size: .75rem;
            color: $color-grey-500;
          }
          .like, .dislike {
            font-size: .75rem;
            color: $color-grey-500;
          }
          .reply {
            font-size: .75rem;
            color: $color-grey-500;
          }
        }
        > .sub-comment-list {
          margin-top: .5rem;
        }
      }
    }
  }

}
</style>