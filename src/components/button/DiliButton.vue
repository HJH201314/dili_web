<script setup lang="ts">
import type { DiliButtonProps } from "@/components/button/DiliButton";
import variables from "@/assets/variables.module.scss";
import { computed, ref, watch } from "vue";
import { getDarkerColor } from "@/utils/color";

const props = withDefaults(defineProps<DiliButtonProps>(), {
  text: "",
  type: "normal",
});

const buttonRef = ref<HTMLButtonElement>();

const backgroundColor = computed(() => {
  if (props.type == 'primary') {
    return props.backgroundColor || variables.colorPrimary;
  } else {
    return '#FFFFFF';
  }
});
const hoverBackgroundColor = computed(() => {
  return getDarkerColor(backgroundColor.value, 0.1);
});
const activeBackgroundColor = computed(() => {
  return getDarkerColor(backgroundColor.value, 0.2);
});

const fontColor = computed(() => {
  if (props.type == 'primary') {
    return '#FFFFFF';
  } else {
    return props.fontColor || variables.colorBlack;
  }
});
const hoverFontColor = computed(() => {
  return getDarkerColor(fontColor.value, 0.1);
});
const activeFontColor = computed(() => {
  return getDarkerColor(fontColor.value, 0.2);
});

</script>

<template>
  <div class="dili-button">
    <button ref="buttonRef" :style="buttonStyle">
      {{ props.text }}
    </button>
    <div class="mask">

    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.dili-button {
  position: relative;
  > .mask {
    position: absolute;

  }
  > button {
    outline: none;
    border-radius: .5rem;
    padding: .25rem 1rem;
    transition: background-color .2s $ease-out-circ, color .2s $ease-out-circ;
    background-color: v-bind(backgroundColor);
    color: v-bind(fontColor);
    overflow: hidden;

    &:hover {
      background-color: v-bind(hoverBackgroundColor);
      color: v-bind(hoverFontColor);
    }

    &:active {
      background-color: v-bind(activeBackgroundColor);
      color: v-bind(activeFontColor);
    }
  }

}
</style>