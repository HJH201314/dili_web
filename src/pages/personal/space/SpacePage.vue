<script setup lang="ts">
import { onMounted, ref } from "vue";
import useUserStore from "@/stores/useUserStore";
import { Like, VideoOne, HomeTwo, Tips, Config } from "@icon-park/vue-next";
import { useRoute } from "vue-router";
import SpaceHomeTab from "@/pages/personal/space/SpaceHomeTab.vue";
import SpacePostTab from "@/pages/personal/space/SpacePostTab.vue";
import SpaceVideoTab from "@/pages/personal/space/SpaceVideoTab.vue";
import SpaceStarTab from "@/pages/personal/space/SpaceStarTab.vue";
import SpaceSettingTab from "@/pages/personal/space/SpaceSettingTab.vue";

const props = defineProps<{
  pathId?: string;
}>();

const userStore = useUserStore();
const route = useRoute();

onMounted(() => {

});

const subPage = ref(route.query['tab'] || 'home');

function handleTabChange(tabName: string) {
  subPage.value = tabName;
}
</script>

<template>
  <div class="personal-space">
    <main class="space-container">
      <section class="card card-top">
        <div class="space-header">
          <img alt="banner" src="https://cdn.fcraft.cn/image/dilidili/banner.webp" />
          <div class="gradient"></div>
          <div class="user-info">
            <div class="user-info__avatar">
              <img alt="user-avatar" :src="userStore.avatar ?? 'https://avatars.githubusercontent.com/u/24362351?v=4'" />
            </div>
            <div class="user-info-middle">
              <div class="user-info__name">
                {{ userStore.userInfo.name }}
              </div>
              <div class="user-info__desc">
                系统原装简介，送给每一位小可爱~
              </div>
            </div>
          </div>
        </div>
        <div class="space-nav">
          <div class="space-nav-item" @click="handleTabChange('home')">
            <div class="space-nav-item__icon"><HomeTwo fill="#00c091" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">主页</div>
          </div>
          <div class="space-nav-item" @click="handleTabChange('post')">
            <div class="space-nav-item__icon"><Tips fill="#fb7299" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">动态</div>
          </div>
          <div class="space-nav-item" @click="handleTabChange('video')">
            <div class="space-nav-item__icon"><VideoOne fill="#02b5da" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">投稿</div>
            <div class="space-nav-item__count">233</div>
          </div>
          <div class="space-nav-item" @click="handleTabChange('star')">
            <div class="space-nav-item__icon"><Like fill="#f3a034" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">收藏</div>
            <div class="space-nav-item__count">666</div>
          </div>
          <div class="space-nav-item" @click="handleTabChange('setting')">
            <div class="space-nav-item__icon"><Config fill="#ff5d47" theme="filled" size="1.5rem" /></div>
            <div class="space-nav-item__text">设置</div>
          </div>
          <div class="space-nav-stat" style="margin-left: auto;">
            <div class="space-nav-stat__text">关注数</div>
            <div class="space-nav-stat__count">233</div>
          </div>
          <div class="space-nav-stat">
            <div class="space-nav-stat__text">粉丝数</div>
            <div class="space-nav-stat__count">66.6万</div>
          </div>
          <div class="space-nav-stat">
            <div class="space-nav-stat__text">获赞数</div>
            <div class="space-nav-stat__count">77.7万</div>
          </div>
          <div class="space-nav-stat">
            <div class="space-nav-stat__text">播放数</div>
            <div class="space-nav-stat__count">648万</div>
          </div>
        </div>
      </section>
      <div style="height: .5rem;"></div>
      <!-- 切换页面子组件 -->
      <section class="main" style="display: contents; ">
        <Transition name="slide-fade"><!-- TODO: 让这个动画生效 -->
          <SpaceHomeTab v-if="subPage == 'home'" />
          <SpacePostTab v-else-if="subPage == 'post'" />
          <SpaceVideoTab v-else-if="subPage == 'video'" />
          <SpaceStarTab v-else-if="subPage == 'star'" />
          <SpaceSettingTab v-else-if="subPage == 'setting'" />
        </Transition>
      </section>
    </main>
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
      align-items: center;
      gap: 1rem;
      &-middle {
        display: flex;
        flex-direction: column;
        color: white;
      }
      &__avatar {
        width: 4rem;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid $color-grey-50;
      }
      &__name {
        font-weight: bold;
        font-size: 1.25rem;
      }
      &__desc {

      }
    }
    .gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 84px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAAAABdCAMAAADNEjtLAAABEVBMVEUDAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAACnjvHuAAAAW3RSTlMBAgMEBQYHCAkKCwwNDxAREhQVFhgZGxweHyEiJCUnKSosLS8xMjQ2ODk7PT5AQkNFR0hKTE5PUVNUVldZW1xeX2FiZGVnaGprbG5vcHFzdHV2d3h5ent8fX5/XoZ4lgAAAPVJREFUeAHt1AERADAQAiDdrX/mDyKEIAAAjGkDsOk3AAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECAgQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBAQIIEAAAQIseAEYdZ9sAcJDX4ICAAAAAElFTkSuQmCC);
      background-repeat: repeat-x;
    }
  }
  &-nav {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    align-items: center;
    padding: 0 .75rem;
    height: 3rem;
    &-item {
      @extend %click-able;
      &:hover {
        background-color: white;
        box-shadow: $box-shadow;
        scale: 1.1;
      }
      border-radius: .5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      position: relative;
      &__icon {
        margin-top: .2rem; // 图标偏移，看情况调整
      }
      &__text {

      }
      &__count {
        font-size: .8rem;
        color: $color-grey-500;
      }
    }
    &-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      &__text {
        font-size: .75rem;
        color: $color-grey-500;
      }
      &__count {
        font-size: .75rem;
      }
    }
  }
}
</style>