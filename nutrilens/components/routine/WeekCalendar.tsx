import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  /** 0 = Monday. */
  todayIndex: number;
  /** Date number for each column, Monday first. */
  dates: number[];
  /**
   * Indices of days actually completed. Defaults to none.
   *
   * It would look better to fill in the days before today, and that is exactly
   * why it is a prop: a tick the user never earned is invented history. The
   * demo passes WEEK_COMPLETED from data/progress.ts, which is flagged there.
   */
  completedDays?: number[];
};

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * The week strip on the routine tracker.
 *
 * A missed day is a hollow date and nothing else — no red, no "you lost your
 * streak", no recovery prompt. Streak mechanics that punish are how wellness
 * apps manufacture guilt, and guilt is the opposite of what this audience
 * needs. Progress is shown; absence is simply not shown.
 */
export function WeekCalendar({ todayIndex, dates, completedDays = [] }: Props) {
  return (
    <View style={styles.card} accessibilityLabel="This week">
      {LABELS.map((label, i) => {
        const isToday = i === todayIndex;
        const isDone = completedDays.includes(i);

        return (
          <View key={`${label}-${i}`} style={[styles.cell, isToday && styles.cellToday]}>
            <Text style={[styles.label, isToday && styles.labelToday]}>{label}</Text>

            <View
              style={[
                styles.disc,
                isDone && styles.discDone,
                isToday && styles.discToday,
              ]}
            >
              {isDone && !isToday ? (
                <Icon name="check" size={16} color={colors.primary} />
              ) : (
                <Text style={[styles.date, isToday && styles.dateToday]}>
                  {dates[i]}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: spacing.stackSm,
    gap: spacing.base,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#435f8b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.base,
    paddingVertical: spacing.stackSm,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
  },
  cellToday: {
    backgroundColor: colors.aggieBlue,
  },
  label: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.outline,
  },
  labelToday: {
    color: colors.onPrimaryContainer,
  },
  disc: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discDone: {
    backgroundColor: colors.surfaceContainer,
  },
  discToday: {
    backgroundColor: colors.secondaryContainer,
  },
  date: {
    ...typography.caption,
    color: colors.outlineVariant,
  },
  dateToday: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
    color: colors.onSecondaryContainer,
  },
});
