<script setup lang="ts">
import type { VideoCardProps } from "@/components/video-card/VideoCard";
import { ref } from "vue";
import { useRouter } from "vue-router";

const showDuration = ref(true);
const props = withDefaults(defineProps<VideoCardProps>(), {
  vid: -1,
  coverUrl: 'https://cdn.fcraft.cn/image/dilidili/cover.jpg',
  title: '未知标题未知标题未知标题未未知标题未知标题未知标题未知标题',
  upId: 1,
  upName: '未知发布者',
  playNum: 114,
  dmNum: 514,
  createTime: new Date().toLocaleString(),
  duration: '08:40',
  shadowed: false,
});

function truncateText(text: string, length: number) {
  if (text.length > length) {
    return text.slice(0, length/2) + '...' + text.slice(-length/2)
  }
  return text;
}
</script>

<template>
  <div class="feed-card">
    <div class="card-box">
      <img
        :src="props.coverUrl"
        alt="Video Cover"
        @mouseover="showDuration = false"
        @mouseout="showDuration = true"
      />
      <div v-if="showDuration" class="duration">{{ props.duration }}</div>
    </div>
    <div class="info-box">
      <div class="title">{{ truncateText(props.title, 30) }}</div>
      <div class="author">{{ truncateText(props.upName, 15) }}</div>
      <div class="stats">
        <span class="play-count">{{ props.playNum }} 播放量</span>
        <span class="dm-count">{{ props.dmNum }} 弹幕</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.feed-card {
  display: flex;
  margin-bottom: 5px;
}

.card-box {
  position: relative;
  width: 30%; /* Adjust the width as needed */
  overflow: hidden;
}

.card-box img {
  width: 100%;
  height: auto;
  transition: filter 0.3s ease-in-out;
}

.duration {
  position: absolute;
  bottom: 13px;
  right: 5px;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 5px;
}

.card-box:hover img {
  filter: brightness(0.7);
}

.info-box {
  width: 70%;
  padding: 10px;
}

.title {
  font-size: 14px;


}

.author {
  font-size: 14px;
  color: #666;

}

.stats {
  font-size: 12px;
  color: #999;
  display: flex;
}
.play-count {
  margin-right: 10px;
}
.dm-count {
  margin-right: 10px;
}
</style>