<!-- 动态 -->
<script setup lang="ts">

import { DEFAULT_USER_AVATAR } from "@/constants/defaultImage";
import DateFormat from "@/components/date-format/DateFormat.vue";
import { MoreOne, ShareThree, CommentOne, ThumbsUp } from "@icon-park/vue-next";
import { computed, ref } from "vue";
import type { PostItemCardProps } from "@/pages/common/post/components/PostItemCard";
import CommentView from "@/pages/common/post/components/CommentView.vue";

const props = withDefaults(defineProps<PostItemCardProps>(), {
  type: 'post',
  postId: 0,
  userId: 0,
  userName: '测试用户',
  avatar: DEFAULT_USER_AVATAR,
  forwardCount: 0,
  commentCount: 0,
  likeCount: 0,
  isLiked: false,
  createTime: new Date().toLocaleString(),
  content: '-',
  images: () => [],
});

/* 暴露 */
defineExpose({
  expandPost,
  contractPost,
});

const postTypeDesc = computed(() => {
  switch (props.type) {
    case 'post':
      return '发表了动态';
    case 'video':
      return '发布了视频';
    case 'c':
      return '发布了专栏';
    default:
      return '';
  }
});

const expandType = ref('none');
/* 展开评论详情 */
function expandPost(type: 'none' | 'forward' | 'comment') {
  if (expandType.value === type) {
    // 已经展开则收起
    expandType.value = 'none';
  } else {
    // 收起状态则展开
    expandType.value = type;
  }
}
/* 收起评论详情 */
function contractPost() {
  expandPost('none');
}

function handleLikeClick() {

}

</script>

<template>
  <div class="post-list-item">
    <div class="avatar">
      <img :src="props.avatar" alt="avatar">
    </div>
    <div class="header">
      <div class="username">{{ props.userName }}</div>
      <div class="desc"><DateFormat :date="props.createTime" /> · {{ postTypeDesc }}</div>
      <div class="more"><MoreOne theme="outline" size="1.25rem" /></div>
    </div>
    <div class="body">
      <div v-html="props.content"></div>
      <div class="unfold">展开</div>
    </div>
    <div class="actions">
      <div class="action" :class="{'active': expandType == 'forward'}" @click="expandPost('forward')"><ShareThree /> {{ props.forwardCount }}</div>
      <div class="action" :class="{'active': expandType == 'comment'}" @click="expandPost('comment')"><CommentOne :theme="expandType == 'comment' ? 'filled' : 'outline' " /> {{ props.commentCount }}</div>
      <div class="action" :class="{'active': props.isLiked}" @click="handleLikeClick"><ThumbsUp :theme="props.isLiked ? 'filled' : 'outline'" /> {{ props.likeCount }}</div>
    </div>
    <div class="expand-content" v-if="expandType != 'none'">
      <hr style="margin: .5rem;" />
      <CommentView v-if="expandType == 'comment'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.post-list-item {
  position: relative;
  .avatar {
    position: absolute;
    top: .5rem;
    left: .5rem;
    width: 3rem;
    height: 3rem;
    & img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .header {
    margin-left: 4rem;

    .username {
      font-size: 1rem;
      font-weight: bold;
    }

    .desc {
      font-size: .8rem;
      color: $color-grey-500;
    }

    .more {
      span {
        @extend %click-able;
        @extend %button-like;
        position: absolute;
        top: .5rem;
        right: .5rem;
        padding: .25rem;
        vertical-align: center;
      }
    }
  }

  .body {
    margin-top: .5rem;
    margin-left: 4rem;

    .unfold {
      cursor: pointer;
      color: $color-primary;
    }
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    color: $color-grey-500;

    .action {
      cursor: pointer;

      &.active {
        color: $color-primary;
      }
    }
  }
}
</style>