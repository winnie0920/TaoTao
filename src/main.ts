import "@/assets/css/style.css";
import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon.vue";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("svg-icon", SvgIcon);

app.mount("#app");
