import { createApp, h } from "vue";
import type { App } from "vue";
import CommonDialog from "./CommonDialog.vue";

let dialogDiv: HTMLDivElement | null = null;
let app: App | null = null;

export type CommonDialogProps = {
  title?: string;
  subtitle?: string;
  showCancel?: boolean;
}
export type CommonDialogEmits = {
  (event: 'onCancel'): void;
  (event: 'onConfirm'): void;
}

function showCommonDialog(props: CommonDialogProps) {
  if (!dialogDiv) {
    dialogDiv = document.createElement('div');
    document.querySelector('#app')?.appendChild(dialogDiv);
  } else {
    app?.unmount(); // 卸载之前的应用实例
  }
  console.log("create")
  app = createApp({
    render() {
      return h(CommonDialog, props);
    }
  });
  app.mount(dialogDiv);
}

export default showCommonDialog;
