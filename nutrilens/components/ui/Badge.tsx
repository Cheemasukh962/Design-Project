import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon, type IconName } from './Icon';

export type BadgeTone = 'gold' | 'blue' | 'neutral' | 'solid';

type Props = {
  label: string;
  icon?: IconName;
  tone?: BadgeTone;
  /** Uppercase micro type, e.g. the "DAILY TARGET" eyebrow. */
  eyebrow?: boolean;
  style?: ViewStyle;
};

/**
 * The small pill that appears all over the mocks — "Quests 2/3", "3 items",
 * "Lv.3 · 820 XP", "Supplement", "DAILY TARGET".
 *
 * One component rather than five near-identical inline styles, because these
 * pills carry very different meanings and it should be obvious in a diff when
 * a new one is introduced.
 */
export function Badge({ label, icon, tone = 'neutral', eyebrow = false, style }: Props) {
  const palette = TONES[tone];

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: palette.bg },
        palette.border ? { borderWidth: 1, borderColor: palette.border } : null,
        style,
      ]}
    >
      {icon && <Icon name={icon} size={14} color={palette.icon ?? palette.fg} />}
      <Text style={[styles.label, eyebrow && styles.eyebrow, { color: palette.fg }]}>
        {label}
      </Text>
    </View>
  );
}

const TONES: Record<
  BadgeTone,
  { bg: string; fg: string; border?: string; icon?: string }
> = {
  /** Gold fill — progress and reward states. */
  gold: {
    bg: colors.secondaryFixed,
    fg: colors.onSecondaryContainer,
    icon: colors.secondary,
  },
  /** Tinted blue with a hairline — the level / XP chip. */
  blue: {
    bg: colors.tintBlue,
    fg: colors.aggieBlue,
    border: colors.hairlineBlue,
    icon: colors.secondary,
  },
  /** Quiet grey-blue — counts and category tags. */
  neutral: {
    bg: colors.surfaceContainerHigh,
    fg: colors.onSurfaceVariant,
  },
  /** Filled navy — the active filter pill. */
  solid: {
    bg: colors.primary,
    fg: colors.onPrimary,
    icon: colors.onPrimary,
  },
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.base,
    paddingHorizontal: spacing.stackSm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  label: {
    ...typography.micro,
    letterSpacing: 0,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.55,
  },
});
