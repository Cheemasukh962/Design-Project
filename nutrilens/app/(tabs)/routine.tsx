import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilterPills, type RoutineFilter } from '../../components/routine/FilterPills';
import { ProgressRing } from '../../components/routine/ProgressRing';
import { RoutineItemRow } from '../../components/routine/RoutineItemRow';
import { AddNutrientSheet } from '../../components/routine/AddNutrientSheet';
import { CheckInPal } from '../../components/routine/CheckInPal';
import { WeekCalendar } from '../../components/routine/WeekCalendar';
import { Badge } from '../../components/ui/Badge';
import { BrandBar } from '../../components/ui/BrandBar';
import { Icon } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { ROUTINE_TIP } from '../../data/progress';
import { useRoutine } from '../../data/RoutineContext';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Routine tracker.
 *
 * Source: Stitch "NutriLens - Routine Tracker".
 *
 * The mock hardcodes "Today, Oct 24", a 5-day streak, "3 of 4 completed" and a
 * filled-in week. Only the streak and the completed week survive as constants —
 * both flagged in data/progress.ts — because they need history the app does not
 * keep. The date and every count are derived, so nothing on this screen can be
 * wrong the day after the demo.
 */

/** Monday-first index for a JS day number (0 = Sunday). */
function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

/** The seven date numbers of the week containing `today`, Monday first. */
function weekDates(today: Date): number[] {
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayIndex(today.getDay()));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });
}

/** The seven Date objects of the current week, Monday first. */
function weekDateObjects(today: Date): Date[] {
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayIndex(today.getDay()));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/** Local calendar day as YYYY-MM-DD, matching the keys the store writes. */
function isoDay(d: Date): string {
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
}

export default function RoutineRoute() {
  const {
    items,
    done,
    toggleDone,
    reminders,
    reminderTime,
    reminderStatus,
    toggleReminder,
    removeItem,
    remindAll,
    history,
    streak,
  } = useRoutine();
  const [adding, setAdding] = useState(false);

  const today = useMemo(() => new Date(), []);
  const todayIndex = mondayIndex(today.getDay());
  const dates = useMemo(() => weekDates(today), [today]);
  const dateLabel = today.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const doneCount = items.filter((i) => done.includes(i.id)).length;

  // Which days of this week actually had something ticked. Was an invented
  // constant; it is the stored history now, so an empty week looks empty.
  const completedDays = useMemo(
    () =>
      weekDateObjects(today)
        .map((d, i) => (history[isoDay(d)] > 0 ? i : -1))
        .filter((i) => i >= 0),
    [today, history],
  );
  const remaining = items.length - doneCount;
  const allRemind = items.length > 0 && reminders.length === items.length;

  return (
    <Screen>
      <BrandBar />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* ---- Date and streak ---- */}
        <View style={styles.dateRow}>
          <Text style={styles.date}>Today, {dateLabel}</Text>
          {streak > 0 && (
            <Badge
              tone="gold"
              icon="local-fire-department"
              label={`${streak}-day streak`}
            />
          )}
        </View>
        <Text style={styles.title} accessibilityRole="header">
          My Daily Routine
        </Text>

        <View style={styles.block}>
          <WeekCalendar
            todayIndex={todayIndex}
            dates={dates}
            completedDays={completedDays}
          />
        </View>

        {/* ---- Daily progress ---- */}
        <View style={[styles.block, styles.heroCard]}>
          <View style={styles.heroRow}>
            <View style={styles.heroText}>
              <Badge tone="gold" label="Daily target" eyebrow />
              <Text style={styles.heroTitle}>
                {items.length === 0
                  ? 'Nothing scheduled'
                  : `${doneCount} of ${items.length} completed`}
              </Text>
              <Text style={styles.heroBody}>
                {items.length === 0
                  ? 'Add a nutrient from your results and it shows up here.'
                  : remaining === 0
                    ? "That's everything for today."
                    : `${remaining} left to close today's ring.`}
              </Text>
            </View>

            <ProgressRing done={doneCount} total={items.length} />
          </View>

          {/* Mascot tip — see the conflict note on ROUTINE_TIP. */}
          <View style={styles.tipRow}>
            <View style={styles.tipGlyph}>
              <Icon name="verified" size={14} color={colors.secondaryFixed} />
            </View>
            <Text style={styles.tipText}>
              <Text style={styles.tipAttribution}>{ROUTINE_TIP.attribution} </Text>
              {ROUTINE_TIP.body}
            </Text>
          </View>
        </View>

        {/* ---- Reminders ----
            Forgetting is the failure this screen exists to prevent, so the
            control sits above the list instead of inside a settings page. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            allRemind
              ? `Daily reminders on for all ${items.length} items at ${reminderTime}`
              : 'Turn on a daily reminder for everything'
          }
          onPress={remindAll}
          disabled={items.length === 0 || allRemind}
          style={({ pressed }) => [
            styles.notify,
            allRemind && styles.notifyOn,
            pressed && { opacity: 0.9 },
            items.length === 0 && { opacity: 0.45 },
          ]}
        >
          <Icon
            name={reminders.length > 0 ? 'notifications-active' : 'notifications-none'}
            size={22}
            color={allRemind ? colors.onPrimary : colors.aggieBlue}
          />
          <View style={styles.notifyText}>
            <Text style={[styles.notifyTitle, allRemind && { color: colors.onPrimary }]}>
              {reminders.length === 0
                ? 'Remind me daily'
                : allRemind
                  ? `All set for ${reminderTime}`
                  : `${reminders.length} of ${items.length} have reminders`}
            </Text>
            <Text style={[styles.notifySub, allRemind && { color: colors.primaryFixed }]}>
              {/* Says what actually happened. A bar that reads "all set" while
                  nothing is scheduled teaches someone to stop watching for the
                  thing themselves, which is the exact failure this control
                  exists to prevent. */}
              {reminderStatus === 'unsupported' && reminders.length > 0
                ? 'Saved. Notifications only arrive on a phone, not in a browser.'
                : reminderStatus === 'denied'
                  ? 'Notifications are blocked. Turn them on in your phone settings.'
                  : allRemind
                    ? 'Tap a bell on any item to turn that one off'
                    : `One nudge at ${reminderTime}, so you do not have to remember`}
            </Text>
          </View>
        </Pressable>

        {/* The pal sits directly above the checklist, so the consequence of a
            tick is visible from the thing you tapped. */}
        <View style={styles.block}>
          <CheckInPal />
        </View>

        {/* ---- Checklist ---- */}

        <View style={styles.list}>
          {items.length > 0 ? (
            items.map((item) => (
              <RoutineItemRow
                key={item.id}
                item={item}
                done={done.includes(item.id)}
                onToggle={() => toggleDone(item.id)}
                reminderOn={reminders.includes(item.id)}
                onToggleReminder={() => toggleReminder(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))
          ) : (
            <Text style={styles.empty}>
              Nothing here yet. Add something below, or take the quiz and add
              what comes back.
            </Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add item to daily routine"
          onPress={() => setAdding(true)}
          style={({ pressed }) => [styles.addRow, pressed && styles.addPressed]}
        >
          <Icon name="add-circle" size={20} color={colors.primary} />
          <Text style={styles.addLabel}>Add item to daily routine</Text>
        </Pressable>

      </ScrollView>

      <AddNutrientSheet visible={adding} onClose={() => setAdding(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: spacing.stackSm,
    paddingBottom: spacing.stackLg,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  date: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
    color: colors.outline,
  },
  title: {
    ...typography.h1Mobile,
    color: colors.primary,
  },
  block: {
    marginTop: spacing.stackMd,
  },
  heroCard: {
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    shadowColor: '#435f8b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.stackMd,
  },
  heroText: {
    flex: 1,
    gap: spacing.base,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  heroBody: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginTop: spacing.stackMd,
    paddingTop: spacing.base * 3,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
  },
  tipGlyph: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.aggieBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  tipAttribution: {
    color: colors.primary,
  },
  notify: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    marginTop: spacing.stackMd,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: colors.aggieBlue,
  },
  notifyOn: {
    backgroundColor: colors.aggieBlue,
    borderColor: colors.aggieBlue,
  },
  notifyText: { flex: 1 },
  notifyTitle: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    fontSize: 15,
    color: colors.aggieBlue,
  },
  notifySub: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  list: {
    gap: 10,
    marginTop: spacing.stackSm,
  },
  empty: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    paddingVertical: spacing.stackMd,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    minHeight: 48,
    marginTop: spacing.stackMd,
    padding: spacing.base * 3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  addPressed: { backgroundColor: colors.surfaceContainerLow },
  addLabel: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
    color: colors.primary,
  },
  weekCard: {
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.base * 3,
    shadowColor: '#435f8b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  weekHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.stackMd,
  },
  weekText: { flex: 1, gap: 2 },
  eyebrow: {
    ...typography.micro,
    textTransform: 'uppercase',
    color: colors.outline,
  },
  weekTitle: {
    ...typography.h3,
    color: colors.primary,
  },
  weekBody: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  shield: {
    padding: spacing.stackSm,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,223,160,0.4)',
  },
});
