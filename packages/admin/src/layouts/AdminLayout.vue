<script setup lang="ts">

	import { RouterView } from 'vue-router';
	import { useNotificationsStore } from '../stores/notifications';
	import Toasts from '../components/Toasts.vue';

	const { addNotification } = useNotificationsStore();

</script>

<template>
  <div class="flex flex-col gap-4 p-4">
	<div>
		<button class="btn btn-sm btn-primary" @click="addNotification('success', 'This is a new notification!')">Add Notification</button>
		<button class="btn btn-sm btn-secondary" @click="addNotification('warning', 'This is a new notification!', [{ type: 'link', label: 'Learn more', target: 'https://example.com' }])">Add Action Notification</button>
	</div>
	<div>
		<Toasts />
	</div>
	<RouterView />
  </div>
</template>