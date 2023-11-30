<template>
  <el-container style="background-color: black;margin: 0;height: 100vh;">
    <el-main>
      <div style="height: 50vh;width: 400px;background-color: white;border-radius: 8px;padding: 10px">
        <el-scrollbar class="scrollbar-wrapper">
          <div v-for="(item, index) in historyList" :key="index" style="margin-bottom: 8px; display: flex;">
            <div style="flex: 1; position: relative;width: 182px; height: 72px;">
              <el-image style="border-radius: 8px; width: 182px; height: 72px;" :src="`需要根据media id请求`"/>
              <el-text size="small" style="color: black; position: absolute; bottom: 0;
                 right: 0; background-color: rgba(166, 166, 166, 0.8);
                  padding: 2px 4px; margin-bottom: 4px; margin-right: 12px; border-radius: 4px;">
                {{ item.watchedAt }}
              </el-text>
            </div>
            <el-space direction="vertical" style="flex: 1;">
              <el-text line-clamp="2" size="large" style="color: black;
                margin-left: 0;">
                {{ item.title }}
              </el-text>
              <el-row>
                <el-icon><VideoCamera /></el-icon>
                <el-text line-clamp="1" size="small" style="color: rgb(128,128,128);
                  margin-right: 8px;">
                  {{ item.hisTime }}
                </el-text>
              </el-row>
              <el-row>
                <el-icon><User /></el-icon>
                <el-text line-clamp="1" size="small" style="color: rgb(128,128,128);
                  left: 0; margin-right: 8px;">
                  {{ item.upName }}
                </el-text>
              </el-row>
            </el-space>
          </div>

        </el-scrollbar>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { VideoCamera, User } from "@element-plus/icons";
import { ElImage, ElMain, ElSpace, ElText, ElRow, ElIcon, ElScrollbar, ElContainer } from "element-plus";
export default {
  data() {
    return {
      historyList: [],
    };
  },
  methods: {
    getHistoryList() {
      //todo: 根据用户id请求历史记录
      return [
        {
          uid: 1,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "视频的封面",
        },
        {
          uid: 2,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "视频的封面",
        },
        {
          uid: 3,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "视频的封面",
        },
        {
          uid: 4,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "视频的封面",
        },
        {
          uid: 5,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "视频的封面",
        },
        {
          uid: 6,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "视频的封面",
        },
      ]
    }
  },
  mounted() {
    this.historyList = this.getHistoryList();
  }
};
</script>

<style scoped>
.scrollbar-wrapper {
  width: 100%;
  overflow: auto;
}
</style>
