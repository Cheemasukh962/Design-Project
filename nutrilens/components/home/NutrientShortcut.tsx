import { Pressable, StyleSheet, Text, View } from 'react-native';
import { accentFor, type Nutrient } from '../../data/nutrients';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';
import { LetterMark } from '../nutrient/LetterMark';

type Props = {
  nutrient: Nutrient;
  /** Whether this nutrient is already in the user's routine. Real, not invented. */
  inRoutine: boolean;
  onPress?: () => void;
};

export const SHORTCUT_WIDTH = 142;

/**
 * A nutrient shortcut on Home.
 *
 * REPLACES the gamified card the mock drew. That card carried a level badge, a
 * "% filled" overlay, a buff chip and a progress bar — none of which the app
 * could compute, because there is no intake log. Once the companion arrived and
 * started earning tokens from real ticks, Home was showing two progress systems
 * side by side: one honest, one invented. Keeping both made it impossible to
 * judge whether the game layer works, which is the whole question on the table.
 *
 * So the game lives in the companion, and this went back to being what it
 * actually is: a way into the nutrient page. The one status it shows is real —
 * whether the nutrient is in the routine.
 *
 * To restore the mock's version, components/home/NutrientProgressCard is still
 * in the tree and the invented values are still in data/progress.ts.
 */
export function NutrientShortcut({ nutrient, inRoutine, onPress }: Props) {
  const accent = accentFor(nutrient.id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${nutrient.name}. ${inRoutine ? 'In your routine.' : ''} ${nutrient.summary}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LetterMark letter={nutrient.letter} size={40} accent={accent} />

      <Text style={styles.name} numberOfLines={1}>
        {nutrient.name}
      </Text>

      {inRoutine ? (
        <View style={styles.status}>
          <Icon name="check-circle" size={13} color={colors.checkGreen} />
          <Text style={[styles.statusText, { color: colors.checkGreen }]}>In your routine</Text>
        </View>
      ) : (
        <View style={styles.status}>
          <Icon name="arrow-forward" size={13} color={colors.outline} />
          <Text style={styles.statusText}>Read up</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SHORTCUT_WIDTH,
    padding: spacing.base * 3,
    gap: spacing.stackSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  pressed: { opacity: 0.94 },
  name: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    fontSize: 15,
    lineHeight: 20,
    color: colors.onBackground,
  },
  status: { flexDirection: 'row', alignItems: 'center', gap: spacing.base },
  statusText: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.outline,
  },
});
