import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon, type IconName } from './Icon';

/**
 * `primary`  — filled Aggie Blue.
 * `outline`  — 2px outline-variant border, used as the Results secondary CTA.
 * `tertiary` — text only, used for "Continue as guest" on the splash.
 */
export type ButtonVariant = 'primary' | 'outline' | 'tertiary';
/**
 * `pill` — the splash and Q1 treatment (fully rounded, 16px vertical padding).
 * `rounded` — the Q2 treatment (fixed 52px height, 12px radius).
 * The two mocks genuinely differ; see the note in app/quiz/q1.tsx.
 */
export type ButtonShape = 'pill' | 'rounded';

type Props = {
  /** Button label. Per the PRD copy rules this is a verb ("Take the quiz"). */
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  /** Optional trailing glyph, e.g. the forward arrow on the quiz CTAs. */
  trailingIcon?: IconName;
  disabled?: boolean;
  style?: ViewStyle;
  /** Falls back to `label`; set when the label alone lacks context. */
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  shape = 'pill',
  trailingIcon,
  disabled = false,
  style,
  accessibilityLabel,
}: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        shape === 'pill' ? styles.pill : styles.rounded,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        !isPrimary && !isOutline && styles.tertiary,
        pressed && (isPrimary ? styles.primaryPressed : styles.tertiaryPressed),
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            isPrimary && styles.primaryLabel,
            isOutline && styles.outlineLabel,
            !isPrimary && !isOutline && styles.tertiaryLabel,
          ]}
        >
          {label}
        </Text>
        {trailingIcon && (
          <Icon
            name={trailingIcon}
            size={20}
            color={
              isPrimary
                ? colors.onPrimary
                : isOutline
                  ? colors.onSurfaceVariant
                  : colors.aggieBlue
            }
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    // 16px vertical padding on a 24px line box clears the 44pt touch minimum.
    paddingVertical: spacing.cardPaddingSm,
    borderRadius: radius.full,
  },
  rounded: {
    height: 52,
    borderRadius: radius.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base * 2,
  },
  primary: {
    // Aggie Blue, not the darker generated `primary`. The Q1 and splash mocks
    // used #00142e and Q2 used #022851; the flow is harmonised on brand blue.
    backgroundColor: colors.aggieBlue,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.outlineVariant,
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  primaryPressed: {
    opacity: 0.88,
  },
  tertiaryPressed: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  disabled: {
    opacity: 0.4,
  },
  primaryLabel: {
    ...typography.h3,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  outlineLabel: {
    ...typography.h3,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  tertiaryLabel: {
    ...typography.bodyMd,
    fontFamily: typography.caption.fontFamily, // medium weight, per the mock
    color: colors.aggieBlue,
    textAlign: 'center',
  },
});
