<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import VideoCard2 from "@/components/video-card/VideoCard2.vue";
import Hls from "hls.js";
import dashjs from "dashjs";
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import axios from 'axios'
import useUserStore from "@/stores/useUserStore";
import CommentView from "@/pages/common/video/components/CommentView.vue";
import services from "@/apis/services";
import variables from "@/assets/variables.module.scss";
import ToastManager from "@/components/toast/ToastManager";
import useUserInfo from "@/stores/publicUserInfo";
import { getStatString } from "../../../utils/string";
import DateFormat from "@/components/date-format/DateFormat.vue";
import { Forbid, Like, Baokemeng, Star } from "@icon-park/vue-next";
import usePartitionStore from "@/stores/usePartitionStore";
import DiliButton from "@/components/button/DiliButton.vue";
import UserCard from "@/components/user-card/UserCard.vue";
import CommonDialog from "@/components/dialog/CommonDialog.vue";
import type { CommonDialogExpose } from "@/components/dialog/CommonDialog";
import { DialogManager } from "@/components/dialog";
import useLikeCacheStore from "@/stores/useLikeCacheStore";
import { delay } from '@/utils/delay';
import { listStaredUsingGet } from '@/apis/services/video-platform-star/shoucang';
import showLoginModal from '@/components/login-modal/LoginModal';

const router = useRouter();
const userStore = useUserStore();
const props = defineProps<{
  videoID?: string
}>()

onMounted(() => {
  getRecommendList();
});

const playerWindowRef = ref<HTMLDivElement>();
const videoRef = ref<HTMLDivElement>();

type recommendList = {
  vid?: number;
  duration?: string;
  title?: string;
  upName?: string;
  coverUrl?: string;
  dmNum?: number;
  playNum?: number;
  url?: string;
};

const rList = ref<recommendList[]>([]);
const back_rListId = ref<number[]>([]);
//const back_rList = ref<API.VideoInfoVo[]>([]);
const back_rList = ref<API.VideoVo[]>([]);

/*function getRecommendList() {
  services.recommendService.tuijianmokuai.getRecommendUsingGet({
    uid: videoInfo.value?.video?.id!,
  }).then((res) => {
    back_rListId.value = res.data.data ?? [];
    for (let i = 0; i < back_rListId.value.length; i++) {
      services.adminService.videoController.getVideoInfoUsingGet({ id: back_rListId.value[i]
      }).then((result) => {
        back_rList.value[i] = result.data.data!;
        rList.value.push({
          vid: back_rList.value[i].video?.id,
          duration: back_rList.value[i].video?.totalTime,
          title: back_rList.value[i].video?.title,
          upName: back_rList.value[i].user?.name,
          dmNum: back_rList.value[i].video?.dmNum,
          playNum: back_rList.value[i].video?.playNum,
        })
      });
    }
    });
}*/
function getRecommendList() {
  services.adminService.updatesController.getHomePageUsingGet({
    pageSize: 15,
    uid: /*userStore.userInfo.id ??*/ 0,
  }).then((res) => {
    back_rList.value = res.data.data ?? [];
    for (let i = 0; i < back_rList.value.length; i++) {
      rList.value.push({
        vid: back_rList.value[i].id!,
        title: back_rList.value[i].title,
        upName: back_rList.value[i].upName!,
        dmNum: back_rList.value[i].dmNum,
        playNum: back_rList.value[i].playNum,
        duration: back_rList.value[i].totalTime,
        url: "/video/vid",
      })
    }
  });
}

/* 视频信息相关 */
const videoInfo = ref<API.VideoInfoVo>();
const userInfo = useUserInfo(() => videoInfo.value?.user?.id);
const upInfo = useUserInfo(() => videoInfo.value?.user?.id);
const urls = ref<string[]>(['video/3/1702828228177/1080.m3u8']);
onMounted(() => {
  if (!props.videoID) router.replace('/home');
  const vid = parseInt(props.videoID!);

  Promise.all([
    getVideoInfo(vid),

  ]);

});

async function getVideoInfo(vid: number) {
  try {
    const res = await services.adminService.videoController.getVideoInfoUsingGet({
      id: vid,
    });
    if (res.data.code == 200) {
      videoInfo.value = res.data.data;
      if (!videoInfo.value?.updateHeat?.likeNum) {
        videoInfo.value!.updateHeat!.likeNum = Math.floor(Math.random() * 1000) + 1;
      }
      if (!videoInfo.value?.video?.coinNum) {
        videoInfo.value!.video!.coinNum = Math.floor(Math.random() * 1000) + 1;
      }
      if (!videoInfo.value?.video?.starNum) {
        videoInfo.value!.video!.starNum = Math.floor(Math.random() * 1000) + 1;
      }
      urls.value = JSON.parse(videoInfo.value?.video?.url ?? '[]') as string[];
      art.url = `/api/minio/video-platform.updates/${urls.value[0]}`
      partitionName.value = partitionStore.getPartitionNameById(videoInfo.value?.video?.pid!);

      art.quality = urls.value.map((url, index) => {
        return {
          default: index === 0,
          html: url.split('/')[url.split('/').length - 1].split('.')[0] + 'P',
          url: `/api/minio/video-platform.updates/${url}`
        };
      });

      // 记录历史记录信息
      const time = new Date();
      // services.adminService.historyController.addHistoryUsingPost({
      //   mediaId: vid,
      //   mediaType: 0,
      //   userId: userStore.userInfo.id,
      //   watchedAt: {
      //     year: time.getFullYear(),
      //     month: time.getMonth() + 1,
      //     date: time.getDate(),
      //     hours: time.getHours(),
      //     minutes: time.getMinutes(),
      //   }
      // });
    } else {
      // ToastManager.danger('获取信息失败');
    }

    const res2 = await services.starService.starController.listStaredUsingGet({
      uid: userStore.userInfo.id!,
      updateId: videoInfo.value?.update?.id!,
    });
    if (res2.data.code == 200) {
      staredList.value = res2.data.data?.list ?? [];
    }
  } catch (e) {
    // ToastManager.danger('获取信息失败');
  } finally {

  }
}

const partitionStore = usePartitionStore();
const partitionName = ref<string>('');
const likeCacheStore = useLikeCacheStore();

/* 视频播放相关 */
let art: Artplayer;
const initBarrage = (videoUrls: string[] = []) => {
  if (art) {
    videoRef.value!.style.height = `${videoRef.value!.offsetWidth * 9 / 16}px`;
    playerWindowRef.value!.style.minHeight = `${videoRef.value!.offsetWidth * 9 / 16}px`;
  } else {
    art = new Artplayer({
      container: videoRef.value!,
      url: `/api/minio/video-platform.updates/${urls.value[0]}`, // 此处minio代理在vite.config.ts中修改
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
            return new Promise((resolve) => {
              axios.get("/api/admin/video/getBarrageVoByVid", {
                params: {
                  vid: parseInt(props.videoID!),
                }
              }).then((res) => {
                return resolve(res.data.data)
              })
            })
          },
          speed: 8,
          heatmap: true, // 是否开启弹幕热度图, 默认为 false
        }),
      ],
    });
  }
  //监听输入的新弹幕
  art.on('artplayerPluginDanmuku:emit', (danmu) => {
      axios.post("/api/admin/video/saveBarrage", {
        ... danmu,
        // vid: 1,
        vid: parseInt(props.videoID!),
        uid: userStore.userInfo?.id,
        // uid: 1
      });
  });
  art.theme = '#26a69a'
}
const isFollowed = ref(false)
const isMenuVisible = ref(false)

watch(() => videoRef.value, (val) => {
  if (val) {
    initBarrage();
    // 计算视频组件高度
    videoRef.value!.style.height = `${videoRef.value!.offsetWidth * 9 / 16}px`;
    playerWindowRef.value!.style.minHeight = `${videoRef.value!.offsetWidth * 9 / 16}px`;
  }
});

function showMenu() {
  isMenuVisible.value = true
  if(!isFollowed.value) {
    isMenuVisible.value = false
  }
}

function hideMenu() {
  isMenuVisible.value = false
}

function setGroup() {
  console.log('setGroup')
}

function toggleFollow() {
  isFollowed.value = !isFollowed.value
}

function toggleFollowbt() {
  isFollowed.value = !isFollowed.value
  isMenuVisible.value = false
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

function playMpd(video, url, art) {
  if (dashjs.supportsMediaSource()) {
    if (art.dash) art.dash.destroy();
    const dash = dashjs.MediaPlayer().create();
    dash.initialize(video, url, art.option.autoplay);
    art.dash = dash;
    art.on('destroy', () => dash.destroy());
  } else {
    art.notice.show = 'Unsupported playback format: mpd';
  }
}

function handleLikeClick() {
  const key = `video-like-${props.videoID}`;
  likeCacheStore.like(key);
}

function handleCoinClick() {
  const key = `video-coin-${props.videoID}`;
  if (!likeCacheStore.isLiked(key)) {
    likeCacheStore.like(key);
  }
}

/* 收藏相关 */
const starDialogRef = ref<CommonDialogExpose>();
const starList = ref<API.Star[]>([]); // 收藏夹列表
const staredList = ref<string[]>([]); // 已经收藏过的收藏夹列表

async function getStarList() {
  try {
    const res = await services.starService.starController.listStarByUidUsingGet({
      uid: userStore.userInfo?.id!,
    });
    if (res.data.code == 200) {
      starList.value = res.data.data?.list ?? [];
      selectedStar.value = [...staredList.value];
    }
  } finally {

  }
}

async function handleStarClick() {
  if (!userStore.userInfo.id) {
    showLoginModal();
    return;
  }
  await getStarList();
  starDialogRef.value?.show();

}

function handleStarAdd() {
  if (!userStore.userInfo.id) {
    showLoginModal();
    return;
  }
  DialogManager.inputDialog({
    title: '新建收藏夹',
    content: '请输入收藏夹名称',
  }).then(res1 => {
    if (res1.status) {
      services.starService.starController.addStarUsingPost({
        starName: res1.value,
        uid: userStore.userInfo.id!,
      }).then((res2) => {
        if (res2.data.code == 200) {
          ToastManager.success('添加成功');
          getStarList().then(() => {
            selectedStar.value = [res1.value];
          });
        }
      });
    }
  });
}

const selectedStar = ref<string[]>([]); // 已在对话框中选择的收藏夹
async function handleStarConfirm(close: Function) {
  try {
    if (selectedStar.value.length > 0) {
      const res = await services.starService.starController.starVideoUsingPost({
        updateId: videoInfo.value?.update?.id!,
      }, selectedStar.value.filter((v) => {
        return staredList.value.indexOf(v) == -1;
      }));
      if (res.data.code == 200) {
        ToastManager.success('收藏成功！');
      }
    }
    // 处理取消收藏
    staredList.value.filter((v) => {
      return selectedStar.value.indexOf(v) == -1;
    }).forEach((v) => {
      services.starService.starController.removeStarVideoUsingDelete({
        sid: v,
        updateId: videoInfo.value?.update?.id!,
      });
    });
    staredList.value = selectedStar.value;
  } finally {
    close();
  }
}
function handleChooseStar(item: API.Star) {
  if (selectedStar.value.indexOf(item.id!) == -1) {
    selectedStar.value.push(item.id!);
  } else {
    selectedStar.value = selectedStar.value.filter((v) => {
      return v != item.id;
    });
  }
}

const commentViewRef = ref();
</script>

<template>
  <div class="video-page">
    <div class="video-container">
      <!-- Left Section -->
      <div class="left-section">
        <div class="video-info">
          <div class="title">{{ videoInfo?.video?.title }}</div>
          <div class="detail">
            <span class="view">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#ffffff"><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z" fill="currentColor"></path></svg>
              {{ getStatString(videoInfo?.video?.playNum ? videoInfo?.video?.playNum : Math.floor(Math.random() * 100000)) }}
            </span>
            <span class="dm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#ffffff"><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z" fill="currentColor"></path><path d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z" fill="currentColor"></path><path d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z" fill="currentColor"></path><path d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z" fill="currentColor"></path></svg>
              {{ getStatString(videoInfo?.video?.dmNum ? videoInfo?.video?.dmNum : Math.floor(Math.random() * 1000)) }}
            </span>
            <span class="pubdate"><DateFormat :date="videoInfo?.update?.uploadTime" /></span>
            <span class="copyright"><Forbid theme="outline" :fill="variables.colorDanger" />未经作者授权，禁止转载</span>
          </div>
        </div>
        <!--        <DiliButton text="开播" @click="videoRef?.play()"></DiliButton>-->
        <div ref="playerWindowRef" class="player-window">
          <!-- <video class="player" ref="videoRef" id="video" controls></video> -->
          <div ref="videoRef" class="artplayer-app"></div>
          <div class="player-window-bottom">

          </div>
        </div>
        <div class="video-actions">
          <DiliButton>
            <div class="video-like" :class="{'video-like--active': likeCacheStore.isLiked(`video-like-${props.videoID}`)}" @click="handleLikeClick">
              <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.77234 30.8573V11.7471H7.54573C5.50932 11.7471 3.85742 13.3931 3.85742 15.425V27.1794C3.85742 29.2112 5.50932 30.8573 7.54573 30.8573H9.77234ZM11.9902 30.8573V11.7054C14.9897 10.627 16.6942 7.8853 17.1055 3.33591C17.2666 1.55463 18.9633 0.814421 20.5803 1.59505C22.1847 2.36964 23.243 4.32583 23.243 6.93947C23.243 8.50265 23.0478 10.1054 22.6582 11.7471H29.7324C31.7739 11.7471 33.4289 13.402 33.4289 15.4435C33.4289 15.7416 33.3928 16.0386 33.3215 16.328L30.9883 25.7957C30.2558 28.7683 27.5894 30.8573 24.528 30.8573H11.9911H11.9902Z" fill="currentColor"></path></svg>
              <span>{{ getStatString(videoInfo?.updateHeat?.likeNum ?? 0) }}</span>
            </div>
          </DiliButton>
          <DiliButton>
            <div class="video-coin" :class="{'video-like--active': likeCacheStore.isLiked(`video-coin-${props.videoID}`)}" @click="handleCoinClick">
              <svg width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" data-v-3b3ce5ad=""><path fill-rule="evenodd" clip-rule="evenodd" d="M14.045 25.5454C7.69377 25.5454 2.54504 20.3967 2.54504 14.0454C2.54504 7.69413 7.69377 2.54541 14.045 2.54541C20.3963 2.54541 25.545 7.69413 25.545 14.0454C25.545 17.0954 24.3334 20.0205 22.1768 22.1771C20.0201 24.3338 17.095 25.5454 14.045 25.5454ZM9.66202 6.81624H18.2761C18.825 6.81624 19.27 7.22183 19.27 7.72216C19.27 8.22248 18.825 8.62807 18.2761 8.62807H14.95V10.2903C17.989 10.4444 20.3766 12.9487 20.3855 15.9916V17.1995C20.3854 17.6997 19.9799 18.1052 19.4796 18.1052C18.9793 18.1052 18.5738 17.6997 18.5737 17.1995V15.9916C18.5667 13.9478 16.9882 12.2535 14.95 12.1022V20.5574C14.95 21.0577 14.5444 21.4633 14.0441 21.4633C13.5437 21.4633 13.1382 21.0577 13.1382 20.5574V12.1022C11.1 12.2535 9.52148 13.9478 9.51448 15.9916V17.1995C9.5144 17.6997 9.10883 18.1052 8.60856 18.1052C8.1083 18.1052 7.70273 17.6997 7.70265 17.1995V15.9916C7.71158 12.9487 10.0992 10.4444 13.1382 10.2903V8.62807H9.66202C9.11309 8.62807 8.66809 8.22248 8.66809 7.72216C8.66809 7.22183 9.11309 6.81624 9.66202 6.81624Z" fill="currentColor"></path></svg>
              <span>{{ getStatString(videoInfo?.video?.coinNum ?? 0) }}</span>
            </div>
          </DiliButton>
          <DiliButton>
            <div class="video-star" :class="{'video-star--active': selectedStar.length || staredList.length}" @click="handleStarClick">
              <svg width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" data-v-c9ebd4c8=""><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z" fill="currentColor"></path></svg>
              <span>{{ getStatString(videoInfo?.video?.starNum ?? 0) }}</span>
            </div>
          </DiliButton>
        </div>
        <div class="video-detail">
          <div class="video-description">
            <span>{{ videoInfo?.update?.content }}</span>
          </div>
          <div class="video-tags">
            <span>分区：</span>
            <DiliButton :text="partitionName"></DiliButton>
          </div>
        </div>
        <CommentView v-if="videoInfo?.video?.id" ref="commentViewRef" :post-id="videoInfo?.update?.id" :post-user-id="videoInfo?.user?.id" />
<!--        <div class="comment-list">-->
<!--          <div class="list-header">-->
<!--            <div class="list-title">评论</div>-->
<!--            <div class="list-count">0</div>-->
<!--            <div class="list-sort">-->
<!--              <span>时间</span>-->
<!--              <span>热度</span>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="reply-box">-->
<!--            <div class="reply-box-avatar"></div>-->
<!--            <div class="reply-box-input">-->
<!--              <textarea placeholder="你猜我的评论区在等待谁？"></textarea>-->
<!--            </div>-->
<!--            <div class="reply-box-input-actions">-->
<!--              <div class="send-text">发布</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <UserCard
          :uid="videoInfo?.user?.id"
          :name="videoInfo?.user?.name"
          :fan-num="userInfo.userInfo?.value?.fan"
          :video-num="userInfo.essayCount.value"
          :level="videoInfo?.user?.level"
        />
        <div class="recommend-list">
          <div class="recommend-list-title">相关推荐</div>
          <video-card2
            v-for="item in rList"
            :key="item.vid"
            :cover-url="'https://api.likepoems.com/img/pc/'"
            :title="item.title"
            :up-name="item.upName"
            :play="item.playNum"
            :danmaku="item.dmNum"
            :duration="item.duration"
          >
          </video-card2>
        </div>
      </div>
    </div>
    <CommonDialog ref="starDialogRef" title="收藏" :on-confirm="handleStarConfirm">
      <div class="star-list">
        <div class="star-list-item" style="border: 1px dashed grey; margin-bottom: .25rem"
             @click="handleStarAdd"
        >
          <div class="star-list-item__name">
            + 新建收藏夹
          </div>
        </div>
        <div class="star-list-item" :class="{'star-list-item--selected': selectedStar.indexOf(item.id) != -1}"
             @click="handleChooseStar(item)"
             v-for="item in starList">
          <div class="star-list-item__name">
            {{ item.starName }}
          </div>
          <div class="star-list-item__num">
            {{ item.starNum }}
          </div>
        </div>
      </div>
    </CommonDialog>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";

.star-list {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  &-item {
    @extend %button-like;
    width: 100%;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    &__name {

    }
    &__num {

    }
    &--selected {
      background-color: $color-primary;
      color: white;
    }
    &:not(&--selected) {
      @extend %click-able;
    }
  }
}

a {
  text-decoration: none;
}

.video-page {
  width: 100%;
  height: 100%;
  background-color: white;
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
  width: 70%;
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
  color: $color-grey-500;
}

.view {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;
  gap: .25rem;
}

.dm {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;
  gap: .25rem;
}

.pubdate {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;
}

.copyright {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

.player-window {
  width: 100%;
  //position: relative;
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
  gap: 1rem;
  color: $color-grey-300;
}

.video-like,
.video-coin,
.video-star {
  padding-right: 8px;
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  gap: .5rem;
  color: lighten(black, 30%);
  transition: color .2s $ease-out-circ;

  &:not(&--active):hover {
    color: transparentize($color-primary, 0.2);
  }

  &--active {
    color: $color-primary;
  }
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
  display: flex;
  align-items: center;
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
  border-radius: .5rem;
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
  margin-top: 1rem;
  width: 30%;
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
  border-radius: .5rem;
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
  //height: 300px;

}
</style>