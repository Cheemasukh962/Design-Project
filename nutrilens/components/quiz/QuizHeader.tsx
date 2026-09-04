import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { Icon } from '../ui/Icon';
import { ProgressDots } from './ProgressDots';

type Props = {
  current: number;
  total: number;
  onBack?: () => void;
};

/**
 * Back control + stepper. The global tab bar is suppressed for the quiz — it is
 * a linear flow, and an escape hatch to other tabs mid-question invites drop-off.
 *
 * Back is always available and never discards an answer.
 */
export function QuizHeader({ current, total, onBack }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back to the previous question"
        onPress={onBack}
        style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
      >
        <Icon name="arrow-back" size={24} color={colors.onSurface} />
      </Pressable>

      <ProgressDots current={current} total={total} />

      {/* Balances the back button so the stepper sits optically centred. */}
      <View style={styles.spacer} aria-hidden />
    </View>
  );
}

const TOUCH = 44;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.stackSm,
  },
  back: {
    width: TOUCH,
    height: TOUCH,
    marginLeft: -spacing.stackSm,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPressed: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  spacer: {
    width: TOUCH,
    height: TOUCH,
  },
});
