/*
  usePartitionStore - 分区获取和缓存
 */
import { defineStore } from "pinia";
import services from "@/apis/services";
import { useLocalStorage } from "@vueuse/core";
import { computed, onMounted, provide } from "vue";
import { ErrorNoticeKey } from "@/constants/inject";

const usePartitionStore = defineStore('partition', () => {

  const partitionStorage = useLocalStorage('partition-cache', [] as API.Partition[], {
    onError() {
      provide(ErrorNoticeKey, 'partition storage error');
    }
  });
  /* 分区列表（响应） */
  const partition = computed(() => partitionStorage.value); // 由于第三方ref无法返回，这里重新包装一个partition

  onMounted(() => {
    Promise.all([
        refreshPartition(),
    ]).then();
  });

  /**
   * 从服务器刷新分区列表
   */
  async function refreshPartition() {
    const res = await services.adminService.updatesController.allPartitionsUsingGet();
    if (res.data.code == 200) {
      partitionStorage.value = res.data.data ?? [];
    }
  }

  /**
   * 获取分区列表（静态）
   */
  function getPartition() {
    return partitionStorage.value;
  }

  /**
   * 根据分区id获取分区名
   */
  function getPartitionNameById(pid: number) {
    partition.value.forEach((v) => {
      if (v.id == pid) {
        console.log(v)
        return v.name;
      }
    });
    return '';
  }

  return {
    partition,
    getPartition,
    refreshPartition,
    getPartitionNameById,
  }
});

export default usePartitionStore;