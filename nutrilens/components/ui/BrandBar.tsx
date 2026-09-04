import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from './Icon';

type Props = {
  /**
   * `photo` — Vito's avatar in a 40px circle, as on Results.
   * `glyph` — a 32px navy disc with the robot mark, as on the Routine tracker.
   */
  mark?: 'photo' | 'glyph';
  onNotifications?: () => void;
};

/**
 * The brand top bar used by Results and the Routine tracker.
 *
 * The two mocks draw it slightly differently — Results uses a 40px photo
 * avatar with the wordmark at 24px, Routine a 32px navy disc with the wordmark
 * at 22px. Both variants are kept rather than picked between, because the
 * difference reads as deliberate weighting: Results is the payoff screen and
 * carries the heavier mark.
 *
 * The bell is decorative for now — there is no notification system. It routes
 * nowhere and says so to a screen reader rather than pretending.
 */
export function BrandBar({ mark = 'photo', onNotifications }: Props) {
  const isPhoto = mark === 'photo';

  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        {isPhoto ? (
          <Image
            source={require('../../assets/brand/vito-avatar.png')}
            style={styles.photo}
            resizeMode="cover"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        ) : (
          <View style={styles.glyph}>
            <Icon name="smart-toy" size={18} color={colors.secondaryFixed} />
          </View>
        )}
        <Text style={isPhoto ? styles.wordmarkLg : styles.wordmarkSm}>NutriLens</Text>
      </View>

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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  glyph: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.aggieBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkLg: {
    ...typography.h1Mobile,
    color: colors.primary,
  },
  wordmarkSm: {
    ...typography.h2,
    fontFamily: typography.h1Mobile.fontFamily,
    color: colors.primary,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.stackSm,
  },
  pressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
});
