import { StyleSheet, Text, View } from 'react-native';
import { NEUTRAL_ACCENT, colors, radius, spacing, typography, type Accent } from '../../theme';
import { Icon, type IconName } from '../ui/Icon';

type Props = {
  label: string;
  icon: IconName;
  /** Nutrient identity colour. Chips sit on a tinted card, so they go white. */
  accent?: Accent;
};

/**
 * A food-source pill on a result card — a 16px glyph and a word.
 *
 * Deliberately tiny. On Results these are a glance ("oh, eggs and sun"), not a
 * reference; the detail page carries portions and amounts on a much larger
 * card. See components/nutrient/SourceCard.
 */
export function FoodChip({ label, icon, accent = NEUTRAL_ACCENT }: Props) {
  return (
    <View style={styles.chip}>
      <Icon name={icon} size={16} color={accent.text} />
      <Text style={[styles.label, { color: accent.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    paddingHorizontal: spacing.stackSm,
    paddingVertical: spacing.base,
    borderRadius: radius.full,
    // White, because the card behind is already the accent's pale wash.
    backgroundColor: colors.surfaceContainerLowest,
  },
  label: {
    ...typography.caption,
  },
});
