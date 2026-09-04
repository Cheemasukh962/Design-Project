import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '../../theme';

/** iPhone 15 logical size — the frame every mock was drawn at. */
export const FRAME_WIDTH = 393;
export const FRAME_HEIGHT = 852;

/** Breathing room kept around the frame on a desktop window. */
const MARGIN = 48;

type Props = { children: ReactNode };

/**
 * Locks the app to a phone-sized canvas when it is opened on a desktop browser.
 *
 * This is not cosmetic. Every screen here was designed at 393×852 and the
 * layout assumes that width — a 1440px-wide Results page stretches its cards
 * into unreadable 1400px lines and puts the bottom nav somewhere nobody would
 * ever design it. Showing the real target size is also what makes a laptop
 * demo an honest preview of the phone build.
 *
 * NATIVE IS UNTOUCHED. On iOS and Android this is a pass-through, so the app
 * fills the device exactly as before.
 *
 * On a browser window narrower than the frame — a phone, or a split pane — the
 * chrome drops away and the app fills the viewport, because at that point the
 * window *is* the device and a letterboxed card would only waste space.
 */
export function DeviceFrame({ children }: Props) {
  const { width, height } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // Wide enough to show the frame as an object sitting on a page?
  const framed = width >= FRAME_WIDTH + MARGIN;

  if (!framed) {
    return <View style={styles.fill}>{children}</View>;
  }

  return (
    <View style={styles.backdrop}>
      <View
        style={[
          styles.frame,
          {
            width: FRAME_WIDTH,
            // Shrink to the window when it is shorter than a phone, so the
            // frame never scrolls off the top on a laptop.
            height: Math.min(height - MARGIN, FRAME_HEIGHT),
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // A cool neutral, deliberately outside the product palette: the area around
    // the frame is not part of the app and should not read as though it is.
    backgroundColor: '#E3E8EF',
  },
  frame: {
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: colors.surface,
    shadowColor: '#0F1720',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 45,
    elevation: 12,
  },
});
