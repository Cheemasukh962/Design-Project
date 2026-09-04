import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  onPress: () => void;
  label?: string;
  /**
   * Whether this card is currently the chosen answer.
   *
   * Q2 uses this card as a way out ("I'm not sure" advances the question), so
   * it is never selected there. Q5 uses it as a real, mutually exclusive answer
   * — "Nothing in particular" — and without a selected state, picking it looked
   * like nothing had happened while the Continue button silently enabled.
   */
  selected?: boolean;
};

/**
 * "I'm not sure" — an answer, not a skip.
 *
 * The distinction matters: a skip leaves the model with nothing, while an
 * explicit uncertainty answer is a signal we can reason from. It is styled
 * lighter (dashed border, secondary text) so it does not compete with the real
 * options, but it is still a full-width, tappable choice.
 */
export function NotSureCard({
  onPress,
  label = "I'm not sure",
  selected = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole={selected === undefined ? 'button' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && !selected && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <Icon
          name={selected ? 'check-circle' : 'help-outline'}
          size={20}
          color={selected ? colors.aggieBlue : colors.onSurfaceVariant}
        />
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </View>
      <Icon
        name="arrow-forward-ios"
        size={16}
        color={selected ? colors.aggieBlue : colors.outline}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: spacing.cardPaddingSm,
    paddingVertical: spacing.base * 3,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  pressed: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  cardSelected: {
    // Solid border, not dashed: once chosen it is an answer like any other.
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.aggieBlue,
    backgroundColor: colors.tintBlue,
  },
  labelSelected: {
    color: colors.aggieBlue,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    ...typography.bodyMd,
    fontFamily: typography.caption.fontFamily,
    color: colors.onSurfaceVariant,
  },
});
