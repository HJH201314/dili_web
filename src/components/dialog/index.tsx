import { getRandomString } from "@/utils/string";
import { createApp, h } from "vue";
import type { App, VNode } from "vue";
import CommonDialog from "@/components/dialog/CommonDialog.vue";
import type { CommonDialogProps } from "@/components/dialog/CommonDialog";
import commonDialog from "@/components/dialog/CommonDialog";
import { InputForm } from "@/components/dialog/InputDialog";

type CommonDialogInstance = {
  dom: HTMLDivElement;
  app: App;
}

export class DialogManager {
  private static instances: Map<string, CommonDialogInstance> = new Map();
  private static top: number; // 当前最高的z-index

  public static commonDialog(props: CommonDialogProps, defaultSlot?: VNode) {
    const id = getRandomString(5);
    const dialogDiv = document.createElement('div');
    document.querySelector('#app')?.appendChild(dialogDiv);
    const dialogApp = createApp({
      render() {
        return h(CommonDialog, {
          ...props,
          _id: id, // 指定组件全局唯一ID
        },
        {
          default: () => defaultSlot
        });
      }
    });
    dialogApp.mount(dialogDiv);
    this.instances.set(id, {
      dom: dialogDiv,
      app: dialogApp,
    });
    console.debug(this.instances)
  }

  public static inputDialog(props: CommonDialogProps) {
    this.commonDialog(props, <InputForm></InputForm>);
  }

  public static destroy(_id: string) {
    const instance = this.instances.get(_id);
    if (!instance) return;
    instance.app.unmount();
    instance.dom.remove();
    this.instances.delete(_id);
    console.debug(this.instances)
  }
}