import type { ToastProps } from "@/components/toast/index";
import { createApp, h } from "vue";
import Toast from "@/components/toast/DiliToast.vue";

let toastDiv: HTMLDivElement;
function showToast(props: ToastProps) {
  if (!toastDiv) {
    toastDiv = document.createElement('div');
  }
  const element = createApp({
    render() {
      return h(Toast, props);
    }
  })
  document.querySelector('#app')?.appendChild(toastDiv);
  element.mount(toastDiv);
}

export default showToast;