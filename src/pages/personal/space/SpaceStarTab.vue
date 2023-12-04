<script setup lang="ts">

import { computed, CSSProperties, onMounted, ref } from "vue";

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

const computedStyle = computed((): CSSProperties => {
  const styles: CSSProperties = {};
  // console.log(starTabRef.value?.offsetTop)
  // styles.height = `calc(100vh - ${starTabRef.value?.offsetTop}px)`;
  return styles;
});

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
  <div ref="starTabRef" class="space-tab-star" :style="computedStyle">
    <section class="collection-list">
      <div class="collection-list-item" v-for="item in collections">
        <div class="collection-list-item__name">{{ item.name }}</div>
        <div class="collection-list-item__count">{{ item.count }}</div>
      </div>
    </section>
    <hr style="width: 1px; height: 100vh; background-color: #9E9E9E7F; margin: 0;" />
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