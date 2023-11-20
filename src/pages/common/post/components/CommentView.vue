<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import useUserStore from "@/stores/useUserStore";
import DateFormat from "@/components/date-format/DateFormat.vue";
import { ThumbsUp, ThumbsDown, Left, Right } from "@icon-park/vue-next";
import { DEFAULT_USER_AVATAR } from "@/constants/defaultImage";
import { useQuery } from "@tanstack/vue-query";
import commentApi from "@/apis/services/video-platform-comment";
import showToast from "@/components/toast/toast";
import useLikeCacheStore from "@/stores/useLikeCacheStore";

const props = withDefaults(defineProps<{
  postId: number; // 动态id
}>(), {
  postId: 0,
});

const emit = defineEmits<{
  (event: 'update-comment-num', num: number): void;
}>();

const userStore = useUserStore();

const sortMode = ref<'hot'|'new'>('hot');

type CommentItem = {
  id: string; // 评论id
  userAvatar: string;
  userName: string;
  userLevel?: number;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createTime: string;
  subComments: CommentItem[];
};

onMounted(() => {
  Promise.all([
    getComments(),
  ]);
});

const commentCount = ref(0);
const commentPageNums = computed(() => {
  const pageNums = [];
  for (let i = 0; i < Math.ceil(commentCount.value / PAGE_SIZE); i++) {
    pageNums.push(i + 1);
  }
  return pageNums;
});
const comments = ref<CommentItem[]>([]);
const MINIMUM_PAGE = 0; // comment的页码从0开始
const PAGE_SIZE = 5;
const currentPage = ref(MINIMUM_PAGE);

const {data: commentsResult, refetch: refetchComments, status: commentQueryStatus} = useQuery({
  queryKey: ['comments', props.postId, currentPage.value],
  queryFn: getComments,
})

watchEffect(async () => {
  if (commentQueryStatus.value !== 'success') return;
  if (!commentsResult.value?.list) return;
  comments.value = [];
  for (const item of commentsResult.value.list) {
    const subComments: CommentItem[] = [];
    for (const subItem of item.children ?? []) {
      subComments.push({
        id: subItem.id ?? '',
        userAvatar: DEFAULT_USER_AVATAR,
        userName: subItem.username ?? '未知用户',
        userLevel: 1,
        content: subItem.content ?? '',
        likeCount: subItem.likeNum ?? 0,
        isLiked: false,
        createTime: subItem.createTime ?? '',
        subComments: [],
      })
    }
    comments.value.push({
      id: item.id ?? '',
      userAvatar: DEFAULT_USER_AVATAR,
      userName: item.username ?? '未知用户',
      userLevel: 1,
      content: item.content ?? '',
      likeCount: item.likeNum ?? 0,
      isLiked: false,
      createTime: item.createTime ?? '',
      subComments: subComments,
    })
  }
})

const form = reactive({
  comment: '',
});

async function getComments() {
  console.log(props.postId)
  if (!props.postId || props.postId <= 0) return;

  try {
    const result = await commentApi.CommentController.listCommentByPagesUsingGET({
      foreignId: props.postId,
      page: currentPage.value,
      size: 5,
      sortBy: sortMode.value === 'hot' ? 'likeNum' : 'createTime',
    });
    commentCount.value = result.data?.data?.total ?? 0;
    emit('update-comment-num', commentCount.value);
    return result.data?.data;
  } catch (e) {
  }

  // const subComments: Comment[] = [];
  // for (let i = 1; i < 3; i++) {
  //   subComments.push({
  //     userAvatar: userStore.avatar ?? '',
  //     userName: '测试用户',
  //     userLevel: 1,
  //     content: '测试'.repeat(20),
  //     likeCount: i * i,
  //     isLiked: false,
  //     createTime: new Date().toLocaleString(),
  //     subComments: [],
  //   });
  // }
  // for (let i = 1; i < 10; i++) {
  //   comments.value.push({
  //     userAvatar: userStore.avatar ?? '',
  //     userName: '测试用户',
  //     userLevel: 1,
  //     content: '测试'.repeat(2) + '回答',
  //     likeCount: i * i,
  //     isLiked: false,
  //     createTime: new Date().toLocaleString(),
  //     subComments: subComments,
  //   });
  // }
}

function changeSortMode(mode: 'hot'|'new') {
  if (mode === sortMode.value) return;
  sortMode.value = mode;
  currentPage.value = MINIMUM_PAGE;
  refetchComments();
}

async function handleCommentPublish() {
  if (!userStore.isLogin) {
    showToast({position: 'top', text: '请先登录'});
    return;
  }
  try {
    const res = await commentApi.CommentController.addCommentUsingPOST({
      foreignId: props.postId,
      content: form.comment,
      targetUsername: '',
      userId: userStore.userId ?? 0,
      phone: userStore.userInfo.name ?? '',
    });
    if (res.data.code == 200) {
      showToast({position: 'top', text: '评论成功'});
      clearInput();
      refetchComments();
    } else {
      showToast({position: 'top', text: '评论失败'});
    }
  } finally {

  }
}

const likeCacheStore = useLikeCacheStore();
async function handleLike(pid: string, isChild: boolean) {
  try {
    if (!isChild) {
      const flag = likeCacheStore.isLiked(pid) ? -1 : 1;
      const res = await commentApi.CommentController.likeRootCommentUsingPOST({
        pid: pid,
        flag: flag,
      });
      if (res.data.code == 200) {
        likeCacheStore.like(pid);
        comments.value.forEach((item) => {
          if (item.id === pid) {
            item.likeCount += flag;
            item.isLiked = true;
          }
        });
        showToast({position: 'top', text: (flag < 0 ? '取消' : '') + '点赞成功'});
      } else {
        showToast({position: 'top', text: '点赞失败'});
      }
    } else {

    }
  } finally {

  }
}
async function handleDislike(pid: string, isChild: boolean) {
  try {
    if (!isChild) {
      if (likeCacheStore.isLiked(pid)) {
        await handleLike(pid, false);
      }
      likeCacheStore.dislike(pid);
      showToast({position: 'top', text: '点踩成功'});
    } else {

    }
  } finally {

  }
}

function handleChangePage(paginationPage: number) {
  currentPage.value = paginationPage + MINIMUM_PAGE - 1;
  refetchComments();
}

function clearInput() {
  form.comment = '';
  currentPage.value = MINIMUM_PAGE;
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
        <img :src="userStore.avatar ?? DEFAULT_USER_AVATAR" alt="avatar" />
      </div>
      <div class="input">
        <textarea placeholder="你猜我的评论区在等谁？" v-model="form.comment" />
      </div>
      <button class="publish" :class="{'enable': form.comment.length > 0}" @click="handleCommentPublish" :disabled="!form.comment.length">
        <span>发布</span>
      </button>
    </div>
    <div class="comment-list">
      <div class="item" v-for="comment in comments">
        <div class="avatar"><img :src="comment.userAvatar || DEFAULT_USER_AVATAR" /></div>
        <div class="body">
          <div class="header user-info">
            <span class="name">{{ comment.userName }}</span>
            <span class="level" v-if="comment.userLevel">Lv.{{ comment.userLevel }}</span>
          </div>
          <div class="content">{{ comment.content }}</div>
          <div class="footer">
            <DateFormat :date="comment.createTime" class="time" />
            <span class="like" :class="{'active': likeCacheStore.isLiked(comment.id)}" @click="handleLike(comment.id, false)"><thumbs-up theme="outline" size="1rem"/>{{ comment.likeCount }}</span>
            <span class="dislike" :class="{'active': likeCacheStore.isDisliked(comment.id)}" @click="handleDislike(comment.id, false)"><thumbs-down theme="outline" size="1rem"/></span>
            <span class="reply">回复</span>
          </div>
          <div class="sub-comment-list">
            <div class="item" v-for="subComment in comment.subComments">
              <div class="avatar-small"><img :src="subComment.userAvatar || DEFAULT_USER_AVATAR" /></div>
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
      <div class="pagination" v-if="commentCount > comments.length">
        <button class="button" :disabled="currentPage - 1 < MINIMUM_PAGE" @click="handleChangePage(currentPage - MINIMUM_PAGE)"><Left class="button" size="1rem" /></button>
        <div v-for="i in commentPageNums" :class="{'active': currentPage - MINIMUM_PAGE + 1 == i}" @click="handleChangePage(i)">
          <span>{{ i }}</span>
        </div>
        <button class="button" :disabled="currentPage - MINIMUM_PAGE + 2 > commentPageNums.length" @click="handleChangePage(currentPage - MINIMUM_PAGE + 2)"><Right class="button" size="1rem" /></button>
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
              font-size: .9rem;
              color: $color-primary;
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
          font-size: .9rem;
          color: $color-black-lighter;
        }
        .footer {
          margin-top: .5rem;
          display: flex;
          gap: 1rem;
          .time {
            font-size: .75rem;
            color: $color-grey-500;
          }
          .like, .dislike {
            cursor: pointer;
            font-size: .75rem;
            color: $color-grey-500;
            &.active {
              color: $color-primary;
            }
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

    > .pagination {
      display: flex;
      justify-content: flex-end;
      gap: .25rem;
      margin-bottom: .5rem;

      div {
        @extend %click-able;
        @extend %button-like;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        vertical-align: center;
        position: relative;
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        &.active {
          background-color: $color-primary;
          color: white;
        }
      }

      > .button {
        &:disabled {
          cursor: default;
        }
        &:not(&:disabled) {
          @extend %click-able;
        }
        background-color: $color-grey-100;
        color: darken($color-grey-500, 50%);
        width: 1.5rem;
        height: 1.5rem;
        border-radius: .5rem;
        position: relative;
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

}
</style>