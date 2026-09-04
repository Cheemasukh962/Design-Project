import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ConsistencyMatrix } from '../../components/routine/ConsistencyMatrix';
import { FilterPills, type RoutineFilter } from '../../components/routine/FilterPills';
import { ProgressRing } from '../../components/routine/ProgressRing';
import { RoutineItemRow } from '../../components/routine/RoutineItemRow';
import { WeekCalendar } from '../../components/routine/WeekCalendar';
import { Badge } from '../../components/ui/Badge';
import { BrandBar } from '../../components/ui/BrandBar';
import { Icon } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { ROUTINE_TIP, STREAK_DAYS, WEEK_COMPLETED } from '../../data/progress';
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

export default function RoutineRoute() {
  const { items, done, toggleDone } = useRoutine();
  const [filter, setFilter] = useState<RoutineFilter>('all');

  const today = useMemo(() => new Date(), []);
  const todayIndex = mondayIndex(today.getDay());
  const dates = useMemo(() => weekDates(today), [today]);
  const dateLabel = today.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const visible = filter === 'all' ? items : items.filter((i) => i.type === filter);
  const doneCount = items.filter((i) => done.includes(i.id)).length;
  const remaining = items.length - doneCount;

  return (
    <Screen>
      <BrandBar mark="glyph" />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* ---- Date and streak ---- */}
        <View style={styles.dateRow}>
          <Text style={styles.date}>Today, {dateLabel}</Text>
          <Badge
            tone="gold"
            icon="local-fire-department"
            label={`${STREAK_DAYS}-day streak`}
          />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          My Daily Routine
        </Text>

        <View style={styles.block}>
          <WeekCalendar
            todayIndex={todayIndex}
            dates={dates}
            completedDays={WEEK_COMPLETED}
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

        {/* ---- Checklist ---- */}
        <View style={styles.block}>
          <FilterPills value={filter} onChange={setFilter} total={items.length} />
        </View>

        <View style={styles.list}>
          {visible.length > 0 ? (
            visible.map((item) => (
              <RoutineItemRow
                key={item.id}
                item={item}
                done={done.includes(item.id)}
                onToggle={() => toggleDone(item.id)}
              />
            ))
          ) : (
            <Text style={styles.empty}>
              {items.length === 0
                ? 'Your routine is empty. Take the quiz and add what comes back.'
                : 'Nothing in this category yet.'}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add item to daily routine"
          style={({ pressed }) => [styles.addRow, pressed && styles.addPressed]}
        >
          <Icon name="add-circle" size={20} color={colors.primary} />
          <Text style={styles.addLabel}>Add item to daily routine</Text>
        </Pressable>

        {/* ---- Weekly focus ---- */}
        <View style={[styles.block, styles.weekCard]}>
          <View style={styles.weekHead}>
            <View style={styles.weekText}>
              <Text style={styles.eyebrow}>This week&apos;s focus</Text>
              <Text style={styles.weekTitle}>Bone &amp; immune strength</Text>
              <Text style={styles.weekBody}>
                {WEEK_COMPLETED.length}/7 days logged
              </Text>
            </View>
            <View style={styles.shield}>
              <Icon name="shield" size={20} color={colors.secondary} />
            </View>
          </View>

          <ConsistencyMatrix todayIndex={todayIndex} completedDays={WEEK_COMPLETED} />
        </View>
      </ScrollView>
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
