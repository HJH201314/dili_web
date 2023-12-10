import { createApp, h } from "vue";
import type { App } from "vue";
import CommonDialog from "./CommonDialog.vue";
import { generateRandomString, getRandomString } from "@/utils/string";

let dialogDiv: HTMLDivElement | null = null;
let app: App | null = null;

export type CommonDialogProps = {
  _id?: string; // DialogManager提供的唯一ID
  title?: string;
  subtitle?: string;
  content?: string;
  showCancel?: boolean;

  // 提供回调props，方便函数调用时使用
  onCancel?: (close: () => void) => void;
  onConfirm?: (close: () => void) => void;
}
export type CommonDialogEmits = {
  (event: 'onCancel', close: () => void): void;
  (event: 'onConfirm', close: () => void): void;
}

function showCommonDialog(props: CommonDialogProps) {
  if (!dialogDiv) {
    dialogDiv = document.createElement('div');
    document.querySelector('#app')?.appendChild(dialogDiv);
  } else {
    app?.unmount(); // 卸载之前的应用实例
  }
  app = createApp({
    render() {
      return h(CommonDialog, props);
    }
  });
  app.mount(dialogDiv);
}

export default showCommonDialog;
