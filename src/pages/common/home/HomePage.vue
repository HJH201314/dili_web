<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import CommonHeader from "@/components/header/CommonHeader.vue";

const currentSlideIndex = ref(0);
const slides = ref([
  {
    imageSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
  },
  {
    imageSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
  },
  {
    imageSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
  },
  {
    imageSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
  },
  {
    imageSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
  },
]);

function nextSlide() {
  if(currentSlideIndex.value < slides.value.length - 1) {
    currentSlideIndex.value++;
  } else {
    currentSlideIndex.value = 0;
  }
}

function prevSlide() {
  if(currentSlideIndex.value > 0) {
    currentSlideIndex.value--;
  } else {
    currentSlideIndex.value = slides.value.length - 1;
  }
}

type Category = {
  id: number;
  name: string;
  link: string;
};

type Feed = {
  id: number;
  title: string;
  coverSrc: string;
  author: string;
  publishTime: string;
}

const leftCategories = ref<Category[]>([
  {
    id: 1,
    name: "动画",
    link: "/anime",
  },
  {
    id: 2,
    name: "番剧",
    link: "/anime",
  },
  {
    id: 3,
    name: "国创",
    link: "/anime",
  },
  {
    id: 4,
    name: "音乐",
    link: "/anime",
  },
  {
    id: 5,
    name: "舞蹈",
    link: "/anime",
  },
  {
    id: 6,
    name: "游戏",
    link: "/anime",
  },
  {
    id: 7,
    name: "科技",
    link: "/anime",
  },
  {
    id: 8,
    name: "数码",
    link: "/anime",
  },
  {
    id: 9,
    name: "生活",
    link: "/anime",
  },
  {
    id: 10,
    name: "鬼畜",
    link: "/anime",
  },
  {
    id: 11,
    name: "时尚",
    link: "/anime",
  },
  {
    id: 12,
    name: "广告",
    link: "/anime",
  },
  {
    id: 13,
    name: "娱乐",
    link: "/anime",
  },
  {
    id: 14,
    name: "影视",
    link: "/anime",
  },
  {
    id: 15,
    name: "纪录片",
    link: "/anime",
  },
  {
    id: 16,
    name: "电影",
    link: "/anime",
  },
  {
    id: 17,
    name: "电视剧",
    link: "/anime",
  },
  {
    id: 18,
    name: "小视频",
    link: "/anime",
  },
]);

const rightCategories = ref<Category[]>([
  {
    id: 1,
    name: "动画",
    link: "/anime",
  },
  {
    id: 2,
    name: "番剧",
    link: "/anime",
  },
  {
    id: 3,
    name: "国创",
    link: "/anime",
  },
  {
    id: 4,
    name: "音乐",
    link: "/anime",
  },
  {
    id: 5,
    name: "舞蹈",
    link: "/anime",
  },
  {
    id: 6,
    name: "游戏",
    link: "/anime",
  }
]);

const feeds = ref<Feed[]>([
  {
    id: 1,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  },
  {
    id: 2,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  },
  {
    id: 3,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  },
  {
    id: 4,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  },
  {
    id: 5,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  },
  {
    id: 6,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  },
  {
    id: 7,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  },
  {
    id: 8,
    title: "【独家】《鬼灭之刃》第二季PV",
    coverSrc: "https://cdn.fcraft.cn/image/dilidili/cover.jpg",
    author: "哔哩哔哩动画",
    publishTime: "2021-04-01",
  }
])

</script>

<template>
  <div class="homepage">
    <div class="homepage-header">
      <CommonHeader class="common-header"/>
      <img src="@/assets/img/headerbg.png" class="header-bg">
    </div>

    <div class="header-channel">
      <div class="channel-left-container">
        <div class="container-left-item">
          <a class="container-left-item-icon" href="" target="_blank">
            <img src=""  />
            <span class="icon-title">动态</span>
          </a>
          <a class="container-left-item-icon" href="" target="_blank">
            <img src=""  />
            <span class="icon-title">热门</span>
          </a>
        </div>
      </div>
      <div class="channel-right-container">
        <div class="container-item-left" >
          <div v-for="category in leftCategories" :key="category.id" class="channel-link" >
            <a :href="category.link" target="_blank">{{ category.name }}</a>
          </div>
        </div>
        <div class="vertical-line"></div>
        <div class="container-item-right">
          <div v-for="category in rightCategories" :key="category.id" class="channel-link" >
            <a :href="category.link" target="_blank">{{ category.name }}</a>
          </div>
        </div>
      </div>
    </div>


    <div class="homepage-feed">
      <div class="feed-container">
        <el-carousel style="grid-column: span 2; grid-row: span 1;" indicator-position="none">
          <el-carousel-item v-for="(slide, index) in slides" :key="index">
            <img :src="slide.imageSrc" alt="Slide Image">
          </el-carousel-item>
        </el-carousel>
<!--        <div class="recommended-swiper">-->
<!--          <div class="slider-container">-->
<!--              <div class="slide" v-for="(slide, index) in slides" :key="index"-->
<!--                   :style="{ transform: `translateX(-${index * 100}%)` }">-->
<!--                <img :src="slide.imageSrc" alt="Slide Image">-->
<!--              </div>-->
<!--          </div>-->
<!--          <div class="controls">-->
<!--            <button @click="prevSlide">Previous</button>-->
<!--            <button @click="nextSlide">Next</button>-->
<!--          </div>-->
<!--        </div>-->
        <div class="feed-card" v-for="feed in feeds" :key="feed.id">
          <div class="card-image">
            <img style="object-fit: cover;" :src="feed.coverSrc" alt="Cover Image" />
          </div>
          <div class="card-info">
            <h3>{{ feed.title }}</h3>
            <P>{{ feed.author }}</P>
            <p>{{ feed.publishTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-header {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}
.homepage {
  width: 100%;
  // min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}
.homepage-header {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 30vh;
}
.header-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.header-channel {
  margin-top: 20px;
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
}
.channel-left-container {
  display: flex;
  align-items: center;
}
.container-left-item {
  display: flex;
  align-items: center;
}
.container-left-item-icon {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;//垂直居中
  text-align: center;//水平居中
  text-decoration: none;//去掉下划线
  color: #333;
}
.container-left-item-icon img {
  width: 32px;
  height: 32px;
}
.icon-title {
  margin-top: 5px;
}
.channel-right-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
.container-item-left {
  display: grid;
  width: 70%;
  grid-template-columns: repeat(9, 1fr);
  grid-gap: 10px;
  padding-left: 20px;
  padding-right: 10px;
}
.container-item-right {
  display: grid;
  width: 30%;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding-left: 15px;
}
.channel-link {
  margin-right: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f6f7f8;
  border-radius: 4px;
  text-decoration: none;
}
.channel-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 0 5px rgba(200, 200, 200, 0.5);
  border-radius: 4px;
  transition: box-shadow 0.3s ease-in-out;
}
.channel-link:hover::before {
  box-shadow: 0 0 10px rgba(52, 152, 219, 1);
}
.vertical-line {
  width: 1px;
  background-color: #ccc;
  margin: 8px 0;
}
.container-item-right img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.homepage-feed {
  margin-top: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
}
.feed-container {
  width: 90%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
}
.recommended-swiper {
  grid-column: span 2;
  grid-row: span 1;
  background-color: #fff;
  border-radius: 4px;
}
.slider-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
}
.slide {
  flex: 0 0 100%;//不可伸缩，不可收缩，宽度为100%
}
.controls {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 90%;
  left: 25%;
  transform: translateY(-50%);
}
.controls button {
  background-color: #fff;
  border: none;
  outline: none;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}
.feed-card {
  height: 300px;
  grid-column: span 1;
  grid-row: span 1;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}
.feed-card:hover {
  transform: scale(1.05);
}
.card-image {
  width: 100%;
  overflow: hidden;
}
.card-info {
  padding: 10px;
}
.card-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}
.card-info p {
  font-size: 12px;
  color: #999;
}
</style>