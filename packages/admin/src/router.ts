import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router";

import Dashboard from "./views/Dashboard.vue";
import Settings from "./views/Settings.vue";

const routes: RouteRecordRaw[] = [
	{ path: "/", component: Dashboard },
	{ path: "/settings", component: Settings },
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
