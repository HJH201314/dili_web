<template>
  <el-container style="background-color: transparent; margin: 0;">
    <el-main>
      <div style="width: 400px;background-color: white;border-radius: .5rem; padding: .5rem">
        <el-scrollbar class="scrollbar-wrapper">
          <div v-for="(item, index) in historyList" :key="index" class="history-item" style="display: flex;">
            <div style="flex: 1; position: relative;width: 182px; height: 5.5rem;">
              <el-image style="border-radius: 8px; width: 182px; height: 5.5rem;" :src="item.coverUrl"/>
              <el-text size="small" style="color: black; position: absolute; bottom: 0;
                 right: 0; background-color: rgba(166, 166, 166, 0.8);
                  padding: 2px 4px; margin-bottom: 4px; margin-right: 12px; border-radius: 4px;">
                {{ item.watchedAt }}
              </el-text>
            </div>
            <el-space direction="vertical" style="flex: 1;">
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
            </el-space>
          </div>

        </el-scrollbar>
      </div>
    </el-main>
  </el-container>
</template>

<script>
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
          coverUrl: "https://i1.hdslb.com/bfs/archive/99e1ec6c6a6462ea410bd9acc0eebb0eebbc1488.jpg@672w_378h_1c_!web-home-common-cover.webp",
        },
        {
          uid: 2,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "https://i1.hdslb.com/bfs/archive/99e1ec6c6a6462ea410bd9acc0eebb0eebbc1488.jpg@672w_378h_1c_!web-home-common-cover.webp",
        },
        {
          uid: 3,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "https://i1.hdslb.com/bfs/archive/99e1ec6c6a6462ea410bd9acc0eebb0eebbc1488.jpg@672w_378h_1c_!web-home-common-cover.webp",
        },
        {
          uid: 4,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "https://i1.hdslb.com/bfs/archive/99e1ec6c6a6462ea410bd9acc0eebb0eebbc1488.jpg@672w_378h_1c_!web-home-common-cover.webp",
        },
        {
          uid: 5,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "https://i1.hdslb.com/bfs/archive/99e1ec6c6a6462ea410bd9acc0eebb0eebbc1488.jpg@672w_378h_1c_!web-home-common-cover.webp",
        },
        {
          uid: 6,
          watchedAt: "2:30",
          hisTime: "2021-01-01 12:00:00",
          title: "视频的标题",
          upName: "up主的名字",
          coverUrl: "https://i1.hdslb.com/bfs/archive/99e1ec6c6a6462ea410bd9acc0eebb0eebbc1488.jpg@672w_378h_1c_!web-home-common-cover.webp",
        },
      ]
    }
  },
  mounted() {
    this.historyList = this.getHistoryList();
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/main";
.scrollbar-wrapper {
  width: 100%;
  overflow: auto;
}
.history-item {
  @extend %hover-able;
  @extend %button-like;
  @extend %transition-all-circ;
}
</style>
