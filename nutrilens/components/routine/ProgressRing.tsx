import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../../theme';

type Props = {
  done: number;
  total: number;
  size?: number;
};

/**
 * Completion ring for today's routine.
 *
 * This is the one place a percentage is allowed, because it measures something
 * real: how many of the things the user chose to do they have ticked off. It is
 * a count of their own actions, never an estimate of what is in their body.
 *
 * Drawn as a real arc. The mock's radius of 15.9155 in a 36-unit box is chosen
 * so the circumference comes to exactly 100 — which makes the dash array the
 * percentage, with no arithmetic.
 */
const R = 15.9155;
const CIRCUMFERENCE = 100;

export function ProgressRing({ done, total, size = 80 }: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`${done} of ${total} done today`}
      accessibilityValue={{ min: 0, max: total, now: done }}
      style={[styles.wrap, { width: size, height: size }]}
    >
      <Svg width={size} height={size} viewBox="0 0 36 36">
        <Circle
          cx="18"
          cy="18"
          r={R}
          fill="none"
          stroke={colors.surfaceContainerHigh}
          strokeWidth={3.5}
        />
        <Circle
          cx="18"
          cy="18"
          r={R}
          fill="none"
          stroke={colors.secondaryContainer}
          strokeWidth={3.8}
          strokeLinecap="round"
          strokeDasharray={`${pct}, ${CIRCUMFERENCE}`}
          // Start the arc at twelve o'clock rather than three.
          transform="rotate(-90 18 18)"
        />
      </Svg>

      <View style={styles.label} pointerEvents="none">
        <Text style={styles.pct}>{pct}%</Text>
        <Text style={styles.goal}>Goal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pct: {
    ...typography.h3,
    fontFamily: typography.h1Mobile.fontFamily,
    color: colors.primary,
  },
  goal: {
    ...typography.micro,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0,
    color: colors.outline,
  },
});
