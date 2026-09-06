import { useEffect, useId, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { CARE, moodForCare } from '../../data/companion';
import { companion } from '../../theme/companion';
import { colors, typography } from '../../theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type Props = {
  /** 0-100. */
  care: number;
  /** The liquid colour. Usually the species accent. */
  fill: string;
  size?: number;
  /** Overrides the automatic "Care" / "Resting" caption. */
  label?: string;
  /** Ground it sits on. Decides the empty-glass and text colours. */
  tone?: 'night' | 'light';
  /** Heart beside the reading, or heart above it. */
  layout?: 'row' | 'stack';
  /** Hides the number, for use as a small ornament. */
  showValue?: boolean;
};

/**
 * HP — a glass heart that fills and drains.
 *
 * THIS IS THE MAIN MECHANIC. Growth stages are a slow reward that most people
 * will not see for a fortnight; HP is the one that answers "did today matter",
 * which is why it now leads every screen the pal appears on. Ticking anything
 * off puts it up by CARE.RECOVER, and every day away takes CARE.DECAY off.
 *
 * IT CANNOT EMPTY. The floor is CARE.FLOOR and it is deliberately visible —
 * even a neglected pal keeps a heart with something in it. An empty heart is a
 * picture of a dead pet, and the behaviour this app wants to reinforce is
 * taking a supplement, not opening an app daily to keep something alive. See
 * the CARE block in data/companion.ts.
 *
 * A heart rather than a bar because the number is about attachment, not
 * achievement — the routine ring already does achievement, and two identical
 * bars measuring different things would be unreadable side by side.
 *
 * BUILT LIKE THE PILL. Same construction as PillMark and FoodMark: clip to the
 * silhouette, fill flat, lay one radial volume gradient over it, stroke the
 * navy outline last. The liquid has a meniscus and the glass has a specular
 * highlight, so it reads as a container with something in it rather than a
 * progress bar shaped like a heart.
 */
export function CareMeter({
  care,
  fill,
  size = 44,
  label,
  tone = 'night',
  layout = 'row',
  showValue = true,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `hp-clip-${uid}`;
  const volId = `hp-vol-${uid}`;
  const glossId = `hp-gloss-${uid}`;

  const light = tone === 'light';
  const pct = Math.min(100, Math.max(0, care));

  // The liquid surface, in viewBox units. 14 is the top of the heart, 106 the
  // tip; the floor keeps a visible amount in even at CARE.FLOOR.
  const surfaceFor = (v: number) => 106 - ((106 - 14) * v) / 100;

  const surface = useRef(new Animated.Value(surfaceFor(pct))).current;

  useEffect(() => {
    Animated.timing(surface, {
      toValue: surfaceFor(pct),
      duration: 700,
      easing: Easing.out(Easing.cubic),
      // Animating SVG geometry attributes, which the native driver cannot do.
      useNativeDriver: false,
    }).start();
  }, [pct, surface]);

  const stacked = layout === 'stack';

  return (
    <View style={[stacked ? styles.stack : styles.row, { gap: stacked ? 6 : 10 }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <ClipPath id={clipId}>
            <Path d={HEART} />
          </ClipPath>

          {/* One light source, high and to the left — the same one the pill and
              the food illustrations use. */}
          <RadialGradient id={volId} cx="32%" cy="24%" r="82%">
            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.4} />
            <Stop offset="0.45" stopColor="#ffffff" stopOpacity={0.06} />
            <Stop offset="0.8" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.3} />
          </RadialGradient>

          <LinearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.72} />
            <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <G clipPath={`url(#${clipId})`}>
          {/* Empty glass */}
          <Rect
            x={0}
            y={0}
            width={120}
            height={120}
            fill={light ? colors.surfaceContainerHigh : companion.nightRaised}
          />

          {/* Liquid, rising from the tip */}
          <AnimatedRect x={0} y={surface} width={120} height={120} fill={fill} />
          {/* Meniscus — the curved surface is most of what says "liquid" */}
          <AnimatedEllipse cx={60} cy={surface} rx={62} ry={6} fill={fill} />
          <AnimatedEllipse
            cx={60}
            cy={surface}
            rx={62}
            ry={6}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2}
            opacity={0.35}
          />

          {/* Volume over everything, so glass and liquid share one light */}
          <Rect x={0} y={0} width={120} height={120} fill={`url(#${volId})`} />

          {/* Specular streak on the upper-left lobe */}
          <Ellipse cx={38} cy={44} rx={9} ry={16} fill={`url(#${glossId})`} transform="rotate(-24 38 44)" />
        </G>

        {/* Brand navy outlines everything else, but the empty part of this
            glass is already dark, so a navy edge vanished into the night ground
            exactly where the meter is lowest — the one reading that most needs
            to stay legible. */}
        <Path
          d={HEART}
          fill="none"
          stroke={light ? colors.aggieBlue : companion.nightLine}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </Svg>

      {showValue && (
        <View style={stacked ? styles.textStack : undefined}>
          <Text style={[styles.value, light && { color: colors.aggieBlue }]}>
            {Math.round(pct)}%
          </Text>
          <Text style={[styles.label, light && { color: colors.onSurfaceVariant }]}>
            {label ?? CAPTION[moodForCare(pct)]}
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * A word for the level, so the number is not the only thing carrying it.
 *
 * None of these blames anyone. "Resting" rather than "neglected": the floor
 * exists precisely so the low state is not a punishment screen.
 */
const CAPTION: Record<ReturnType<typeof moodForCare>, string> = {
  happy: 'Thriving',
  content: 'Doing well',
  sleepy: 'Slipping',
  droopy: 'Resting',
};

/** Drawn in a 120 box so it matches PillMark and FoodMark's coordinate space. */
const HEART =
  'M 60 104 C 30 84 12 64 12 44 C 12 28 24 18 38 18 C 47 18 55 23 60 31 ' +
  'C 65 23 73 18 82 18 C 96 18 108 28 108 44 C 108 64 90 84 60 104 Z';

export { CARE };

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stack: { alignItems: 'center' },
  textStack: { alignItems: 'center' },
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
