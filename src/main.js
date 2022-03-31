import { createApp } from "vue";
import App from "./App.vue";
import TagLinkageBase from "@/components/tag-linkage-base";

let app = createApp(App);

app.component("tag-linkage-base", TagLinkageBase);

app.mount("#app");
