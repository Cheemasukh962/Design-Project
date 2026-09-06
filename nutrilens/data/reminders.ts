import { Platform } from 'react-native';

/**
 * The daily reminder, actually delivered.
 *
 * Forgetting is the failure this product exists to survive, and until now the
 * reminder was interface only: the bell toggled, the copy said "Reminder set
 * for 9:00 am", and nothing was ever scheduled. A control that claims to have
 * done something it has not done is worse than no control, because the person
 * stops watching for the thing themselves.
 *
 * WHAT IT ACTUALLY DOES. One repeating local notification a day at
 * REMINDER_HOUR, naming how many items are due. Local, not push — there is no
 * server, nothing leaves the device, and no account is needed.
 *
 * WEB IS A DELIBERATE NO-OP. expo-notifications cannot schedule a repeating
 * local notification in a browser, and this build is reviewed in one. Every
 * function here returns a status so the interface can tell the truth about
 * which case it is in rather than pretending it armed something.
 */

export const REMINDER_HOUR = 9;
export const REMINDER_MINUTE = 0;

/** Stable id, so re-scheduling replaces rather than stacks up duplicates. */
const CHANNEL_ID = 'vitapal-daily';

export type ReminderStatus =
  /** Scheduled with the OS and will fire. */
  | 'scheduled'
  /** Nothing to remind about; any previous schedule was cleared. */
  | 'cleared'
  /** The user said no. The toggle should not claim otherwise. */
  | 'denied'
  /** Browser. State is kept, nothing is delivered. */
  | 'unsupported';

/**
 * Loaded on demand rather than imported at the top.
 *
 * Importing expo-notifications at module scope pulls a native module into the
 * web bundle, where it warns on every load. This route means the browser never
 * touches it at all.
 */
async function load() {
  if (Platform.OS === 'web') return null;
  try {
    return await import('expo-notifications');
  } catch {
    return null;
  }
}

/**
 * Reschedules the daily reminder to match the current routine.
 *
 * Called with the number of items that have a reminder switched on. Zero
 * cancels. Always cancels before scheduling, because the alternative is a new
 * notification for every toggle and a person waking up to six of them.
 */
export async function syncDailyReminder(count: number): Promise<ReminderStatus> {
  const Notifications = await load();
  if (!Notifications) return 'unsupported';

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (count <= 0) return 'cleared';

    const existing = await Notifications.getPermissionsAsync();
    let granted = existing.granted;
    if (!granted && existing.canAskAgain) {
      const asked = await Notifications.requestPermissionsAsync();
      granted = asked.granted;
    }
    if (!granted) return 'denied';

    // Android will not show a notification without a channel.
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Daily routine',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your routine is waiting',
        // No health claim and no guilt. It says what is on the list and stops.
        body:
          count === 1
            ? '1 thing to tick off today.'
            : `${count} things to tick off today.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: REMINDER_HOUR,
        minute: REMINDER_MINUTE,
        channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
      },
    });
    return 'scheduled';
  } catch {
    // Never let a scheduling failure take the screen down with it.
    return 'unsupported';
  }
}
