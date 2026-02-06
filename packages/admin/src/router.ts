import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router";

import AdminLayout from "./layouts/AdminLayout.vue";
import Dashboard from "./views/Dashboard.vue";
import Settings from "./views/Settings.vue";

const routes: RouteRecordRaw[] = [
	{ path: "/", component: AdminLayout, children: [
		{ path: "/", component: Dashboard },
		{ path: "/settings", component: Settings },
	]},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
