# dili-web

这是一个视频播放平台前端

## Recommended IDE Setup

Option1: [WebStorm](https://www.jetbrains.com/webstorm/).

Option2: [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we add a `shims-vue.d.ts` file to tell TypeScript what to do.

Also, we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

## 开始使用

```sh
# 安装依赖
$ pnpm install

# 启动开发服务器
$ pnpm dev

# 编译产物
$ pnpm build
```

## 项目结构

```text
.
|-- src
    |-- App.vue # 根组件
    |-- main.ts # 入口文件
    |-- shims-vue.d.ts # Vue 模块声明
    |-- assets # 静态资源
    |-- components # 组件
    |   |-- component_name # 组件名
    |       |-- index.vue # 组件
    |       |-- index.ts # 组件导出
    |       
    |-- commands # 自定义命令
    |-- pages # 页面
    |   |-- common # 公共页面
    |   |   |-- page_name # 页面名
    |   |       |-- index.vue # 页面
    |
    |   |-- video # 视频播放相关页面
    |   |   |-- page_name # 页面名
    |   |       |-- index.vue # 页面
    |
    |   |-- personal # 个人中心相关页面
    |   |   |-- page_name # 页面名
    |   |       |-- index.vue # 页面
    |
    |   |-- platform # 创作中心相关页面
    |       |-- page_name # 页面名
    |           |-- index.vue # 页面
    |
    |-- router # 路由
    |-- stores # Pinia 状态管理
        |-- useSomeStore.ts # 某个 store

```

