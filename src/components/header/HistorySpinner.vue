<template>
  <el-container style="background-color: transparent;">
    <el-main>
      <div style="width: 370px;height: 480px;background-color: white;border-radius: .5rem;">
        <el-scrollbar class="scrollbar-wrapper">
          <div v-for="(item, index) in historyList" :key="index" class="history-item" style="display: flex;">
            <div style="position: relative;margin-right: 10px; width: 128px; height: 72px;">
              <el-image style="border-radius: 8px; width: 128px; height: 72px;" :src="item.coverUrl"/>
              <div style="position: absolute;bottom: 4px;right: 4px;padding: 0;
              background-color: rgba(0,0,0,.4);border-radius: 2px;line-height: 17px">
                <span style="display: inline-block;color: white;font-size: 12px;line-height: 14px;transform: scale(.85);transform-origin: center top">
                {{ item.watchedAt +'/'+ item.duration }}
                </span>
              </div>
            </div>
            <div style="display: flex;flex: 1 auto;flex-direction: column;justify-content: space-between">
              <div title="item.title" style="height: 36px;margin-bottom: 4px;color: #18191c;font-size: 14px;line-height: 18px" >
                {{item.title}}
              </div>
              <div style="display: flex;align-items: center;color: #9499a0;font-size: 12px;line-height: 16px">
                <el-icon><VideoCamera style="height: 1rem; width: 1rem;" /></el-icon>
                <span style="margin-right: 8px;">{{item.hisTime}}</span>
              </div>
              <div title="item.upName" style="display: flex;align-items: center;color: #9499a0;font-size: 12px;line-height: 16px">
                <el-icon><User style="height: 1rem; width: 1rem;" /></el-icon>
                <span style="margin-right: 8px;">{{item.upName}}</span>
              </div>
            </div>
<!--            <el-space direction="vertical" style="flex: 1;">
              <el-text line-clamp="2" size="large" style="color: black; margin-left: 0;">
                {{ item.title }}
              </el-text>
              <el-row justify="space-between" style="color: rgb(128,128,128);">
                <el-space>
                  <el-icon><VideoCamera style="height: 1rem; width: 1rem;" /></el-icon>
                  <el-text line-clamp="1" size="small" style="margin-right: 8px;">
                    {{ item.hisTime }}
                  </el-text>`
                </el-space>
              </el-row>
              <el-row justify="space-between" style="color: rgb(128,128,128);">
                <el-space>
                  <el-icon><User style="height: 1rem; width: 1rem;" /></el-icon>
                  <el-text line-clamp="1" size="small" style="color: rgb(128,128,128);
                    left: 0; margin-right: 8px;">
                    {{ item.upName }}
                  </el-text>
                </el-space>
              </el-row>
            </el-space>-->
          </div>

        </el-scrollbar>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElImage, ElMain, ElIcon, ElScrollbar, ElContainer } from "element-plus";
import { onMounted, ref } from "vue";
import services from "@/apis/services";
import { getRecentHistoryListUsingGet } from "@/apis/services/video-platform-admin/historyController";

onMounted(() => {
  getHistoryList();
});

const myuid = ref<number>();

type HistoryItem = {
  uid?: number;
  watchedAt?: string;
  duration?: number;
  hisTime?: string;
  title?: string;
  upName?: string;
  coverUrl?: string;
};

const historyList = ref<HistoryItem[]>([]);
const back_historyList = ref<API.Vo[]>([]);
const back_duration = ref<number>();

function getHistoryList() {
  services.adminService.historyController.getRecentHistoryListUsingGet({userId: myuid.value}).then((res) => {
    back_historyList.value = res.data.data ?? [];
    for (let i = 0; i < back_historyList.value.length; i++) {
      services.adminService.videoController.getVideoInfoUsingGet({ id: res.data.data![i].uid ?? 0 }).then((result) => {
        back_duration.value = result.data.data!.video?.totalTime ?? 0;
      })
      historyList.value.push({
        uid: back_historyList.value[i].uid,
        watchedAt: back_historyList.value[i].watchedAt,
        duration: back_duration.value,
        hisTime: back_historyList.value[i].hisTime,
        title: back_historyList.value[i].title,
        upName: back_historyList.value[i].upName,
        coverUrl: back_historyList.value[i].coverUrl,
      });
    }
  });
}
</script>

<style scoped lang="scss">
@import "@/assets/main";
.scrollbar-wrapper {
  width: 100%;
  overflow: auto;
}
.history-item {
  width: 366px;
  height: 92px;
  padding: 10px 20px;
  @extend %hover-able;
  @extend %button-like;
  @extend %transition-all-circ;
}
</style>
