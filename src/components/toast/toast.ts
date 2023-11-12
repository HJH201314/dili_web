import type { ToastProps } from "./index";
import { createApp, h } from "vue";
import Toast from "./DiliToast.vue";

let toastDiv: HTMLDivElement;
let options: ElementCreationOptions;
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