<script setup lang="ts">
import { useNotificationsStore, type NotificationType } from "../stores/notifications";
const { notifications } = useNotificationsStore();

function getNotificationClass(type: NotificationType) {
	switch (type) {
		case "success":
			return "alert-success";
		case "error":
			return "alert-error";
		case "info":
			return "alert-info";
		case "warning":
			return "alert-warning";
		default:
			return "alert-info";
	}
}
</script>

<template>
	<div class="toast toast-top toast-end">
		<div
			class="alert alert-vertical sm:alert-horizontal"
			:class="getNotificationClass(notification.type)"
			v-for="(notification, index) in notifications"
			:key="index"
		>
			<div class="flex flex-col">
				<div v-if="notification.title">
					<h3 class="font-bold">{{ notification.title }}</h3>
					<span class="text-xs">{{ notification.message }}</span>
				</div>
				<div v-else>
					<span>{{ notification.message }}</span>
				</div>
			</div>
			<div>
				<template v-for="action in notification.actions" :key="action.label">
					<a :href="action.target" class="btn btn-link">{{ action.label }}</a>
				</template>
			</div>
		</div>
	</div>
</template>
