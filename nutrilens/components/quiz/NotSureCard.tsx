import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  onPress: () => void;
  label?: string;
};

/**
 * "I'm not sure" — an answer, not a skip.
 *
 * The distinction matters: a skip leaves the model with nothing, while an
 * explicit uncertainty answer is a signal we can reason from. It is styled
 * lighter (dashed border, secondary text) so it does not compete with the real
 * options, but it is still a full-width, tappable choice.
 */
export function NotSureCard({ onPress, label = "I'm not sure" }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Icon name="help-outline" size={20} color={colors.onSurfaceVariant} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Icon name="arrow-forward-ios" size={16} color={colors.outline} />
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
