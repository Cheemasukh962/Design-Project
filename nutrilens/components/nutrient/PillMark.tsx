import { useEffect, useId, useRef } from 'react';
import { Animated, Easing, View, type ViewStyle } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { colors } from '../../theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export type PillShape = 'capsule' | 'tablet' | 'softgel';

type Props = {
  shape?: PillShape;
  size?: number;
  /** Rotate about the long axis. Off for small static marks. */
  spin?: boolean;
  style?: ViewStyle;
};

/**
 * A pill, rendered to look three-dimensional and turning.
 *
 * REPLACES the letter mark. "D" in a rounded square was a placeholder standing
 * in for an identity we had not designed; a pill is the actual object the
 * product is about, and it carries far more at a glance.
 *
 * WHITE AND NAVY ONLY. Nutrients are told apart by SHAPE, not colour — a
 * capsule, a scored tablet, a softgel. Five accent hues had crept in and made
 * the health app look like a paint chart; shape does the same job inside the
 * brand's two colours and stays legible for anyone who cannot separate hues.
 *
 * HOW THE 3D WORKS. It is a real axial rotation, not a spinning image. The pill
 * is clipped to its own silhouette, and the coloured half is a rect whose width
 * animates across the body — which is exactly what the seam of a two-tone
 * cylinder does when you turn it. A fixed cylindrical gradient supplies the
 * volume and a specular highlight sits where the light would be, so the surface
 * reads as curved while the seam travels underneath it.
 */
export function PillMark({ shape = 'capsule', size = 44, spin = false, style }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `pill-clip-${uid}`;
  const bodyId = `pill-body-${uid}`;
  const glossId = `pill-gloss-${uid}`;

  const turn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!spin) {
      // Parked just past half, so a static mark still shows both tones.
      turn.setValue(0.55);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(turn, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          // Animating an SVG width attribute, which the native driver cannot do.
          useNativeDriver: false,
        }),
        Animated.timing(turn, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [spin, turn]);

  const geo = GEOMETRY[shape];

  // The seam sweeps the full body width and a little past each edge, so the
  // pill reads as fully turning rather than stopping short.
  const seam = turn.interpolate({
    inputRange: [0, 1],
    outputRange: [0, geo.w],
  });

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 120 120">
        <Defs>
          <ClipPath id={clipId}>
            {shape === 'tablet' ? (
              <Ellipse cx={geo.cx} cy={geo.cy} rx={geo.w / 2} ry={geo.h / 2} />
            ) : (
              <Rect
                x={geo.x}
                y={geo.y}
                width={geo.w}
                height={geo.h}
                rx={geo.rx}
                ry={geo.rx}
              />
            )}
          </ClipPath>

          {/* Cylinder shading across the short axis: dark edge, lit centre,
              dark edge. This is what makes a flat shape read as round. */}
          <LinearGradient id={bodyId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.16} />
            <Stop offset="0.3" stopColor="#ffffff" stopOpacity={0.18} />
            <Stop offset="0.5" stopColor="#ffffff" stopOpacity={0.34} />
            <Stop offset="0.76" stopColor="#000000" stopOpacity={0.06} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.2} />
          </LinearGradient>

          <LinearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.75} />
            <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <G transform={`rotate(${geo.tilt} 60 60)`}>
          {/* Contact shadow, so it sits in space rather than floating flat. */}
          <Ellipse
            cx={60}
            cy={geo.y + geo.h + 6}
            rx={geo.w * 0.42}
            ry={4}
            fill="rgba(2,40,81,0.18)"
          />

          <G clipPath={`url(#${clipId})`}>
            {/* Light half */}
            <Rect x={0} y={0} width={120} height={120} fill="#F4F8FD" />
            {/* Dark half — its width is the turning seam */}
            <AnimatedRect x={geo.x} y={0} width={seam} height={120} fill={colors.aggieBlue} />
            {/* Volume */}
            <Rect x={0} y={0} width={120} height={120} fill={`url(#${bodyId})`} />
            {/* Specular streak along the lit side */}
            <Ellipse
              cx={geo.x + geo.w * 0.33}
              cy={geo.cy}
              rx={geo.w * 0.1}
              ry={geo.h * 0.34}
              fill={`url(#${glossId})`}
            />
            {/* Scored line, tablets only */}
            {shape === 'tablet' && (
              <Path
                d={`M${geo.cx} ${geo.y + 6} L ${geo.cx} ${geo.y + geo.h - 6}`}
                stroke="rgba(2,40,81,0.35)"
                strokeWidth={2.5}
              />
            )}
          </G>

          {/* Outline last so it is never covered by the fills. */}
          {shape === 'tablet' ? (
            <Ellipse
              cx={geo.cx}
              cy={geo.cy}
              rx={geo.w / 2}
              ry={geo.h / 2}
              fill="none"
              stroke={colors.aggieBlue}
              strokeWidth={3}
            />
          ) : (
            <Rect
              x={geo.x}
              y={geo.y}
              width={geo.w}
              height={geo.h}
              rx={geo.rx}
              ry={geo.rx}
              fill="none"
              stroke={colors.aggieBlue}
              strokeWidth={3}
            />
          )}
        </G>
      </Svg>
    </View>
  );
}

type Geo = {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  cx: number;
  cy: number;
  tilt: number;
};

/**
 * Three silhouettes, all readable when filled solid black — the same test the
 * companion creatures are held to.
 */
const GEOMETRY: Record<PillShape, Geo> = {
  // Long two-tone capsule.
  capsule: { x: 42, y: 16, w: 36, h: 88, rx: 18, cx: 60, cy: 60, tilt: -24 },
  // Wide round tablet with a score line.
  tablet: { x: 22, y: 30, w: 76, h: 60, rx: 30, cx: 60, cy: 60, tilt: -12 },
  // Elongated softgel. At 56x68 it was near-circular and read as a coin.
  softgel: { x: 36, y: 18, w: 48, h: 84, rx: 24, cx: 60, cy: 60, tilt: -18 },
};
