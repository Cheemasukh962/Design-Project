import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  /** 0 = Monday. */
  todayIndex: number;
  completedDays?: number[];
};

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * The seven-day consistency row inside the weekly card.
 *
 * A day that has not happened yet is a dash, not an empty box and not a cross.
 * The distinction matters over repeat visits: Friday being blank on a Thursday
 * is not a miss, and a UI that renders it like one is quietly lying about how
 * the user is doing.
 */
export function ConsistencyMatrix({ todayIndex, completedDays = [] }: Props) {
  return (
    <View style={styles.row}>
      {LABELS.map((label, i) => {
        const isToday = i === todayIndex;
        const isDone = completedDays.includes(i);
        const isFuture = i > todayIndex;

        return (
          <View key={`${label}-${i}`} style={styles.cell}>
            <View
              style={[
                styles.tile,
                isDone && styles.tileDone,
                isToday && styles.tileToday,
                isFuture && styles.tileFuture,
              ]}
            >
              {isToday ? (
                <Icon name="bolt" size={18} color={colors.onSecondaryContainer} />
              ) : isDone ? (
                <Icon name="check" size={16} color={colors.onPrimary} />
              ) : (
                <Icon name="remove" size={14} color={colors.outlineVariant} />
              )}
            </View>
            <Text style={[styles.label, isToday && styles.labelToday]}>
              {isToday ? 'Today' : label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.stackSm,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.base,
  },
  tile: {
    width: 32,
    height: 32,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  tileDone: {
    backgroundColor: colors.primary,
  },
  tileToday: {
    backgroundColor: colors.secondaryContainer,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  tileFuture: {
    backgroundColor: colors.surfaceContainer,
  },
  label: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.outline,
  },
  labelToday: {
    color: colors.primary,
  },
});
