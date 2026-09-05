import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, { Defs, Ellipse, G, LinearGradient, Rect, Stop, ClipPath } from 'react-native-svg';
import { colors, typography } from '../../theme';

type Props = {
  /** Height of the mark. The wordmark scales with it. */
  size?: number;
  /** Mark only, for tight spaces like a tab bar or an app icon. */
  markOnly?: boolean;
  style?: ViewStyle;
};

/**
 * The VitaPal logo: a capsule mark and the wordmark.
 *
 * The mark is the same object the whole product is built around — the pill —
 * drawn with the identical two-tone treatment as PillMark, so the logo and the
 * nutrient marks are visibly the same family rather than two unrelated ideas.
 *
 * "Vita" in brand navy, "Pal" in brand gold: the split is the product in two
 * words, and it puts the emphasis on the half that is new.
 */
export function Logo({ size = 32, markOnly = false, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Defs>
          <ClipPath id="logo-clip">
            <Rect x={15} y={5} width={18} height={38} rx={9} ry={9} />
          </ClipPath>
          <LinearGradient id="logo-body" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.22} />
            <Stop offset="0.45" stopColor="#ffffff" stopOpacity={0.25} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.28} />
          </LinearGradient>
        </Defs>

        <G transform="rotate(-24 24 24)">
          <G clipPath="url(#logo-clip)">
            <Rect x={0} y={0} width={48} height={48} fill={colors.secondaryContainer} />
            <Rect x={15} y={0} width={9} height={48} fill={colors.aggieBlue} />
            <Rect x={0} y={0} width={48} height={48} fill="url(#logo-body)" />
            <Ellipse cx={19} cy={24} rx={1.8} ry={11} fill="#ffffff" opacity={0.5} />
          </G>
          <Rect
            x={15}
            y={5}
            width={18}
            height={38}
            rx={9}
            ry={9}
            fill="none"
            stroke={colors.aggieBlue}
            strokeWidth={3}
          />
        </G>
      </Svg>

      {!markOnly && (
        <Text style={[styles.word, { fontSize: size * 0.72, lineHeight: size * 0.88 }]}>
          <Text style={styles.vita}>Vita</Text>
          <Text style={styles.pal}>Pal</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  word: { fontFamily: typography.display.fontFamily, letterSpacing: -0.5 },
  vita: { color: colors.aggieBlue },
  pal: { color: colors.secondary },
});
