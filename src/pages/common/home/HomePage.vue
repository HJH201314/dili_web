<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import CommonHeader from "@/components/header/CommonHeader.vue";
import { useRouter } from "vue-router";
import VideoCard from "@/components/video-card/VideoCard.vue";
import services from "@/apis/services";
import { allPartitionsUsingGet } from "@/apis/services/video-platform-admin/updatesController";

onMounted(() => {
  iconImage.value = document.getElementById("iconImage") as HTMLImageElement;
  imageLoadError();
  getCategories();
  getslides();
  getFeed();
})

const router = useRouter();
const currentSlideIndex = ref(0);
const iconImage = ref<HTMLImageElement>();

function imageLoadError(){
  if(iconImage.value) {
    iconImage.value.addEventListener("error", () => {
      console.log("error");
    })
  }
}
function handleClick(e: Event, video: Feed) {
  if(video.url) {
    router.push(video.url);
  } else if (video.onClick) {
    video.onClick();
  }
}

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
  id?: number;
  name?: string;
  link?: string;
};

type Feed = {
  id?: number;
  title?: string;
  coverSrc?: string;
  author?: string;
  dmnum?: number;
  playnum?: number;
  duration?: string;
  publishTime?: string;
  url?: string;
  onClick?: () => void;
}

const leftCategories = ref<Category[]>([]);
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

const video = ref<API.Vo3[]>([]);
const feednum = ref<API.getHomePageUsingGETParams>({pageSize: 20});
const feeds = ref<Feed[]>([]);
const slides = ref<Feed[]>([]);
const partition = ref<API.Partition[]>([]);
function getCategories() {
  services.adminService.updatesController.allPartitionsUsingGet({})
    .then((res) => {
     partition.value = res.data.data ?? [];
      for(let i = 0; i < partition.value.length; i++)
      {
        leftCategories.value.push({
          id: partition.value[i].id!,
          name: partition.value[i].name!,
          link: "/home",
        //  link: "/video/partition/" + partition.value[i].id!,
        })
      }
  });
}
function getslides() {
  services.adminService.updatesController.getHomePageUsingGet({pageSize: 5}).then((res) =>
  {
    video.value = res.data.data ?? [];
    for(let i = 0; i < video.value.length; i++)
    {
      slides.value.push({
        title: video.value[i].title,
        coverSrc: 'https://cdn.fcraft.cn/image/dilidili/cover.jpg'
        //coverSrc: video.value[i].url,
      });
    };
  });
}
function getFeed() {
  services.adminService.updatesController.getHomePageUsingGet
  ({pageSize:feednum.value.pageSize!}).then((res) =>
  {
    video.value = res.data.data ?? [];
    for(let i = 0; i < video.value.length; i++)
    {
      feeds.value.push({
        id: video.value[i].id!,
        title: video.value[i].title,
        coverSrc: video.value[i].url,
        author: video.value[i].upName!,
        dmnum: video.value[i].dmNum,
        playnum: video.value[i].playNum,
        duration: video.value[i].totalTime,
        publishTime: video.value[i].uploadTime!,
        url: "/video/id",
      })
    };
  });
}
</script>

<template>
  <div class="homepage">
    <div class="homepage-header">
      <CommonHeader class="common-header" :header-style="{ 'background': 'transparent' }" />
      <img src="@/assets/img/headerbg.png" class="header-bg">
    </div>

    <div class="header-channel">
      <div class="channel-left-container">
        <div class="container-left-item">
          <a class="container-left-item-icon" href="/post" target="_blank">
            <div class="icon-bg">
              <picture class="icon-bg--dt">
                <img src="@/assets/img/video/icon-dt.png" alt="" loading="lazy" onload="" id="iconImage">
              </picture>
            </div>
            <span class="icon-title">动态</span>
          </a>
          <a class="container-left-item-icon" href="" target="_blank">
            <div class="icon-bg">
              <svg width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-bg--icon">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.89054 17.272L4.89277 17.2742C6.49674 18.8782 8.66472 19.7888 10.9624 19.7888C13.2503 19.7888 15.2113 19.0539 16.6107 17.6108L16.6108 17.6108L16.6128 17.6086C18.0002 16.1345 18.7835 14.182 18.7421 12.1819C18.7852 11.3835 18.6916 9.36321 17.4088 6.75488L17.4082 6.7537C17.209 6.35523 16.8163 6.06598 16.3391 5.96993C15.8904 5.87103 15.4021 6.01997 15.061 6.35741C14.9094 6.48781 14.7796 6.61755 14.6655 6.7317L14.6637 6.73348L14.6329 6.76426C14.2107 3.35588 12.6083 1.7368 11.1654 1.00465C11.148 0.987812 11.1265 0.967972 11.1036 0.950782C11.0775 0.931205 11.0311 0.900467 10.9694 0.888912C10.2276 0.608301 9.41043 1.01168 9.1237 1.77629L9.12314 1.7778C8.50566 3.46558 7.35287 4.62281 6.16627 5.76704C4.51756 7.33121 2.75938 9.03623 2.80163 12.093C2.75906 14.055 3.54464 15.8826 4.89054 17.272ZM3.04999 13.0648C3.01092 12.7459 2.99439 12.4218 3.00168 12.0939C2.95933 9.12977 4.6531 7.47834 6.30453 5.9116C7.49017 4.76831 8.67581 3.58267 9.31098 1.84655C9.56504 1.16904 10.2849 0.830288 10.9201 1.08435C10.9624 1.08435 11.0048 1.1267 11.0471 1.16904C11.9267 1.60884 12.8853 2.39635 13.5753 3.77299C12.8853 2.39633 11.9267 1.6088 11.0471 1.16901C11.0047 1.12666 10.9624 1.08432 10.9201 1.08432C10.2849 0.830251 9.56503 1.16901 9.31097 1.84651C8.6758 3.58263 7.49016 4.76827 6.30452 5.91157C4.65309 7.47831 2.95932 9.12973 3.00166 12.0938C2.99438 12.4218 3.01092 12.7459 3.04999 13.0648ZM14.477 7.18189C14.477 7.1819 14.477 7.18192 14.477 7.18193C14.5828 7.09724 14.6887 6.99138 14.8052 6.87493C14.9216 6.75849 15.0486 6.63146 15.1968 6.50442C15.4932 6.20801 15.9167 6.08098 16.2978 6.16567C16.7212 6.25036 17.06 6.50443 17.2294 6.84318C17.3088 7.0046 17.3835 7.16371 17.4539 7.32035C17.3835 7.1637 17.3087 7.00458 17.2294 6.84314C17.06 6.50439 16.7212 6.25032 16.2978 6.16563C15.9167 6.08094 15.4932 6.20798 15.1968 6.50439C15.0486 6.63142 14.9216 6.75845 14.8051 6.87489L14.8051 6.8749C14.7557 6.92437 14.7081 6.97191 14.6617 7.01675C14.5988 7.07745 14.5379 7.13318 14.477 7.18189ZM12.6977 6.35925C12.8428 7.15476 12.8833 7.97963 12.8679 8.74864C12.8679 8.79032 12.8704 8.8315 12.8754 8.87195C12.8704 8.83151 12.8679 8.79035 12.8679 8.74867C12.8833 7.97966 12.8428 7.15478 12.6977 6.35925ZM16.7358 10.6654C16.8108 11.1478 16.8483 11.6393 16.8483 12.1362V12.1786C16.8483 13.703 16.2978 15.2274 15.2392 16.3283C14.0535 17.4293 12.5291 18.0221 10.9201 17.9374C9.1416 17.9374 7.44783 17.2175 6.21984 15.9472C5.82743 15.5548 5.50448 15.1119 5.25584 14.6331C5.50447 15.1119 5.82743 15.5548 6.21983 15.9472C7.44782 17.2175 9.14159 17.9373 10.9201 17.9373C12.5291 18.022 14.0535 17.4292 15.2392 16.3283C16.2978 15.2273 16.8483 13.7029 16.8483 12.1785V12.1362C16.8483 11.6393 16.8108 11.1478 16.7358 10.6654ZM10.9306 17.7376C12.4802 17.8192 13.9509 17.2497 15.0989 16.1856C16.1154 15.1261 16.6483 13.655 16.6483 12.1785V12.1362C16.6483 10.8624 16.3969 9.6266 15.8955 8.49474C15.2436 9.11663 14.7845 9.49093 14.4179 9.68717C14.2122 9.79725 14.0268 9.85633 13.846 9.86789C13.6644 9.8795 13.5028 9.84219 13.3473 9.78249C12.9207 9.62211 12.6679 9.20129 12.6679 8.74864V8.74464L12.6679 8.74464C12.6889 7.69735 12.6046 6.55594 12.2954 5.53554C12.01 4.59379 11.5372 3.76766 10.7904 3.20655C9.96581 4.94926 8.72521 6.18561 7.58695 7.28323L7.50836 7.35967C5.97191 8.85397 4.81321 9.98087 4.85306 12.1325L4.85313 12.1362H4.85309C4.85309 13.5239 5.38326 14.8277 6.36125 15.8057L6.36365 15.8081L6.36363 15.8082C7.55387 17.0394 9.19573 17.7374 10.9201 17.7374H10.9306L10.9306 17.7376Z" fill="#ffffff">
                </path>
              </svg>
            </div>
            <span class="icon-title">热门</span>
          </a>
        </div>
      </div>
      <div class="channel-right-container">
        <div class="container-item-left" >
          <div v-for="category in leftCategories" :key="category.id" class="channel-link" >
            <a class="a" :href="category.link" target="_blank">{{ category.name }}</a>
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
        <el-carousel class="recommended-swiper" indicator-position="none">
          <el-carousel-item style="height: auto" v-for="(slide, index) in slides" :key="index">
            <img :src="slide.coverSrc" alt="Slide Image" style="width: 100%;height: auto;" >
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
        <video-card
          v-for="feed in feeds" :key="feed.id" @click="(e)=>handleClick(e, feed)"
          :cover="'https://cdn.fcraft.cn/image/dilidili/cover.jpg'"
          :title="feed.title"
          :up-name="feed.author"
          :play="feed.playnum"
          :create-time="feed.publishTime"
          :danmaku="feed.dmnum"
          :duration="feed.duration">
        </video-card>
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
.a {
  text-decoration: none;
  color: #333;
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
  height: 20vh;
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
  padding: 0 20px;
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
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;//垂直居中
  text-align: center;//水平居中
  text-decoration: none;//去掉下划线
  color: #333;
}
.icon-bg {
  background: #f07775;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-position .3s;
}
.icon-bg:hover {
  background-position: -40px 0;
}
.icon-bg--icon {
  width: 22px;
  height: 22px;
  fill: #fff;
  transition: fill .3s;
}
.icon-bg--dt {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  transition: transform .3s;
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
  position: relative;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
}
.recommended-swiper {
  grid-column: 1/3;
  grid-row: 1/3;
  background-color: #f5f5f5;
  border-radius: 4px;
  position: relative;
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
</style>