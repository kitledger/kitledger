<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
import { useNotificationsStore } from "../stores/notifications";
import Toasts from "../components/Toasts.vue";
import type { Component } from "vue";
import {
	Bell,
	Search,
	Settings,
	LogOut,
	LayoutGrid,
	ChevronDown,
	Box,
	FileText,
	CreditCard,
	Upload,
	Users,
	ShieldAlert,
	Key,
} from "lucide-vue-next";

const { addNotification } = useNotificationsStore();

// --- Types ---

type MenuItemType = "link" | "divider" | "parent";

interface MenuItem {
	id: string;
	type: MenuItemType;
	label?: string;
	icon?: Component;
	to?: string; // For vue-router
	href?: string; // For external links
	action?: () => void; // For click handlers
	children?: MenuItem[];
	badge?: string; // e.g. "New"
	class?: string; // specific styling (e.g. text-error)
}

// --- Data Configuration ---

const mainNavItems: MenuItem[] = [
	{
		id: "accounting",
		type: "parent",
		label: "Accounting",
		children: [
			{ id: "ledgers", type: "link", label: "Ledgers", icon: FileText, to: "/ledgers" },
			{ id: "transactions", type: "link", label: "Transactions", icon: Box, to: "/transactions" },
			{ id: "div-1", type: "divider" },
			{
				id: "reconcil",
				type: "parent",
				label: "Reconciliation",
				children: [
					{ id: "bank-feeds", type: "link", label: "Bank Feeds", icon: CreditCard, to: "/bank-feeds" },
					{ id: "manual", type: "link", label: "Manual Upload", icon: Upload, to: "/upload" },
				],
			},
		],
	},
	{
		id: "system",
		type: "parent",
		label: "System",
		children: [
			{ id: "users", type: "link", label: "User Management", icon: Users, to: "/users" },
			{ id: "audit", type: "link", label: "Audit Logs", icon: ShieldAlert, to: "/audit" },
			{ id: "api", type: "link", label: "API Keys", icon: Key, to: "/api-keys" },
		],
	},
];

const userMenuActions: MenuItem[] = [
	{
		id: "profile",
		type: "link",
		label: "Profile",
		badge: "New",
		to: "/profile",
	},
	{
		id: "settings",
		type: "link",
		label: "Settings",
		icon: Settings,
		to: "/settings",
	},
	{ id: "div-user", type: "divider" },
	{
		id: "logout",
		type: "link",
		label: "Logout",
		icon: LogOut,
		class: "text-error",
		action: () => console.log("Logout clicked"),
	},
];
</script>

<template>
	<div class="min-h-screen bg-base-100 flex flex-col font-sans text-base-content">
		<nav class="navbar bg-base-100 border-b border-base-200 min-h-12 h-12 px-3 z-50 sticky top-0">
			<div class="navbar-start w-auto lg:w-1/2">
				<div class="mr-4 flex items-center gap-2">
					<div class="size-8 bg-primary text-primary-content rounded flex items-center justify-center">
						<LayoutGrid :size="18" />
					</div>
					<span class="font-bold text-lg hidden sm:block">Kitledger</span>
				</div>

				<ul class="menu menu-horizontal px-1 gap-1 hidden lg:flex">
					<li v-for="item in mainNavItems" :key="item.id">
						<details v-if="item.type === 'parent'" name="main-nav">
							<summary class="font-medium text-xs uppercase tracking-wide opacity-75 hover:opacity-100">
								{{ item.label }}
							</summary>
							<ul class="p-2 bg-base-100 border border-base-200 rounded-box shadow-xl w-52 z-50">
								<li v-for="child in item.children" :key="child.id">
									<details v-if="child.type === 'parent'" name="sub-nav">
										<summary>
											<component :is="child.icon" v-if="child.icon" :size="14" />
											{{ child.label }}
										</summary>
										<ul>
											<li v-for="grandChild in child.children" :key="grandChild.id">
												<router-link v-if="grandChild.to" :to="grandChild.to">
													<component
														:is="grandChild.icon"
														v-if="grandChild.icon"
														:size="14"
													/>
													{{ grandChild.label }}
												</router-link>
												<a v-else :href="grandChild.href">
													<component
														:is="grandChild.icon"
														v-if="grandChild.icon"
														:size="14"
													/>
													{{ grandChild.label }}
												</a>
											</li>
										</ul>
									</details>

									<router-link
										v-else-if="child.type === 'link' && child.to"
										:to="child.to"
										:class="child.class"
									>
										<component :is="child.icon" v-if="child.icon" :size="14" />
										{{ child.label }}
										<span v-if="child.badge" class="badge badge-xs badge-soft">{{
											child.badge
										}}</span>
									</router-link>

									<a v-else-if="child.type === 'link'" :href="child.href" :class="child.class">
										<component :is="child.icon" v-if="child.icon" :size="14" />
										{{ child.label }}
									</a>

									<div v-else-if="child.type === 'divider'" class="divider my-1"></div>
								</li>
							</ul>
						</details>

						<router-link v-else-if="item.to" :to="item.to">
							<component :is="item.icon" v-if="item.icon" :size="14" />
							{{ item.label }}
						</router-link>
					</li>
				</ul>
			</div>

			<div class="navbar-end w-auto lg:w-1/2 flex-1 gap-1">
				<div class="tooltip tooltip-bottom" data-tip="Search (Cmd+K)">
					<button class="btn btn-ghost btn-circle btn-sm">
						<Search :size="16" />
					</button>
				</div>

				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm">
						<div class="indicator">
							<Bell :size="16" />
							<span class="badge badge-xs badge-primary indicator-item border-base-100"></span>
						</div>
					</div>
					<div
						tabindex="0"
						class="dropdown-content card card-compact w-64 p-2 shadow-xl bg-base-100 border border-base-200 mt-3 z-1"
					>
						<div class="card-body">
							<h3 class="font-bold text-sm">Notifications</h3>
							<p class="text-xs opacity-60">You have 1 unread message</p>
						</div>
					</div>
				</div>

				<div class="divider divider-horizontal mx-1 h-6 self-center"></div>

				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn btn-ghost btn-sm px-1 gap-2 font-normal">
						<div class="avatar placeholder">
							<div class="bg-neutral text-neutral-content rounded-full w-6">
								<span class="text-xs">U</span>
							</div>
						</div>
						<span class="hidden md:inline text-xs">Admin</span>
						<ChevronDown :size="12" class="opacity-50" />
					</div>

					<ul
						tabindex="0"
						class="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow-xl bg-base-100 border border-base-200 rounded-box w-52"
					>
						<template v-for="item in userMenuActions" :key="item.id">
							<li v-if="item.type === 'link'">
								<router-link v-if="item.to" :to="item.to" :class="item.class" @click="item.action">
									<component :is="item.icon" v-if="item.icon" :size="14" />
									{{ item.label }}
									<span v-if="item.badge" class="badge badge-soft badge-sm ml-auto">{{
										item.badge
									}}</span>
								</router-link>
								<a v-else :class="item.class" @click="item.action">
									<component :is="item.icon" v-if="item.icon" :size="14" />
									{{ item.label }}
								</a>
							</li>

							<div v-else-if="item.type === 'divider'" class="divider my-0"></div>
						</template>
					</ul>
				</div>
			</div>
		</nav>

		<div class="bg-base-200/50 border-b border-base-200 px-4 py-2 flex items-center gap-4">
			<span class="text-[10px] font-bold uppercase tracking-wider opacity-40">Dev Tools</span>
			<div class="flex gap-2">
				<button
					class="btn btn-xs btn-primary btn-soft"
					@click="addNotification({ type: 'success', message: 'Record saved' })"
				>
					Test Success
				</button>
				<button
					class="btn btn-xs btn-warning btn-soft"
					@click="addNotification({ title: 'Alert', type: 'warning', message: 'Connection interrupted' })"
				>
					Test Warning
				</button>
			</div>
		</div>

		<main class="flex-1 relative flex flex-col">
			<div class="toast toast-top toast-end z-100 mt-12 mr-2">
				<Toasts />
			</div>
			<RouterView />
		</main>
	</div>
</template>
