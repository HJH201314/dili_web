<script setup lang="ts">

import { ref, watch } from "vue";
import type { CusInputProps } from "@/components/input/CusInput";

const props = withDefaults(defineProps<CusInputProps>(), {
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const v = ref(props.modelValue || props.value);

watch(() => v.value, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    console.log(newValue)
    emit("update:modelValue", newValue);
  }
});
</script>

<template>
  <input class="cus-input" v-model="v" :placeholder="placeholder" />
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.cus-input {
  outline: none;
  resize: none;
  border: none;
  box-sizing: border-box;
  border-radius: .5rem;
  padding: .25rem .5rem;
  transition: background-color .2s $ease-out-circ;
  background-color: $color-grey-100;
  &:focus {
    background-color: $color-grey-300;
  }
}
</style>