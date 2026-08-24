import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

/** No PHI in notification payloads — only opaque type codes. */
export type NotificationPayloadType = "checkin_reminder" | "red_flag";

export interface SafeNotificationData {
  type: NotificationPayloadType;
  alertId?: string;
}

export const CHECKIN_REMINDER_CHANNEL_ID = "checkin-reminders";
export const RED_FLAG_CHANNEL_ID = "red-flag-alerts";

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHECKIN_REMINDER_CHANNEL_ID, {
    name: "Daily check-in reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
  });

  await Notifications.setNotificationChannelAsync(RED_FLAG_CHANNEL_ID, {
    name: "Clinical alerts",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500],
  });
}

export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;
  const granted = await ensureNotificationPermissions();
  if (!granted) return null;

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

/**
 * Schedules a daily local reminder. Title/body are localized on-device
 * and never contain symptom or patient details.
 */
export async function scheduleDailyCheckInReminder(input: {
  hour: number;
  minute: number;
  title: string;
  body: string;
}): Promise<string | null> {
  const granted = await ensureNotificationPermissions();
  if (!granted) return null;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: input.title,
      body: input.body,
      data: { type: "checkin_reminder" } satisfies SafeNotificationData,
      sound: true,
      ...(Platform.OS === "android"
        ? { channelId: CHECKIN_REMINDER_CHANNEL_ID }
        : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: input.hour,
      minute: input.minute,
    },
  });

  return id;
}

/** Immediate alert — generic copy only; details shown in-app after unlock. */
export async function triggerRedFlagNotification(input: {
  title: string;
  body: string;
  alertId: string;
}): Promise<void> {
  const granted = await ensureNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: input.title,
      body: input.body,
      data: { type: "red_flag", alertId: input.alertId } satisfies SafeNotificationData,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
      ...(Platform.OS === "android" ? { channelId: RED_FLAG_CHANNEL_ID } : {}),
    },
    trigger: null,
  });
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
