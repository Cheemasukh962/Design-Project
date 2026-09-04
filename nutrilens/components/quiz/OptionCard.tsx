import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * Single-select answer row (Q1, Q3–Q5). Full width, with a round radio marker.
 *
 * The round marker is deliberate: it is the affordance that says "one of
 * these". Multi-select uses a square checkbox (see OptionTile). Mixing the two
 * without a visual difference is the most common quiz-flow usability failure,
 * so the shapes must stay distinct.
 */
export function OptionCard({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : styles.cardIdle,
        pressed && !selected && styles.cardPressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>

      <View style={[styles.marker, selected && styles.markerSelected]}>
        {selected && <Icon name="check" size={14} color={colors.onPrimary} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
  },
  cardIdle: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(196,198,208,0.6)',
    shadowColor: '#00142e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: 'rgba(2,40,81,0.5)',
  },
  cardSelected: {
    backgroundColor: '#EEF4FA',
    borderWidth: 2,
    borderColor: colors.aggieBlue,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    ...typography.h3,
    color: colors.onSurface,
    flexShrink: 1,
    paddingRight: spacing.stackMd,
  },
  labelSelected: {
    color: colors.aggieBlue,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: 'rgba(196,198,208,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerSelected: {
    borderColor: colors.aggieBlue,
    backgroundColor: colors.aggieBlue,
  },
});
