import { defineStore } from "pinia";

/**
 * Notification duration in milliseconds. Notifications will automatically disappear after this time.
 */
const noficationDuration = 5000;

export type NotificationType = "success" | "error" | "info" | "warning";
export type NotificationActionType = "link";
export type NotificationAction = {
	type: NotificationActionType;
	label: string;
	target: string;
};

export interface Notification {
	id: number;
	type: NotificationType;
	title?: string;
	message: string;
	actions?: NotificationAction[];
}

export const useNotificationsStore = defineStore("notifications", {
	state: () => ({
		notifications: [] as Notification[],
		archivedNotifications: [] as Notification[],
	}),
	actions: {
		addNotification(notificationOptions: Omit<Notification, "id">) {
			const id = Date.now();
			const notification = { id, ...notificationOptions };
			this.notifications.push(notification);
			setTimeout(() => {
				this.removeNotification(id);
			}, noficationDuration);
		},
		removeNotification(id: number) {
			const index = this.notifications.findIndex((n) => n.id === id);
			if (index !== -1) {
				const [removed] = this.notifications.splice(index, 1);
				if (removed) {
					this.archivedNotifications.push(removed);
				}
			}
		},
	},
});
