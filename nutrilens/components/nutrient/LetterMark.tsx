import { StyleSheet, Text, View } from 'react-native';
import { NEUTRAL_ACCENT, radius, typography, type Accent } from '../../theme';

type Props = {
  /** "D", "B12", "Fe". Kept short — it has to fit a 44px square. */
  letter: string;
  size?: number;
  /**
   * `tint` on a white card, `solid` on a tinted one. Without this the mark
   * disappears when its default fill matches the surface behind it.
   */
  tone?: 'tint' | 'solid';
  /**
   * The nutrient's identity colour. Every nutrient used to share one blue, so
   * D, B12, C, Iron and Calcium were indistinguishable at a glance — see
   * theme/accents.ts. Omit for the neutral blue.
   */
  accent?: Accent;
};

/**
 * A nutrient's identity mark: the letter in a rounded square.
 *
 * Deliberately not an icon. There is no drawing of "vitamin B12" that reads at
 * 44px, whereas the letter is understood immediately and needs no legend.
 */
export function LetterMark({
  letter,
  size = 44,
  tone = 'tint',
  accent = NEUTRAL_ACCENT,
}: Props) {
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size },
        // `solid` sits on an already-tinted surface, so it inverts: the mark
        // becomes the strong hue and the glyph goes white.
        tone === 'solid'
          ? { backgroundColor: accent.base }
          : { backgroundColor: accent.surface },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text
        style={[
          styles.text,
          { color: tone === 'solid' ? '#ffffff' : accent.text },
          // Scale the glyph with the box, so a 72px mark is not an 18px letter
          // floating in space.
          { fontSize: Math.round(size * 0.4), lineHeight: Math.round(size * 0.5) },
          letter.length > 2 && { fontSize: Math.round(size * 0.28) },
        ]}
      >
        {letter}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.h3.fontFamily,
  },
});
