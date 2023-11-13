<script setup lang="ts">
import useUserStore from "@/stores/useUserStore";
import { DEFAULT_USER_AVATAR } from "@/constants/defaultImage";
import { computed, onMounted, reactive, ref } from "vue";
import { EmotionHappy, Instagram, AtSign, ChartHistogramTwo, Topic, SettingOne } from '@icon-park/vue-next';
import variables from "@/assets/variables.module.scss";

const userStore = useUserStore();

/* 左侧用户卡片的实例 */
const postLeftUserRef = ref<HTMLDivElement>();
/* 左侧用户卡片的高度 */
const postLeftUserHeight = computed(() => {
  return (postLeftUserRef.value?.offsetHeight ?? 0) + 'px';
});

const publishForm = reactive({
  topic: ref(''),
  content: ref(''),
});
</script>

<template>
  <div class="post">
    <div class="post-container">
      <aside class="post-left">
        <section ref="postLeftUserRef" class="post-left-user">
          <div>
            <div class="avatar"><img :src="userStore.avatar ?? DEFAULT_USER_AVATAR" alt="post-user-avatar" /></div>
            <div class="right"><span class="username">测试用户</span><br /><span class="vip">超级会员</span></div>
          </div>
          <div class="stats">
            <div id="post-left-user-follow" class="stats-item"><span>111</span><span>关注</span></div>
            <div id="post-left-user-fans" class="stats-item"><span>23333</span><span>粉丝</span></div>
            <div id="post-left-user-fans" class="stats-item"><span>88</span><span>动态</span></div>
          </div>
        </section>
        <section class="post-left-live">广告位招租</section>
      </aside>
      <main class="post-center">
        <section class="post-center-publish" :style="{'min-height': postLeftUserHeight}">
          <div class="topic">
            <topic theme="outline" size="1rem"/>
            <span>选择话题</span>
          </div>
          <div class="input">
            <textarea placeholder="来分享点什么吧?" v-model="publishForm.content" />
          </div>
          <div class="actions">
            <div class="action"><span class="icon"><emotion-happy theme="outline"/></span></div>
            <div class="action"><span class="icon"><instagram theme="outline"/></span></div>
            <div class="action"><span class="icon"><at-sign theme="outline"/></span></div>
            <div class="action"><span class="icon"><chart-histogram-two theme="outline"/></span></div>
            <span class="length-tip">{{ publishForm.content.length }} / 1000</span>
            <div class="action"><span class="icon"><setting-one theme="outline"/></span></div>
            <button class="publish">发布</button>
          </div>
        </section>
        <section class="post-center-posts">动态招租</section>
      </main>
      <aside class="post-right">
        <section class="post-right-notice">通知招租</section>
        <section class="post-right-topics">话题招租</section>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
@import "@/assets/functions";
.post {
  height: 100%;
  background-image: url("@/assets/img/bg.png");

  &-container {
    position: relative;
    margin: 0 auto;
    padding: 1rem 3rem;
    width: 100%;
    max-width: 1440px;
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }

  %card {
    background-color: white;
    border-radius: .5rem;
    padding: .5rem;
  }

  &-left {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    &-user {
      @extend %card;
      & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-top: .5rem;
        &:not(:last-child) {
          // 非最后一个元素，添加下外边距
          margin-bottom: .5rem;
        }
      }
      & .avatar {
        width: 4rem;
        height: 4rem;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-position: center;
          object-fit: cover;
        }
      }
      & .username {
        font-size: 1.2rem;
        font-weight: bold;
        color: $color-primary;
      }
      & .vip {
        font-size: .7rem;
        color: white;
        padding: .25rem .5rem;
        background-color: $color-primary;
        border-radius: .25rem;
      }
      & .stats {
        justify-content: space-around;
        &-item {
          @extend %click-able;
          @extend %button-like;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          & span:first-child {
            font-size: .9rem;
            font-weight: bold;
            color: $color-black-lighter;
          }
          & span:last-child {
            font-size: .8rem;
            color: $color-grey-500;
          }
        }
      }
    }
    &-live {
      @extend %card;
    }
  }

  &-center {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    &-publish {
      @extend %card;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: .35rem;
      position: relative;

      & .topic {
        @extend %click-able;
        width: fit-content;
        padding: .125rem .35rem;
        border-radius: .5rem;
        color: $color-grey-500;
        background-color: $color-grey-100;
      }

      & .input {
        flex: 1;
        padding: .5rem;
        border-radius: .5rem;
        background-color: $color-grey-100;
        transition: all .2s $ease-out-circ;
        position: relative;
        textarea {
          width: 100%;
          height: 3.5rem;
          outline: none;
          resize: none;
          background-color: transparent;
        }
        &:focus-within {
          background-color: $color-grey-200;
        }

      }

      & .actions {
        position: absolute;
        left: .5rem;
        bottom: .5rem;
        right: .5rem;
        padding-left: .25rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        & .action {
          @extend %click-able;
          @extend %button-like;
          width: 1.75rem;
          height: 1.75rem;
          position: relative;
        }
        & .icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        & .length-tip {
          margin-left: auto;
          margin-right: .25rem;
          font-size: .8rem;
          color: $color-grey-500;
        }
        & .publish {
          @extend %transition-all-circ;
          color: white;
          background-color: $color-secondary;
          border-radius: .5rem;
          padding: .25rem 1rem;
          margin: 0 .25rem .25rem .5rem;
          &:hover {
            background-color: shade-color($color-secondary, 3%);
          }
          &:active {
            background-color: shade-color($color-secondary, 6%);
          }
        }
      }
    }
    &-posts {
      @extend %card;
    }
  }

  &-right {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    &-notice {
      @extend %card;
    }
    &-topics {
      @extend %card;
    }
  }
}
</style>