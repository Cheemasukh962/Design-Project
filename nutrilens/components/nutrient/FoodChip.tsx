import { StyleSheet, Text, View } from 'react-native';
import { NEUTRAL_ACCENT, colors, radius, spacing, typography, type Accent } from '../../theme';
import { Icon, type IconName } from '../ui/Icon';

type Props = {
  label: string;
  icon: IconName;
  /**
   * Kept for callers that want a tinted chip. Unused on Results, where the
   * identity colour is carried by the card edge and heading instead — three
   * coloured chips per card on top of that was too much.
   */
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
      <Icon name={icon} size={16} color={colors.onSurfaceVariant} />
      <Text style={styles.label}>{label}</Text>
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
    backgroundColor: colors.surfaceContainer,
  },
  label: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
});
