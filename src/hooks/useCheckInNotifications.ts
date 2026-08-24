import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  cancelAllReminders,
  configureNotificationHandler,
  ensureNotificationPermissions,
  scheduleDailyCheckInReminder,
  setupNotificationChannels,
} from "@/lib/notifications/checkInNotifications";

const REMINDER_TIME_KEY = "protokol.checkin_reminder_time";

export interface ReminderTime {
  hour: number;
  minute: number;
}

const DEFAULT_REMINDER: ReminderTime = { hour: 9, minute: 0 };

export function useCheckInNotifications() {
  const { t } = useTranslation();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [reminderTime, setReminderTimeState] = useState<ReminderTime>(DEFAULT_REMINDER);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    configureNotificationHandler();
    void setupNotificationChannels();
    void AsyncStorage.getItem(REMINDER_TIME_KEY).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as ReminderTime;
        if (typeof parsed.hour === "number" && typeof parsed.minute === "number") {
          setReminderTimeState(parsed);
        }
      } catch {
        /* ignore */
      }
    });
  }, []);

  const refreshPermission = useCallback(async () => {
    const granted = await ensureNotificationPermissions();
    setPermissionGranted(granted);
    return granted;
  }, []);

  const scheduleReminder = useCallback(
    async (time: ReminderTime = reminderTime) => {
      const granted = await refreshPermission();
      if (!granted) return null;

      const id = await scheduleDailyCheckInReminder({
        hour: time.hour,
        minute: time.minute,
        title: t("notifications.reminder.title"),
        body: t("notifications.reminder.body"),
      });

      setScheduled(Boolean(id));
      await AsyncStorage.setItem(REMINDER_TIME_KEY, JSON.stringify(time));
      setReminderTimeState(time);
      return id;
    },
    [refreshPermission, reminderTime, t],
  );

  const disableReminders = useCallback(async () => {
    await cancelAllReminders();
    setScheduled(false);
  }, []);

  return {
    permissionGranted,
    reminderTime,
    scheduled,
    refreshPermission,
    scheduleReminder,
    disableReminders,
    setReminderTime: setReminderTimeState,
  };
}
