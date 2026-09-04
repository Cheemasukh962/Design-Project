import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import type { Mood } from '../../data/companion';
import { SPECIES, type SpeciesId, type Stage } from '../../data/companion';
import { companion } from '../../theme/companion';

type Props = {
  species: SpeciesId;
  stage: Stage;
  mood?: Mood;
  size?: number;
  /** Soft coloured halo behind the creature. Off inside small chips. */
  glow?: boolean;
  /** Idle bob. Off for static contexts like the starter grid. */
  animate?: boolean;
  style?: ViewStyle;
};

/**
 * The companion, drawn rather than shipped as art.
 *
 * WHY VECTOR AND NOT ILLUSTRATION. Nine creatures — three species across three
 * evolution stages — have to look like one family, or the evolution reads as a
 * swap rather than a growth. Drawing them from one parameterised skeleton makes
 * that true by construction: stage changes the proportions, species changes the
 * palette and the crest, and nothing else moves. It also scales to any size,
 * animates, costs nothing to recolour, and carries no borrowed IP.
 *
 * The construction follows the two rules from Pokémon's own design practice:
 * everything is circles and triangles, and the silhouette has to survive being
 * filled solid black — which is why the crest, not the face, is what
 * distinguishes the three species from across the screen.
 *
 * PROPORTION IS THE EVOLUTION. Stage 0 is roughly two heads tall with an
 * oversized cranium and no arms, which is the standard cue for "infant". Stage 1
 * gains limbs and length. Stage 2 separates the head from the body onto a neck
 * and stands nearly five heads tall — the same trick every starter line uses to
 * go from cute to heroic without changing species.
 */

type StageGeometry = {
  bodyW: number;
  bodyH: number;
  bodyCY: number;
  eyeR: number;
  eyeY: number;
  eyeDx: number;
  crestScale: number;
  crestY: number;
  arms: boolean;
  head: { r: number; cy: number } | null;
  footY: number;
  footW: number;
  footDx: number;
};

const GEOMETRY: Record<Stage, StageGeometry> = {
  // Infant: one big blob, enormous eyes, no arms.
  0: {
    bodyW: 60, bodyH: 56, bodyCY: 92, eyeR: 8, eyeY: 84, eyeDx: 15,
    crestScale: 1.05, crestY: 0, arms: false, head: null,
    footY: 122, footW: 15, footDx: 15,
  },
  // Adolescent: longer body, arms appear, eyes shrink relative to the head.
  1: {
    bodyW: 54, bodyH: 72, bodyCY: 86, eyeR: 7, eyeY: 70, eyeDx: 13.5,
    crestScale: 1.35, crestY: 0, arms: true, head: null,
    footY: 126, footW: 15, footDx: 16,
  },
  // Final: head separates onto a neck, body narrows, stance widens.
  2: {
    bodyW: 46, bodyH: 60, bodyCY: 96, eyeR: 6, eyeY: 52, eyeDx: 11.5,
    crestScale: 1.75, crestY: 0, arms: true, head: { r: 26, cy: 52 },
    footY: 128, footW: 16, footDx: 18,
  },
};

/** Head ornaments. One per species — this is what carries the silhouette. */
function Crest({
  kind,
  x,
  y,
  scale,
  fill,
  stroke,
}: {
  kind: 'flame' | 'cloud' | 'leaf';
  x: number;
  y: number;
  scale: number;
  fill: string;
  stroke: string;
}) {
  const sw = 3 / scale;

  if (kind === 'flame') {
    return (
      <G transform={`translate(${x} ${y}) scale(${scale})`}>
        <Path
          d="M0 -26 C 9 -14, 12 -6, 6 0 C 2 3, -6 3, -9 -1 C -13 -7, -8 -16, 0 -26 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <Path
          d="M9 -14 C 15 -8, 15 -3, 11 0 C 8 2, 4 1, 4 -2 C 4 -6, 7 -9, 9 -14 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </G>
    );
  }

  if (kind === 'cloud') {
    return (
      <G transform={`translate(${x} ${y}) scale(${scale})`}>
        {/* Three bulging lobes with a flat base. A smooth arc here read as a
            beanie rather than a cloud — the lobes are what carry the meaning. */}
        <Path
          d="M-17 0 A 7 7 0 1 1 -5.5 -7.5 A 8 8 0 1 1 7.5 -7 A 6.5 6.5 0 1 1 17 0 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </G>
    );
  }

  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Side leaves first so the main leaf overlaps them. */}
      <Ellipse cx={-11} cy={-5} rx={7} ry={3.5} fill={fill} stroke={stroke} strokeWidth={sw} transform="rotate(-25 -11 -5)" />
      <Ellipse cx={11} cy={-5} rx={7} ry={3.5} fill={fill} stroke={stroke} strokeWidth={sw} transform="rotate(25 11 -5)" />
      <Path
        d="M0 0 C -10 -6, -10 -20, 0 -26 C 10 -20, 10 -6, 0 0 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <Path d="M0 -2 L 0 -22" stroke={stroke} strokeWidth={sw * 0.7} fill="none" />
    </G>
  );
}

/** Eyes and mouth. The only thing mood changes. */
function Face({
  mood,
  g,
  stroke,
}: {
  mood: Mood;
  g: StageGeometry;
  stroke: string;
}) {
  const { eyeR, eyeY, eyeDx } = g;
  const mouthY = eyeY + eyeR + 8;

  // Sleepy and droopy close the eyes to arcs. A closed eye reads as tired at
  // any size, where a small pupil just reads as a different character.
  if (mood === 'sleepy' || mood === 'droopy') {
    const droop = mood === 'droopy' ? 3 : 0;
    return (
      <G>
        <Path
          d={`M${-eyeDx - eyeR} ${eyeY + droop} Q ${-eyeDx} ${eyeY + eyeR + droop}, ${-eyeDx + eyeR} ${eyeY + droop}`}
          stroke={stroke}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={`M${eyeDx - eyeR} ${eyeY + droop} Q ${eyeDx} ${eyeY + eyeR + droop}, ${eyeDx + eyeR} ${eyeY + droop}`}
          stroke={stroke}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={
            mood === 'droopy'
              ? `M-5 ${mouthY + 2} Q 0 ${mouthY - 2}, 5 ${mouthY + 2}`
              : `M-4 ${mouthY} L 4 ${mouthY}`
          }
          stroke={stroke}
          strokeWidth={2.6}
          strokeLinecap="round"
          fill="none"
        />
      </G>
    );
  }

  const open = mood === 'happy';
  return (
    <G>
      <Circle cx={-eyeDx} cy={eyeY} r={eyeR} fill={stroke} />
      <Circle cx={eyeDx} cy={eyeY} r={eyeR} fill={stroke} />
      {/* Highlights. Two per eye is the difference between alive and doll-like. */}
      <Circle cx={-eyeDx + eyeR * 0.35} cy={eyeY - eyeR * 0.35} r={eyeR * 0.3} fill="#ffffff" />
      <Circle cx={eyeDx + eyeR * 0.35} cy={eyeY - eyeR * 0.35} r={eyeR * 0.3} fill="#ffffff" />
      {open ? (
        <Path
          d={`M-6 ${mouthY - 1} Q 0 ${mouthY + 6}, 6 ${mouthY - 1} Z`}
          fill={stroke}
        />
      ) : (
        <Path
          d={`M-5 ${mouthY - 1} Q 0 ${mouthY + 3}, 5 ${mouthY - 1}`}
          stroke={stroke}
          strokeWidth={2.6}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </G>
  );
}

export function Creature({
  species,
  stage,
  mood = 'happy',
  size = 160,
  glow = true,
  animate = true,
  style,
}: Props) {
  const g = GEOMETRY[stage];
  const { palette, crest } = SPECIES[species];
  const outline = companion.outline;
  const bob = useRef(new Animated.Value(0)).current;

  // A tired creature moves less. Same loop, smaller amplitude and slower — it
  // reads as low energy without needing a second animation.
  const lively = mood === 'happy' || mood === 'content';

  useEffect(() => {
    if (!animate) {
      bob.setValue(0);
      return;
    }
    const duration = lively ? 1100 : 2000;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, lively, bob]);

  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, lively ? -6 : -2],
  });

  const headTopY = g.head ? g.head.cy - g.head.r : g.bodyCY - g.bodyH / 2;

  return (
    <Animated.View style={[{ width: size, height: size }, style, { transform: [{ translateY }] }]}>
      <Svg width="100%" height="100%" viewBox="0 0 120 140">
        {glow && <Circle cx={60} cy={88} r={52} fill={palette.glow} />}

        <G transform="translate(60 0)">
          {/* Ground shadow — anchors the creature so it is not floating. */}
          <Ellipse cx={0} cy={g.footY + 6} rx={26} ry={5} fill="rgba(0,0,0,0.22)" />

          {/* Feet */}
          <Ellipse cx={-g.footDx} cy={g.footY} rx={g.footW / 2} ry={5.5} fill={palette.base} stroke={outline} strokeWidth={3} />
          <Ellipse cx={g.footDx} cy={g.footY} rx={g.footW / 2} ry={5.5} fill={palette.base} stroke={outline} strokeWidth={3} />

          {/* Neck, only when the head has separated */}
          {g.head && (
            <Rect x={-7} y={g.head.cy} width={14} height={26} rx={6} fill={palette.base} stroke={outline} strokeWidth={3} />
          )}

          {/* Arms */}
          {g.arms && (
            <>
              <Ellipse cx={-g.bodyW / 2 - 2} cy={g.bodyCY} rx={6} ry={12} fill={palette.base} stroke={outline} strokeWidth={3} transform={`rotate(18 ${-g.bodyW / 2 - 2} ${g.bodyCY})`} />
              <Ellipse cx={g.bodyW / 2 + 2} cy={g.bodyCY} rx={6} ry={12} fill={palette.base} stroke={outline} strokeWidth={3} transform={`rotate(-18 ${g.bodyW / 2 + 2} ${g.bodyCY})`} />
            </>
          )}

          {/* Body */}
          <Ellipse cx={0} cy={g.bodyCY} rx={g.bodyW / 2} ry={g.bodyH / 2} fill={palette.base} stroke={outline} strokeWidth={3.5} />
          {/* Belly patch, inset so the outline still reads */}
          {/* Pushed to the lower half: with the belly centred, the eyes landed
              on it and the creature read as a face painted on a stomach. */}
          <Ellipse
            cx={0}
            cy={g.bodyCY + g.bodyH * 0.22}
            rx={g.bodyW / 2 - 10}
            ry={g.bodyH / 2 - 15}
            fill={palette.belly}
          />

          {/* Head */}
          {g.head && (
            <>
              <Circle cx={0} cy={g.head.cy} r={g.head.r} fill={palette.base} stroke={outline} strokeWidth={3.5} />
              <Ellipse cx={0} cy={g.head.cy + 11} rx={g.head.r - 11} ry={g.head.r - 17} fill={palette.belly} />
            </>
          )}

          <Crest kind={crest} x={0} y={headTopY + 4} scale={g.crestScale} fill={palette.accent} stroke={outline} />

          <Face mood={mood} g={g} stroke={outline} />
        </G>
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
export { styles as creatureStyles };
