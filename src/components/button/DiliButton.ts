import type { CSSProperties } from "vue";

export type DiliButtonProps = {
  text?: string;
  icon?: string;
  type?: 'normal' | 'primary';
  backgroundColor?: string;
  fontColor?: string;
  shadow?: boolean;

  // 自定义样式
  buttonStyle?: CSSProperties;
}