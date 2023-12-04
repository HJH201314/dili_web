<script setup lang="ts">

import { computed, onMounted, ref } from "vue";
import type { CSSProperties } from "vue";

type CollectionItem = {
  name: string;
  count: number;
}
const collections = ref<CollectionItem[]>();

onMounted(() => {
  Promise.all([
    getCollections()
  ]).then(() => {
  });
});

const starTabRef = ref<HTMLDivElement>();

function getComputedStyle() {
  const styles: CSSProperties = {};
  console.log(starTabRef.value?.offsetHeight, starTabRef.value?.offsetTop);
  styles.height = `calc(100vh - ${starTabRef.value?.offsetTop}px - 5.5rem)`;
  return styles;
}

async function getCollections() {
  try {
    collections.value = [];
    for (let i = 0; i < 20; i++) {
      collections.value?.push({
        name: `收藏夹${i + 1}`,
        count: 10 * i + 1,
      });
    }
  } finally {

  }
}
</script>

<template>
  <div ref="starTabRef" class="space-tab-star" :style="getComputedStyle()">
    <section class="collection-list" ref="collectionListRef">
      <div class="collection-list-item" v-for="item in collections">
        <div class="collection-list-item__name">{{ item.name }}</div>
        <div class="collection-list-item__count">{{ item.count }}</div>
      </div>
    </section>
    <hr style="width: 1px; height: 100%; background-color: #9E9E9E7F; margin: 0;" />
    <section class="video-list">

    </section>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.space-tab-star {
  position: relative;
  border-radius: .5rem;
  box-shadow: $box-shadow;
  display: flex;
  gap: .5rem;
  background-color: white;
  padding: .5rem;
  .collection-list {
    flex: 2;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &-item {
      @extend %click-able;
      @extend %button-like;
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      &__name {

      }
      &__count {
        color: $color-grey-500;
      }
    }
  }
  .video-list {
    flex: 7;
    display: grid;
  }
}
</style>