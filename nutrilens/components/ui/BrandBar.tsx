import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { Logo } from '../brand/Logo';
import { Icon } from './Icon';

type Props = {
  onNotifications?: () => void;
};

/**
 * The brand top bar used by Results and the Routine tracker.
 *
 * The logo replaced a mascot avatar plus a text wordmark. Two marks competing
 * in one corner is one too many, and the mascot was doing no work here — it
 * carried no state and said nothing, which is exactly the test for whether a
 * mascot appearance is earned.
 *
 * The bell is decorative for now — there is no notification system yet, and it
 * says so to a screen reader rather than pretending.
 */
export function BrandBar({ onNotifications }: Props) {
  return (
    <View style={styles.bar}>
      <Logo size={30} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications. Nothing here yet."
        onPress={onNotifications}
        style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
      >
        <Icon name="notifications" size={22} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.stackSm,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.stackSm,
  },
  pressed: { backgroundColor: colors.surfaceContainerLow },
});
