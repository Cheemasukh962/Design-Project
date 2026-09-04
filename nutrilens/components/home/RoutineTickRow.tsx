import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  title: string;
  detail: string;
  done: boolean;
  onToggle: () => void;
};

/**
 * A routine line on Home. Flat rows inside the card, not the boxed rows the
 * Routine tab uses — the tracker is where an item can be edited, and Home is
 * only for ticking one off.
 *
 * The whole row is the target, not just the 24px circle, so the tap works at
 * arm's length. That is the PRD's one hard requirement for this screen: the
 * commonest daily action must be one tap from a cold open.
 */
export function RoutineTickRow({ title, detail, done, onToggle }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${title}. ${detail}`}
      onPress={onToggle}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.circle, done && styles.circleDone]}>
        {done && <Icon name="check" size={16} color={colors.onPrimary} />}
      </View>

      <View style={styles.text}>
        <Text style={[styles.title, done && styles.muted]}>{title}</Text>
        <Text style={[styles.detail, done && styles.muted]}>{detail}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    minHeight: 44,
  },
  pressed: { opacity: 0.7 },
  circle: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.hairlineBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    // The one green in the product, and it marks a completed action rather
    // than a nutrition state — which is what keeps it clear of the guardrail.
    backgroundColor: colors.checkGreen,
    borderColor: colors.checkGreen,
  },
  text: { flex: 1 },
  title: {
    ...typography.bodyMd,
    fontFamily: typography.micro.fontFamily,
    fontSize: 15,
    lineHeight: 20,
    color: colors.onBackground,
  },
  detail: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  muted: {
    color: colors.outline,
    fontFamily: typography.bodyMd.fontFamily,
  },
});
