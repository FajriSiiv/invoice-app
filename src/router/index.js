import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import EditModal from "@/components/Home/EditModal.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/:id", name: "edit", component: EditModal },
  ],
});

export default router;
