import { useId, type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { colors, food } from '../../theme';

export type FoodKind =
  | 'salmon'
  | 'egg'
  | 'milk'
  | 'sun'
  | 'grain'
  | 'citrus'
  | 'pepper'
  | 'greens'
  | 'beans'
  | 'meat';

type Props = {
  kind: FoodKind;
  size?: number;
  style?: ViewStyle;
};

/**
 * A food source, drawn as a solid object rather than named by an icon.
 *
 * WHY. "Where to find it" was a row of 22px monochrome glyphs, and at that size
 * a fish, an egg and a glass of milk are three near-identical grey marks. This
 * section is the one place in the app that has to make a real-world action feel
 * available, and a glyph cannot do that. These are the same objects at 104px,
 * with weight and a light source.
 *
 * BUILT LIKE THE PILL. Identical construction to PillMark: each piece is
 * clipped to its own silhouette, filled flat, covered by one radial volume
 * gradient, and outlined in navy last. That shared treatment is what stops ten
 * illustrations from looking like ten different stock sets — the light falls
 * the same way on all of them and the outline weight matches the pill they are
 * shown beside.
 *
 * DRAWN IN PARTS, BACK TO FRONT. A food made of several objects — two eggs, a
 * handful of beans, three leaves — is a list of parts rather than one merged
 * silhouette. Merging them made the outlines cross, so two overlapping eggs
 * came out as a Venn diagram instead of one egg in front of another. Each part
 * paints over the parts behind it, which is what occlusion is.
 *
 * COLOUR IS CONTAINED. The tones live in theme/food.ts and may not be used
 * anywhere but inside this drawing; see that file for why food is allowed
 * colour when nutrient categories are not.
 */
export function FoodMark({ kind, size = 104, style }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const volId = `food-vol-${uid}`;

  const shape = SHAPES[kind] ?? SHAPES.grain;
  const tone = shape.tone;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 120 120">
        <Defs>
          {shape.parts.map((part, i) => (
            <ClipPath key={i} id={`${uid}-${i}`}>
              {prims(part.prims, {})}
            </ClipPath>
          ))}

          {/* One light source for the whole set: high and to the left, falling
              off to a shadowed lower-right edge. It is defined in viewBox
              coordinates, not per part, so a pile of beans is lit as one pile
              rather than as three separately lit beans. */}
          <RadialGradient id={volId} cx="34%" cy="26%" r="82%">
            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.46} />
            <Stop offset="0.42" stopColor="#ffffff" stopOpacity={0.1} />
            <Stop offset="0.78" stopColor="#000000" stopOpacity={0.08} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.26} />
          </RadialGradient>
        </Defs>

        {/* Contact shadow. Without it the object floats above the plate instead
            of resting on it, and that is most of what reads as solid. */}
        <Ellipse cx={60} cy={110} rx={32} ry={5} fill="rgba(2,40,81,0.13)" />

        {shape.behind?.(tone)}

        {shape.parts.map((part, i) => (
          <G key={i}>
            <G clipPath={`url(#${uid}-${i})`}>
              <Rect x={0} y={0} width={120} height={120} fill={tone.base} />
              {part.inside?.(tone)}
              <Rect x={0} y={0} width={120} height={120} fill={`url(#${volId})`} />
            </G>
            {prims(part.prims, {
              fill: 'none',
              stroke: colors.aggieBlue,
              strokeWidth: 3,
              strokeLinejoin: 'round',
            })}
          </G>
        ))}

        {shape.front?.(tone)}
      </Svg>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

type Tone = { base: string; deep: string; trim: string };

/**
 * Silhouette geometry is data, not JSX, because it is drawn twice — once as a
 * clip path and once as the outline — and the two must never drift apart.
 */
type Prim =
  | { t: 'path'; d: string; rot?: string }
  | { t: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rot?: string }
  | { t: 'circle'; cx: number; cy: number; r: number };

/**
 * One solid piece. Several prims in one part share a silhouette and are all
 * outlined — that is how a glass keeps the rim ellipse drawn across its mouth.
 * Separate parts occlude each other instead.
 */
type Part = {
  prims: Prim[];
  /** Markings, drawn over the flat fill and under the volume gradient. */
  inside?: (t: Tone) => ReactNode;
};

type Shape = {
  tone: Tone;
  /** Back to front. */
  parts: Part[];
  /** Drawn before everything — stalks and stems that tuck behind. */
  behind?: (t: Tone) => ReactNode;
  /** Drawn after everything — anything sitting on top of the object. */
  front?: (t: Tone) => ReactNode;
};

type PrimProps = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
};

function prims(list: Prim[], p: PrimProps): ReactNode {
  return list.map((prim, i) => {
    if (prim.t === 'circle') {
      return <Circle key={i} cx={prim.cx} cy={prim.cy} r={prim.r} {...p} />;
    }
    if (prim.t === 'ellipse') {
      return (
        <Ellipse
          key={i}
          cx={prim.cx}
          cy={prim.cy}
          rx={prim.rx}
          ry={prim.ry}
          transform={prim.rot}
          {...p}
        />
      );
    }
    return <Path key={i} d={prim.d} transform={prim.rot} {...p} />;
  });
}

/**
 * An egg: narrow round top, wide round bottom.
 *
 * The two-segment version of this was a lens — pointed at both ends, because
 * the control handles left each end on a diagonal instead of a horizontal
 * tangent. Four segments, with the widest point pushed below centre, is what
 * separates an egg from an almond.
 */
function egg(cx: number, cy: number, rx: number, ry: number): string {
  return (
    `M ${cx} ${cy - ry} ` +
    `C ${cx + rx * 0.74} ${cy - ry} ${cx + rx} ${cy - ry * 0.34} ${cx + rx} ${cy + ry * 0.08} ` +
    `C ${cx + rx} ${cy + ry * 0.64} ${cx + rx * 0.6} ${cy + ry} ${cx} ${cy + ry} ` +
    `C ${cx - rx * 0.6} ${cy + ry} ${cx - rx} ${cy + ry * 0.64} ${cx - rx} ${cy + ry * 0.08} ` +
    `C ${cx - rx} ${cy - ry * 0.34} ${cx - rx * 0.74} ${cy - ry} ${cx} ${cy - ry} Z`
  );
}

const LEAF = 'M 60 102 C 38 88 30 52 60 20 C 90 52 82 88 60 102 Z';
const MIDRIB = 'M 60 99 C 58 76 58 46 60 25';
/** Outer leaves first: the middle one has to sit in front of both. */
const LEAF_ROT = ['rotate(-32 60 102)', 'rotate(32 60 102)', ''];

/** The fat cap, traced just inside the steak's top edge. */
const MEAT_FAT = 'M 34 46 C 47 33 78 29 93 40 C 97 43 99 47 100 52';

/** Lentils are lens-shaped discs. Listed back to front. */
const BEANS = [
  { cx: 42, cy: 46, rot: 'rotate(-20 42 46)' },
  { cx: 78, cy: 64, rot: 'rotate(14 78 64)' },
  { cx: 50, cy: 84, rot: 'rotate(-6 50 84)' },
];

const SHAPES: Record<FoodKind, Shape> = {
  /* A fillet, not a whole fish: nobody is served a whole fish in a dining
     hall, and the pale striations are the one detail that says salmon. */
  salmon: {
    tone: food.salmon,
    parts: [
      {
        prims: [
          {
            t: 'path',
            d: 'M 16 76 C 18 48 44 26 74 28 C 96 30 106 44 102 58 C 96 80 58 96 28 90 C 20 88 16 84 16 76 Z',
          },
        ],
        inside: (t) => (
          <G stroke={t.trim} strokeWidth={4.5} strokeLinecap="round" fill="none" opacity={0.6}>
            <Path d="M 22 68 C 32 48 52 34 76 32" />
            <Path d="M 26 79 C 36 57 58 41 84 39" />
            <Path d="M 32 88 C 44 68 66 52 92 50" />
          </G>
        ),
      },
    ],
  },

  egg: {
    tone: food.egg,
    parts: [
      { prims: [{ t: 'path', d: egg(45, 56, 21, 27), rot: 'rotate(-14 45 56)' }] },
      { prims: [{ t: 'path', d: egg(72, 70, 23, 29), rot: 'rotate(10 72 70)' }] },
    ],
  },

  /* A glass rather than a carton, because a carton is a brand and a glass is a
     portion — and the portion is what the card underneath is measuring. */
  milk: {
    tone: food.milk,
    parts: [
      {
        prims: [
          {
            t: 'path',
            d: 'M 34 24 L 86 24 L 79 92 C 78 99 72 102 66 102 L 54 102 C 48 102 42 99 41 92 Z',
          },
          { t: 'ellipse', cx: 60, cy: 24, rx: 26, ry: 6.5 },
        ],
        inside: (t) => (
          <>
            <Path
              d="M 39 46 L 81 46 L 79 92 C 78 99 72 102 66 102 L 54 102 C 48 102 42 99 41 92 Z"
              fill={t.trim}
            />
            <Ellipse cx={60} cy={46} rx={21} ry={5} fill={t.trim} />
            <Ellipse cx={60} cy={46} rx={21} ry={5} fill="none" stroke={t.deep} strokeWidth={2} />
          </>
        ),
      },
    ],
  },

  /* The only "food" here that is not one. It stays in the set because Q3 asks
     about daylight and the answer changes the Vitamin D finding, so the sun has
     to appear where the other sources appear. */
  sun: {
    tone: food.sun,
    parts: [{ prims: [{ t: 'circle', cx: 60, cy: 60, r: 30 }] }],
    front: (t) => (
      <G stroke={t.deep} strokeWidth={6} strokeLinecap="round">
        <Path d="M 96 60 L 108 60" />
        <Path d="M 86 34 L 94 26" />
        <Path d="M 60 24 L 60 12" />
        <Path d="M 34 34 L 26 26" />
        <Path d="M 24 60 L 12 60" />
        <Path d="M 34 86 L 26 94" />
        <Path d="M 60 96 L 60 108" />
        <Path d="M 86 86 L 94 94" />
      </G>
    ),
  },

  /* Fortified foods are a category, not an ingredient. A bowl of cereal is the
     form almost everyone meets them in. */
  grain: {
    tone: food.grain,
    parts: [
      {
        prims: [
          { t: 'path', d: 'M 18 54 L 102 54 C 102 84 84 102 60 102 C 36 102 18 84 18 54 Z' },
          { t: 'ellipse', cx: 60, cy: 54, rx: 42, ry: 10 },
        ],
        inside: (t) => <Ellipse cx={60} cy={54} rx={36} ry={8} fill={t.trim} />,
      },
    ],
    front: (t) => (
      <G stroke={colors.aggieBlue} strokeWidth={2.5}>
        <Ellipse cx={42} cy={48} rx={9} ry={6} fill={t.base} transform="rotate(-22 42 48)" />
        <Ellipse cx={64} cy={45} rx={10} ry={6.5} fill={t.deep} transform="rotate(14 64 45)" />
        <Ellipse cx={81} cy={50} rx={8} ry={5.5} fill={t.base} transform="rotate(-8 81 50)" />
      </G>
    ),
  },

  /* Whole fruit plus a cut wedge. The wedge is doing the work — a plain orange
     sphere is a ball, and the segments are what make it citrus. */
  citrus: {
    tone: food.citrus,
    parts: [
      { prims: [{ t: 'circle', cx: 48, cy: 66, r: 28 }] },
      {
        prims: [{ t: 'path', d: 'M 96 50 A 22 22 0 0 0 96 94 Z' }],
        inside: (t) => (
          <G stroke={t.trim} strokeWidth={2.5} strokeLinecap="round" fill="none">
            <Path d="M 96 72 L 83 59" />
            <Path d="M 96 72 L 79 65" />
            <Path d="M 96 72 L 78 72" />
            <Path d="M 96 72 L 79 79" />
            <Path d="M 96 72 L 83 85" />
          </G>
        ),
      },
    ],
    front: () => (
      <>
        <Path
          d="M 48 40 L 48 30"
          stroke={food.greens.deep}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Path
          d="M 49 34 C 58 24 76 24 82 32 C 74 44 56 46 49 34 Z"
          fill={food.greens.base}
          stroke={colors.aggieBlue}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </>
    ),
  },

  /* Square shoulders and a lobed base. The first attempt was a plain oval and
     read as a tomato — a bell pepper is defined by its flat wide top and the
     two or three feet it stands on, not by being round. */
  pepper: {
    tone: food.pepper,
    parts: [
      {
        prims: [
          {
            t: 'path',
            d:
              'M 60 34 C 79 32 96 43 97 62 C 98 81 92 99 76 102 ' +
              'C 68 103 66 96 60 96 C 54 96 52 103 44 102 ' +
              'C 28 99 22 81 23 62 C 24 43 41 32 60 34 Z',
          },
        ],
        inside: (t) => (
          <G stroke={t.deep} strokeWidth={3} fill="none" opacity={0.45} strokeLinecap="round">
            <Path d="M 43 46 C 36 62 37 84 46 98" />
            <Path d="M 77 46 C 84 62 83 84 74 98" />
          </G>
        ),
      },
    ],
    behind: () => (
      <Path d="M 60 34 L 60 14" stroke={food.greens.deep} strokeWidth={8} strokeLinecap="round" />
    ),
    front: () => (
      <Path
        d="M 38 40 C 45 26 75 26 82 40 C 73 49 47 49 38 40 Z"
        fill={food.greens.base}
        stroke={colors.aggieBlue}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    ),
  },

  greens: {
    tone: food.greens,
    parts: LEAF_ROT.map((rot) => ({
      prims: [{ t: 'path' as const, d: LEAF, rot: rot || undefined }],
      inside: (t: Tone) => (
        <Path
          d={MIDRIB}
          transform={rot || undefined}
          stroke={t.trim}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      ),
    })),
  },

  /* Three of them read as "a handful"; one reads as a single object and loses
     the sense of a food you scoop. */
  beans: {
    tone: food.beans,
    parts: BEANS.map((b) => ({
      prims: [{ t: 'ellipse' as const, cx: b.cx, cy: b.cy, rx: 25, ry: 16, rot: b.rot }],
      inside: (t: Tone) => (
        <Ellipse
          cx={b.cx}
          cy={b.cy}
          rx={15}
          ry={5.5}
          transform={b.rot}
          fill="none"
          stroke={t.trim}
          strokeWidth={2.5}
          opacity={0.8}
        />
      ),
    })),
  },

  /* A cut, and specifically a cut with a fat cap. The first version was a
     symmetrical rounded blob with the cap painted underneath the volume
     gradient, where it disappeared — so it read as ham. The cap is drawn last
     now, outlined on both sides, because it is the single detail that says
     "steak" rather than "meat-coloured shape". */
  meat: {
    tone: food.meat,
    parts: [
      {
        prims: [
          {
            t: 'path',
            d:
              'M 30 42 C 44 26 78 22 96 34 C 108 42 106 62 100 76 ' +
              'C 92 94 66 104 48 98 C 28 92 18 74 20 60 C 21 50 24 47 30 42 Z',
          },
        ],
        inside: (t) => (
          <G stroke={t.trim} strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round">
            <Path d="M 40 62 C 48 56 55 64 63 58" />
            <Path d="M 36 78 C 46 72 53 80 63 74" />
            <Path d="M 58 90 C 66 84 75 92 85 86" />
          </G>
        ),
      },
    ],
    front: (t) => (
      <>
        <Path
          d={MEAT_FAT}
          stroke={colors.aggieBlue}
          strokeWidth={13}
          fill="none"
          strokeLinecap="round"
        />
        <Path d={MEAT_FAT} stroke={t.trim} strokeWidth={9} fill="none" strokeLinecap="round" />
      </>
    ),
  },
};
