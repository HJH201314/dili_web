<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import VideoCard2 from "@/components/video-card/VideoCard2.vue";
import Hls from "hls.js";
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import axios from 'axios'
import useUserStore from "@/stores/useUserStore";

const router = useRouter();
const userStore = useUserStore();
const props = defineProps<{
  videoID?: string
}>()

const videoRef = ref<HTMLDivElement>();

let art: Artplayer;
const initBarrage = () => {
  art = new Artplayer({
    container: videoRef.value!,
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    type: 'm3u8',
    customType: {
      m3u8: playM3u8,
    },
    setting: true,//设置面板
    autoSize: true,//自动调整视频尺寸以隐藏黑边
    fullscreen: true,//全屏
    playbackRate: true,//播放速度
    miniProgressBar: true,//在视频失去焦点后出现的mini进度条
    pip: true,
    plugins: [
      artplayerPluginDanmuku({
        danmuku: function () {
          return new Promise((resovle) => {
            axios.get("/api/admin/video/getBarrageVoByVid", {
              params: {
                vid: 1
              }
            }).then((res) => {
              return resovle(res.data.data)
            })
          })
        },
        speed: 8,
        heatmap: true, // 是否开启弹幕热度图, 默认为 false
      }),
    ],
  });
  //监听输入的新弹幕
  art.on('artplayerPluginDanmuku:emit', (danmu) => {
      axios.post("/api/admin/video/saveBarrage", {
        ... danmu,
        // vid: 1,
        vid: parseInt(props.videoID!),
        uid: userStore.userInfo?.id
        // uid: 1
      })
  });
  art.theme = 'rgb(0, 174, 236)'
}
const isFollowed = ref(false)
const isMenuVisivle = ref(false)

watch(() => videoRef.value, (val) => {
  if (val) {
    initBarrage();
  }
});

function showMenu() {
  isMenuVisivle.value = true
  if(!isFollowed.value) {
    isMenuVisivle.value = false
  }
}

function hideMenu() {
  isMenuVisivle.value = false
}

function setGroup() {
  console.log('setGroup')
}

function toggleFollow() {
  isFollowed.value = !isFollowed.value
}


function playM3u8(video, url, art) {
  if (Hls.isSupported()) {
    if (art.hls) art.hls.destroy();
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    art.hls = hls;
    art.on('destroy', () => hls.destroy());
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else {
    art.notice.show = 'Unsupported playback format: m3u8';
  }
}

</script>

<template>
  <div class="video-page">
    <div class="video-container">
      <!-- Left Section -->
      <div class="left-section">
        <div class="video-info">
          <div class="title">赤壁之战的锅谁背？【小约翰】</div>
          <div class="detail">
            <span class="view">173.4万</span>
            <span class="dm">1.4万</span>
            <span class="pubdate">2023-12-08 11：00：13</span>
            <span class="copyright">未经作者授权，禁止转载</span>
          </div>
        </div>
        <!--        <DiliButton text="开播" @click="videoRef?.play()"></DiliButton>-->
        <div class="player-window">
          <!-- <video class="player" ref="videoRef" id="video" controls></video> -->
          <div ref="videoRef" class="artplayer-app"></div>
          <div class="player-window-bottom">

          </div>
        </div>
        <div class="video-actions">
          <button class="video-like">
            <span>likes</span>
          </button>
          <button class="video-coin">
            <span>coins</span>
          </button>
          <button class="video-star">
            <span>shares</span>
          </button>
        </div>
        <div class="video-detail">
          <div class="video-description">
            <span>本篇为小约翰之赤壁之战。</span>
          </div>
          <div class="video-tags">
            <span>标签：</span>
            <span>赤壁之战</span>
            <span>三国</span>
            <span>历史</span>
          </div>
        </div>
        <div class="comment-list">
          <div class="list-header">
            <div class="list-title">评论</div>
            <div class="list-count">0</div>
            <div class="list-sort">
              <span>时间</span>
              <span>热度</span>
            </div>
          </div>
          <div class="reply-box">
            <div class="reply-box-avatar"></div>
            <div class="reply-box-input">
              <textarea placeholder="你猜我的评论区在等待谁？"></textarea>
            </div>
            <div class="reply-box-input-actions">
              <div class="send-text">发布</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <div class="author-info">
          <div class="author-info-left">
            <div class="avatar">
              <img class="avatar-img" src="@/assets/img/video/icon-dt.png" alt="avatar" />
            </div>
          </div>
          <div class="author-info-right">
            <div class="author-detail">
              <div class="author-detail-top">
                <a
                  class="author-detail-name"
                  href="https://space.bilibili.com/23947287"
                  target="_blank"
                >
                  小约翰
                </a>
                <a
                  class="author-detail-sendmsg"
                  href="https://message.bilibili.com/#/whisper/mid23947287"
                  target="_blank"
                >
                  <svg
                    style="padding-right: 3px"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.435 17.7717H4.567C2.60143 17.7717 1 16.1723 1 14.2047V5.76702C1 3.80144 2.59942 2.20001 4.567 2.20001H15.433C17.3986 2.20001 19 3.79943 19 5.76702V14.2047C19.002 16.1703 17.4006 17.7717 15.435 17.7717ZM4.567 4.00062C3.59327 4.00062 2.8006 4.79328 2.8006 5.76702V14.2047C2.8006 15.1784 3.59327 15.9711 4.567 15.9711H15.433C16.4067 15.9711 17.1994 15.1784 17.1994 14.2047V5.76702C17.1994 4.79328 16.4067 4.00062 15.433 4.00062H4.567Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M9.99943 11.2C9.51188 11.2 9.02238 11.0667 8.59748 10.8019L8.5407 10.7635L4.3329 7.65675C3.95304 7.37731 3.88842 6.86226 4.18996 6.50976C4.48954 6.15544 5.0417 6.09699 5.4196 6.37643L9.59412 9.45943C9.84279 9.60189 10.1561 9.60189 10.4067 9.45943L14.5812 6.37643C14.9591 6.09699 15.5113 6.15544 15.8109 6.50976C16.1104 6.86409 16.0478 7.37731 15.6679 7.65675L11.4014 10.8019C10.9765 11.0667 10.487 11.2 9.99943 11.2Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  发消息
                </a>
              </div>
              <div title="更过了哈" class="author-description">更过了哈</div>
            </div>
            <div class="author-info-actions">
              <div class="follow-btn" @click="toggleFollow" @mouseenter="showMenu" @mouseleave="hideMenu">
                {{ isFollowed ? '已关注' : '关注'}}
                <div  v-show="isMenuVisivle" class="dropdowm-menu">
                  <div @click="setGroup">设置分组</div>
                  <div @click="toggleFollow">{{ isFollowed ? '取消关注' : '关注'}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="recommend-list">
          <div class="recommend-list-title">相关推荐</div>
          <video-card2
            v-for="item in 10"
            :key="item"
            :cover="`https://cdn.fcraft.cn/image/dilidili/${item}.webp`"
            :title="`赤壁之战的锅谁背？【小约翰】`"
            :up-name="`小约翰`"
            :play="`173.4万`"
            :danmaku="`1.4万`"
            :duration="'10:11'"
          >
          </video-card2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
}

.video-page {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
}

.video-container {
  height: 100%;
  width: 80%;
  max-width: 2540px;
  min-width: 1080px;
  margin: 0 auto;
  box-sizing: content-box;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: scroll;
}

.left-section {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.video-info {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  padding-top: 22px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: #18191c;
  line-height: 28px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail {
  font-size: 13px;
  display: flex;
  align-items: center;
  height: 24px;
  line-height: 18px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.view {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;
}

.dm {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;
}

.pubdate {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;
}

.copyright {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

.player-window {
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.player {
  width: 100%;
  // height: need compute
}

.video-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 16px;
  padding-bottom: 12px;
  line-height: 28px;
  border-bottom: 1px solid #e3e5e7;
}

.video-like,
.video-coin,
.video-star {
  padding-right: 8px;
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: #18191c;
}

.video-detail {
  margin: 16px 0;
  border-bottom: 1px solid #e3e5e7;
}

.video-description {
  font-size: 14px;
  line-height: 22px;
  color: #18191c;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-tags {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 6px;
  margin: 16px 0 20px 0;
}

.comment-list {
  margin-top: 8px;
  position: relative;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.list-title {
  font-size: 20px;
  font-weight: 500;
  color: #18191c;
  margin-right: 12px;
}

.list-count {
  font-size: 14px;
  color: #9499a0;
  margin-right: 12px;
}

.list-sort {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  color: #9499a0;
}

.reply-box {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reply-box-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ebebeb;
  margin-right: 10px;
  margin-left: 10px;
}

.reply-box-input {
  height: 100%;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  color: #18191c;
}

.reply-box-input textarea {
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e3e5e7;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 22px;
  color: #18191c;
  box-sizing: border-box;
  overflow: auto;
}

.reply-box-input textarea:hover,
.reply-box-input textarea:focus {
  border-color: #fff;
}

.reply-box-input-actions {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 10px;
  flex-basis: 70px;
  border-radius: 4px;
  cursor: pointer;
}

.reply-box-input-actions::before {
  content: "";
  position: absolute;
  opacity: .5;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: #00aeec;
  transition: opacity 0.3s;
}

.reply-box-input-actions:hover::before {
  opacity: 1;
}

.send-text {
  position: absolute;
  z-index: 1;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.right-section {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 30px;
}

.author-info {
  box-sizing: border-box;
  height: 100px;
  display: flex;
  align-items: center;
}

.author-info-left {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ebebeb;
  overflow: hidden;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.author-info-right {
  margin-left: 12px;
  flex: 1;
}

.author-detail {
  margin-bottom: 5px;
}

.author-detail-top {
  padding-top: 10px;
  display: flex;
  align-items: center;
}

.author-detail-name {
  font-size: 15px;
  font-weight: 500;
  color: #18191c;
  position: relative;
  line-height: 22px;
  margin-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-detail-sendmsg {
  font-size: 13px;
  transition: color 0.3s;
  color: #61666d;
  flex-shrink: 0;
  display: flex;
}

.author-detail-sendmsg:hover {
  color: #00aeec;
}

.author-description {
  margin-top: 2px;
  font-size: 13px;
  line-height: 16px;
  height: 16px;
  color: #9499a0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-info-actions {
  position: relative;
  display: flex;
  margin-top: 5px;
  overflow: visible;
}

.follow-btn {
  display: inline-flex;
  position: relative;
  font-size: 14px;
  background-color: #00aeec;
  color: #fff;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 100px;
  height: 30px;
}
.follow-btn:hover {
  background-color: #ebebeb;
}
.dropdowm-menu {
  z-index: 10;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.dropdowm-menu div {
  padding: 8px 12px;
  font-size: 14px;
  color: #18191c;
  cursor: pointer;
}

.follow-btn:hover {
  background-color: #ebebeb;
}

.recommend-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
}

.recommend-list-title {
  font-size: 16px;
  font-weight: 500;
  color: #18191c;
  margin-bottom: 12px;
}

.artplayer-app {
  height: 300px;

}
</style>