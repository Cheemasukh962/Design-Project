import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export type RoutineFilter = 'all' | 'supplement' | 'food' | 'habit';

type Option = { id: RoutineFilter; label: string };

type Props = {
  value: RoutineFilter;
  onChange: (next: RoutineFilter) => void;
  /** Count shown on the "All" pill — derived, never typed. */
  total: number;
};

const OPTIONS: Option[] = [
  { id: 'all', label: 'All' },
  { id: 'supplement', label: 'Supplements' },
  { id: 'food', label: 'Food sources' },
  { id: 'habit', label: 'Habits' },
];

/**
 * Category filter for the checklist.
 *
 * Only the "All" pill carries a count. Putting one on every pill would make an
 * empty category read as a failure ("Habits (0)") rather than as a category the
 * user simply has not used.
 */
export function FilterPills({ value, onChange, total }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {OPTIONS.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => [
              styles.pill,
              active ? styles.pillActive : styles.pillIdle,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.id === 'all' ? `${option.label} (${total})` : option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.stackSm,
    paddingVertical: spacing.base,
  },
  pill: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillIdle: {
    backgroundColor: colors.surfaceContainerLow,
  },
  pressed: { opacity: 0.85 },
  label: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  labelActive: {
    fontFamily: typography.micro.fontFamily,
    color: colors.onPrimary,
  },
});
