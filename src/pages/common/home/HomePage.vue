<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import CommonHeader from "@/components/header/CommonHeader.vue";
</script>

<template>
  <div class="homepage">
    <div class="homepage-header">
      <CommonHeader />
      <img src="@/assets/img/headerbg.png">
      <div class="header-channel">
        <div class="channel-left-container">
          <div class="container-left-item">
            <a class="container-left-item-icon" href="" target="_blank">
              <image src=""  />
              <span class="icon-title">动态</span>
            </a>
            <a class="container-left-item-icon" href="" target="_blank">
              <image src=""  />
              <span class="icon-title">热门</span>
            </a>
          </div>
        </div>
        <div class="channel-right-container">
          <div class="container-item-left" >
            <a class="channel-link" href="" style="letter-spacing: 2px;" target="_blank">番剧</a>
            <a class="channel-link" href="" style="letter-spacing: 2px;" target="_blank">番剧</a>
            <a class="channel-link" href="" style="letter-spacing: 2px;" target="_blank">番剧</a>
            <a class="channel-link" href="" style="letter-spacing: 2px;" target="_blank">番剧</a>
          </div>
          <div class="channel-item-right">

          </div>
        </div>
      </div>
    </div>
    <div class="homepage-feed">
      <div class="feed-container">
        <div class="recommended-swiper">

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.homepage {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  .homepage-header {
    width: 100%;
    height: 3.5rem;

    .header-channel {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .channel-left-container {
        width: 20%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .left-container-item {
          width: 4rem;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .left-container-item-icon {
            width: 100%;
            height: 1.5rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
          .header-channel-left-item-name {
            width: 100%;
            height: 1rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            color: #333;
          }
        }
      }
      .channel-right-container {
        width: 80%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .container-item-left {
          width: 4rem;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .container-item-right {
          width: 4rem;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .homepage-feed {
    width: 100%;
    height: calc(100% - 3.5rem);
    background-color: #f5f5f5;
    .feed-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .recommended-swiper {
      width: 100%;
      height: 10rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .swiper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .swiper-item {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>