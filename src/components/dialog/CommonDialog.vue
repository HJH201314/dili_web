<!-- 基于Modal的基础对话框组件 -->
<script setup lang="ts">

import CommonModal from "@/components/modal/CommonModal.vue";
import { ref } from "vue";
import type { CommonModalFunc } from "@/components/modal/CommonModal";
import DiliButton from "@/components/button/DiliButton.vue";
import type { CommonDialogEmits, CommonDialogProps } from "@/components/dialog/CommonDialog";

const props = withDefaults(defineProps<CommonDialogProps>(), {
  title: '123'
});

const emits = defineEmits<CommonDialogEmits>();

const modalRef = ref<CommonModalFunc>();
</script>

<template>
  <CommonModal :modal-style="{ 'background-color': 'white' }" ref="modalRef" :visible="true" :show-close="false">
    <div class="dialog">
      <header>
        <div class="dialog-title">{{ title }}</div>
      </header>
      <main>
        <slot></slot>
      </main>
      <hr style="margin: .5rem 0;" />
      <footer>
        <DiliButton text="取消" type="normal" />
        <DiliButton text="确认" type="primary" />
      </footer>
    </div>
  </CommonModal>
</template>

<style scoped lang="scss">
.dialog {
  width: 100%;
  padding: .5rem;
  > header {

  }
  > main {

  }
  > footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
  }
  &-title {
    font-weight: bold;
    font-size: 1.25rem;
  }
}
</style>