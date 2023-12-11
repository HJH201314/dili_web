import type { CSSProperties } from "vue";

export type DiliButtonProps = {
  text?: string;
  icon?: string;
  type?: 'normal' | 'primary';
  backgroundColor?: string;
  fontColor?: string;

  // 自定义样式
  buttonStyle?: CSSProperties;
}