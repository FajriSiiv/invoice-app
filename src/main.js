import "./assets/main.css";

import router from "./router";
import { createApp } from "vue";
import App from "./App.vue";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as FaIcons from "oh-vue-icons/icons/fa";
import * as LaIcons from "oh-vue-icons/icons/la";
import * as IoIcons from "oh-vue-icons/icons/io";
import * as HeroIcons from "oh-vue-icons/icons/hi";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// import setupElementPlus from "./plugins/element-plus";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap";

const Fa = Object.values(FaIcons);
const La = Object.values(LaIcons);
const Io = Object.values(IoIcons);
const Hi = Object.values(HeroIcons);
addIcons(...Fa);
addIcons(...La);
addIcons(...Io);
addIcons(...Hi);

const app = createApp(App);
// setupElementPlus(app);
app.component("v-icon", OhVueIcon);
app.use(Vue3Toastify);
app.use(router);
app.mount("#app");
