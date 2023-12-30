<!-- 全站通用视频封面展示组件 -->
<script setup lang="ts">
/**
 * 全站通用视频封面展示组件
 * 组件难点：
 * 1、此组件的宽度通常是由外部布局决定的，需要控制组件长宽比，同时避免文本错误溢出
 */
import type { VideoCardProps } from "@/components/video-card/VideoCard";
import { onMounted, ref, shallowRef, watch } from 'vue';
import type { CSSProperties } from "vue";
import DateFormat from "@/components/date-format/DateFormat.vue";
import { useRouter } from "vue-router";
import services from "@/apis/services";
import { getDurationString, getStatString } from '@/utils/string';

const props = withDefaults(defineProps<VideoCardProps>(), {
  pid: -1,
  vid: -1,
  coverUrl: 'https://cdn.fcraft.cn/image/dilidili/cover.jpg',
  title: '未知标题未知标题未知标题未未知标题未知标题未知标题未知标题',
  upId: 1,
  upName: '未知发布者',
  playNum: 114,
  dmNum: 514,
  createTime: new Date().toLocaleString(),
  duration: '08:40',

  autoFetch: false,

  shadowed: false,
});

const coverRef = ref<HTMLDivElement>();

const router = useRouter();
function handleUpNameClick() {
  if (props.upId > 0)
    router.replace(`/space/${props.upId}`)
}

function handleTitleClick() {
  if (displayInfo.value.vid > 0)
    router.replace(`/video/${displayInfo.value.vid}`);
}

const displayInfo = ref<VideoCardProps>({
  vid: props.vid ?? -1,
  pid: props.pid ?? -1,
});

async function getVideoInfoByPid(pid: number) {
  try {
    if (displayInfo.value.vid == -1 && displayInfo.value.pid != -1) {
      const res = await services.adminService.videoController.getVideoDetailUsingGet({
        id: pid,
      });
      if (res.data.code == 200) {
        const d = res.data.data;
        displayInfo.value = {
          vid: d?.id!,
          coverUrl: props.coverUrl, // 需要另一个函数来获取
          title: displayInfo.value?.title || d?.title,
          upId: undefined,
          upName: d?.upName,
          playNum: d?.playNum,
          dmNum: d?.dmNUm,
          createTime: d?.uploadTime,
          duration: undefined,
        }
        console.log(displayInfo)
      }
    }
    if (displayInfo.value.vid != -1) {
      const res2 = await services.adminService.videoController.getVideoInfoUsingGet({
        id: displayInfo.value.vid!,
      });
      if (res2.data.code == 200) {
        const d = res2.data.data;
        displayInfo.value = { ...displayInfo.value, ...{
            coverUrl: JSON.parse(d?.update?.urls ?? '[]')[0] || props.coverUrl,
            title: d?.video?.title || displayInfo.value?.title,
            upId: d?.user?.id,
            upName: d?.user?.name,
            playNum: d?.video?.playNum,
            dmNum: d?.video?.dmNum,
            createTime: d?.update?.uploadTime,
            duration: d?.video?.totalTime,
          } };
      }
    }
  } finally {

  }
}

watch(() => props, (val) => {
  displayInfo.value = {
    ...val,
    createTime: typeof val.createTime == 'object' ?
      new Date(val.createTime[0], val.createTime[1] - 1, val.createTime[2], val.createTime[3], val.createTime[4], val.createTime[5]).toLocaleString() :
      val.createTime,
  };
}, { immediate: true, deep: true });

watch(() => props.pid, (val) => {
  if (val && props.autoFetch) {
    getVideoInfoByPid(val);
  }
}, { immediate: true });

const width = ref<number>(0);
const height = ref<number>(0);

const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    if (entry.target.className.endsWith('cover')) {
      if ((Math.round(entry.contentRect.width) - width.value) > 5) {
        width.value = entry.contentRect.width;
        height.value = entry.contentRect.width * 9 / 16;
      }
    }
  }
});

onMounted(() => {
  resizeObserver.observe(coverRef.value!);
});

</script>

<template>
  <div class="video-card" :class="{'shadowed': displayInfo.shadowed}" >
    <section ref="coverRef" class="cover" :style="{'height': `${height}px`, 'max-height': `${height}px`}" @click="handleTitleClick">
      <picture class="cover-image">
        <img :src="'/api/minio/video-platform.updates/' + displayInfo.coverUrl" alt="cover-image" />
      </picture>
      <div class="cover-mask">
        <div class="cover-stats">
          <div class="cover-stats-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff"><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z" fill="currentColor"></path></svg>
            {{ getStatString(displayInfo.playNum == 0 ? Math.floor(Math.random() * 100000) : displayInfo.playNum) }}
          </div>
          <div class="cover-stats-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff"><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z" fill="currentColor"></path><path d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z" fill="currentColor"></path><path d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z" fill="currentColor"></path><path d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z" fill="currentColor"></path></svg>
            {{ getStatString(displayInfo.playNum == 0 ? Math.floor(Math.random() * 1000) : displayInfo.dmNum) }}
          </div>
          <div class="cover-stats-duration">
            {{ getDurationString(displayInfo.duration ? displayInfo.duration : Math.floor(Math.random() * 3599) + 1) }}
          </div>
        </div>
      </div>
    </section>
    <section class="title dili-text-ellipsis" @click="handleTitleClick" v-html="displayInfo.title ?? ''"></section>
    <slot name="footer" class="footer" v-if="$slots.footer"/>
    <section v-else class="footer" @click="handleUpNameClick">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor"><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="currentColor"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="currentColor"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path></svg>
      <span class="footer__name">{{ displayInfo.upName }}</span>
      ·
      <DateFormat :date="displayInfo.createTime" />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.video-card {
  position: relative;
  border-radius: .5rem;
  height: max-content; // 可避在滚动的grid中被压缩
  overflow: hidden;
  &.shadowed {
    box-shadow: $box-shadow;
  }
  .cover {
    border-radius: .5rem;
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 0;
    &-image {
      position: absolute;
      inset: 0;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
    &-mask {
      cursor: pointer;
      position: absolute;
      inset: 0;
      z-index: 1;
      transition: opacity .2s $ease-out-circ;
      background-image: linear-gradient(0deg, #0000004F, #00000000);
      opacity: 1;
      &:hover {
        opacity: .1;
      }
    }
    &-stats {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      padding: .25rem .5rem;
      color: white;
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: .8rem;
      &-item {
        display: flex;
        align-items: center;
        gap: .1rem;
        &__icon {

        }
        &__text {

        }
      }
      &-duration {
        margin-left: auto;
      }
    }
  }
  .title {
    padding: 0 .25rem;
    cursor: pointer;
    font-size: .9rem;
    //line-height: 1.1rem;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    transition: color .1s $ease-out-circ;
    &:hover {
      color: $color-primary;
    }
  }
  .footer {
    font-size: .8rem;
    padding: 0 .25rem;
    display: flex;
    gap: .2rem;
    align-items: center;
    color: $color-grey-500;

    &:hover {
      cursor: pointer;
      color: $color-primary;
      transition: color .2s $ease-out-circ;
    }
  }
}
</style>