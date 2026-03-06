import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Reminder } from "../types";

/**
 * Configure how notifications appear when the app is foregrounded.
 * Call once at app startup (e.g. in root _layout.tsx).
 */
export function initNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("plant-care", {
      name: "Plant Care Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

/**
 * Request notification permissions from the user.
 * Returns true if granted.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return status === "granted";
}

/**
 * Build a notification identifier for a reminder so we can cancel it later.
 */
function notificationId(reminderId: string): string {
  return `reminder-${reminderId}`;
}

/**
 * Schedule a repeating local notification for a care reminder.
 * Returns the notification identifier.
 */
export async function scheduleReminderNotification(
  reminder: Reminder,
  plantNickname: string
): Promise<string> {
  const careLabels: Record<string, string> = {
    water: "water",
    fertilize: "fertilize",
    rotate: "rotate",
    prune: "prune",
  };
  const action = careLabels[reminder.careType] ?? reminder.careType;

  // Cancel any existing notification for this reminder first
  await cancelReminderNotification(reminder.id);

  const identifier = await Notifications.scheduleNotificationAsync({
    identifier: notificationId(reminder.id),
    content: {
      title: `Time to ${action} ${plantNickname}!`,
      body:
        reminder.careType === "water"
          ? `Your ${plantNickname} needs watering every ${reminder.frequencyDays} days.`
          : `Scheduled ${action} reminder for ${plantNickname}.`,
      ...(Platform.OS === "android" ? { channelId: "plant-care" } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: reminder.frequencyDays * 24 * 60 * 60,
      repeats: true,
    },
  });

  return identifier;
}

/**
 * Cancel a previously scheduled notification for a reminder.
 */
export async function cancelReminderNotification(
  reminderId: string
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    notificationId(reminderId)
  );
}

/**
 * Cancel all scheduled notifications (e.g. on logout).
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
