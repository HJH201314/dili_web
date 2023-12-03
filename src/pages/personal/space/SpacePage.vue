<script setup lang="ts">
import { onMounted } from "vue";
import useUserStore from "@/stores/useUserStore";
import { Like, VideoOne, HomeTwo, Tips } from "@icon-park/vue-next";

const props = defineProps<{
  pathId?: string;
}>();

const userStore = useUserStore();

onMounted(() => {

});
</script>

<template>
  <div class="personal-space">
    <div class="space-container">
      <div class="card card-top">
        <div class="space-header">
          <img alt="banner" src="https://cdn.fcraft.cn/image/dilidili/banner.webp" />
          <div class="user-info">
            <div class="user-info__avatar">
              <img alt="user-avatar" :src="userStore.avatar ?? 'https://avatars.githubusercontent.com/u/24362351?v=4'" />
            </div>
          </div>
        </div>
        <div class="space-nav">
          <div class="space-nav-item">
            <div class="space-nav-item__icon"><HomeTwo fill="#00c091" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">主页</div>
          </div>
          <div class="space-nav-item">
            <div class="space-nav-item__icon"><Tips fill="#fb7299" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">动态</div>
          </div>
          <div class="space-nav-item">
            <div class="space-nav-item__icon"><VideoOne fill="#02b5da" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">投稿</div>
            <div class="space-nav-item__count">233</div>
          </div>
          <div class="space-nav-item">
            <div class="space-nav-item__icon"><Like fill="#f3a034" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">收藏</div>
            <div class="space-nav-item__count">666</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.personal-space {
  position: relative;
  width: 100%;
}
.card {
  border-radius: .5rem;
  overflow: hidden;
  box-shadow: $box-shadow;
  background-color: white;
  &-top {
  }
}
.space {
  &-container {
    max-width: 80%;
    margin: 1rem auto;
  }
  &-header {
    position: relative;
    .user-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      display: flex;
      &__avatar {
        width: 4rem;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid $color-grey-50;
      }
    }
  }
  &-nav {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    align-items: center;
    padding: 0 1rem;
    height: 3rem;
    &-item {
      @extend %click-able;
      border-radius: .5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      position: relative;
      &__icon {
        margin-top: .2rem;
      }
      &__text {

      }
      &__count {
        font-size: .8rem;
        color: $color-grey-500;
      }
    }
  }
}
</style>