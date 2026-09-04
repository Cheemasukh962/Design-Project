import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';
import { companion } from '../../theme/companion';

/**
 * The two page grounds used across the mocks.
 *
 * `surface` (#f8f9ff) is the whole health app — splash, quiz, results, Home,
 * nutrient pages and the tracker. There used to be a second, warmer cream
 * ground for onboarding, on the theory that it made the quiz read as its own
 * finite errand. In practice it just made the app look like it changed its mind
 * halfway through, so it is gone: one light ground, everywhere.
 *
 * `night` is the companion world, and it is the only other ground. It exists to
 * contain the three elemental hues: on the dark ground colour means creature
 * type, and on the light ground colour means what it means everywhere else in
 * the health app. The two never share a surface. See theme/companion.ts.
 */
export type ScreenBackground = 'surface' | 'night';

type Props = {
  children: ReactNode;
  /**
   * Applies the 20px screen margin. Turn off for screens with edge-to-edge
   * content (a horizontal carousel that bleeds past the margin, a hero image,
   * a header with a full-bleed gradient).
   */
  padded?: boolean;
  background?: ScreenBackground;
  /** Skip the top safe-area inset when a child paints its own header. */
  edgeToEdgeTop?: boolean;
  style?: ViewStyle;
};

/**
 * Page shell: page ground, safe-area insets, and the standard 20px margin.
 * Every screen mounts inside one of these so the margin is defined once.
 */
export function Screen({
  children,
  padded = true,
  background = 'surface',
  edgeToEdgeTop = false,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: GROUNDS[background] },
        {
          paddingTop: edgeToEdgeTop ? 0 : insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + (padded ? spacing.screenMargin : 0),
          paddingRight: insets.right + (padded ? spacing.screenMargin : 0),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const GROUNDS: Record<ScreenBackground, string> = {
  surface: colors.surface,
  night: companion.night,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
