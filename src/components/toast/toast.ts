import type { ToastProps } from "./index";
import { createApp, h } from "vue";
import type { App } from "vue";
import Toast from "./DiliToast.vue";

let toastDiv: HTMLDivElement | null = null;
let app: App | null = null;

function showToast(props: ToastProps) {
  if (!toastDiv) {
    toastDiv = document.createElement('div');
    document.querySelector('#app')?.appendChild(toastDiv);
  } else {
    app?.unmount(); // 卸载之前的应用实例
  }
  app = createApp({
    render() {
      return h(Toast, props);
    }
  });
  app.mount(toastDiv);
}

export default showToast;
