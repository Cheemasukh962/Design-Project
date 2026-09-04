import { StyleSheet, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, Path, Rect } from 'react-native-svg';
import { CARE } from '../../data/companion';
import { companion } from '../../theme/companion';
import { typography } from '../../theme';

type Props = {
  /** 0-100. */
  care: number;
  fill: string;
  size?: number;
  label?: string;
};

/** A heart, drawn once and reused as both the outline and the fill clip. */
const HEART =
  'M32 58 C 6 40, 0 24, 0 16 A 16 16 0 0 1 32 10 A 16 16 0 0 1 64 16 C 64 24, 58 40, 32 58 Z';

/**
 * The care meter — a heart that fills from the bottom.
 *
 * It cannot empty. The floor sits at CARE.FLOOR, which is deliberately visible:
 * even a neglected companion shows a heart with something left in it, because
 * an empty heart is a picture of a dead pet and this app does not do that. See
 * the CARE block in data/companion.ts for why that decision is not just
 * squeamishness.
 *
 * A heart rather than a bar because the number is about attachment, not
 * achievement — the routine ring already does achievement, and two identical
 * progress bars measuring different things would be unreadable side by side.
 */
export function CareMeter({ care, fill, size = 44, label }: Props) {
  const pct = Math.min(100, Math.max(0, care));
  // The SVG heart is 64 wide by 58 tall; fill rises from its baseline.
  const fillTop = 58 - (58 * pct) / 100;

  return (
    <View style={styles.row}>
      <Svg width={size} height={size * (58 / 64)} viewBox="0 0 64 58">
        <Defs>
          <ClipPath id="heart-clip">
            <Path d={HEART} />
          </ClipPath>
        </Defs>
        <Path d={HEART} fill={companion.nightRaised} />
        <Rect x={0} y={fillTop} width={64} height={58} fill={fill} clipPath="url(#heart-clip)" />
        <Path d={HEART} fill="none" stroke={companion.outline} strokeWidth={3} strokeLinejoin="round" />
      </Svg>

      <View style={styles.text}>
        <Text style={styles.value}>{Math.round(pct)}%</Text>
        <Text style={styles.label}>{label ?? (pct <= CARE.FLOOR ? 'Resting' : 'Care')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { gap: 0 },
  value: {
    ...typography.h3,
    color: companion.onNight,
  },
  label: {
    ...typography.micro,
    letterSpacing: 0,
    color: companion.onNightMuted,
  },
});
