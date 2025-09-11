// import { createWebHistory, createRouter } from "vue-router";
import { createWebHistory, createRouter } from "vue-router";
import About from "@/views/CompaniesView.vue";
import DashboardView from "@/views/DashboardView.vue";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
