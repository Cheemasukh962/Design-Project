import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../../theme';

type Props = {
  /** 1-based index of the current question. */
  current: number;
  total: number;
};

/**
 * The quiz stepper. The active step is a 24×8 pill and every other step is an
 * 8px dot, so position is readable without relying on colour alone.
 *
 * Source: Stitch "Quiz - Question 2". Q1's mock uses a slightly different
 * treatment (3 dots, a 10px active circle, `primary` rather than Aggie Blue) —
 * this component follows Q2, which is the newer of the two.
 */
export function ProgressDots({ current, total }: Props) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`Question ${current} of ${total}`}
      accessibilityValue={{ min: 1, max: total, now: current }}
      style={styles.row}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;

        return (
          <View
            key={step}
            style={[
              styles.dot,
              isActive && styles.active,
              (isActive || isDone) && styles.filled,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: '#E8EBEF',
  },
  active: {
    width: 24,
  },
  filled: {
    backgroundColor: colors.aggieBlue,
  },
});
