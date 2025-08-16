// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
//
//
//
// // 基础样式
// import '@/assets/less/main.less'
// // tailwind-base
// import '@/assets/tailwind-base.css'
//
// const app = createApp(App)
//
// app.use(router)
//
// app.mount('#app')


import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 样式
import "@/assets/less/main.less"; // 你的 less
import "@/assets/tailwind-base.css"; // 你的 tailwind

// ===== 新增：引入 vue-toastification =====
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
// ======================================

const app = createApp(App);

app.use(router);

// ===== 新增：注册 Toast 插件 =====
app.use(Toast, {
  position: "top-right", // 提示框位置（右上角）
  timeout: 3000,         // 自动关闭时间 (ms)
  closeOnClick: true,    // 点击关闭
  pauseOnHover: true,    // 悬停不关闭
});
// =================================

app.mount("#app");
