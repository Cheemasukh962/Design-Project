import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../../theme';

type Props = {
  /** "D", "B12", "Fe". Kept short — it has to fit a 44px square. */
  letter: string;
  size?: number;
  /**
   * `tint` on a white card, `solid` on a tinted one. Without this the mark
   * disappears when its default fill matches the surface behind it.
   */
  tone?: 'tint' | 'solid';
};

/**
 * A nutrient's identity mark: the letter in a rounded square.
 *
 * Deliberately not an icon. There is no drawing of "vitamin B12" that reads at
 * 44px, whereas the letter is understood immediately and needs no legend.
 */
export function LetterMark({ letter, size = 44, tone = 'tint' }: Props) {
  return (
    <View
      style={[
        styles.box,
        tone === 'solid' && styles.boxSolid,
        { width: size, height: size },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={[styles.text, letter.length > 2 && styles.textTight]}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    backgroundColor: '#EEF4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxSolid: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  text: {
    ...typography.h3,
    color: colors.aggieBlue,
  },
  textTight: {
    fontSize: 14,
    lineHeight: 18,
  },
});
