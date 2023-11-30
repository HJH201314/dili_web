<script setup lang="ts">

import PostItemCard from "./components/PostItemCard.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import adminApi from "@/apis/services/video-platform-admin";

const id = ref(-1);

onMounted(() => {
  const route = useRoute();
  id.value = parseInt(route.query.id as string);
  if (!id.value || id.value <= 0) {
    useRouter().replace('/home');
  }
});

async function getPost() {
  try {
    await adminApi.UpdatesController.getUpdatesByTypeUsingGET({

    });
  } catch (e) {

  }
}
</script>

<template>
  <PostItemCard

  />
</template>

<style scoped lang="scss">

</style>