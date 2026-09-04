/**
 * Colors — extracted verbatim from the Stitch project design system
 * ("NutriLens Student Design System", project 18215832420737560579).
 *
 * Do not hardcode a hex value anywhere outside this file. Every screen and
 * component reads from here, so a palette change is one edit.
 *
 * NOTE ON `primary`: Stitch generated a Material-3 palette from the Aggie Blue
 * seed. The seed itself (#022851) landed in `primaryContainer`, while `primary`
 * resolved one step darker (#00142e). The mocks use `primary` for buttons and
 * headlines, so that is what we mirror. To switch the app to true brand blue,
 * change `primary` to `aggieBlue` below — it is the only edit required.
 */

export const colors = {
  // ---- Brand source values (UC Davis) ----
  aggieBlue: '#022851',
  aggieGold: '#FFBF00',

  // ---- Primary ----
  primary: '#00142e',
  onPrimary: '#ffffff',
  primaryContainer: '#022851',
  onPrimaryContainer: '#7490bf',
  primaryFixed: '#d5e3ff',
  primaryFixedDim: '#abc8fa',
  onPrimaryFixed: '#001b3c',
  onPrimaryFixedVariant: '#2a4772',
  inversePrimary: '#abc8fa',

  // ---- Secondary (gold) ----
  secondary: '#795900',
  onSecondary: '#ffffff',
  secondaryContainer: '#ffbf00',
  onSecondaryContainer: '#6d5000',
  secondaryFixed: '#ffdfa0',
  secondaryFixedDim: '#fbbc00',
  onSecondaryFixed: '#261a00',
  onSecondaryFixedVariant: '#5c4300',

  // ---- Tertiary ----
  tertiary: '#131410',
  onTertiary: '#ffffff',
  tertiaryContainer: '#282824',
  onTertiaryContainer: '#908f89',
  tertiaryFixed: '#e5e2db',
  tertiaryFixedDim: '#c9c6c0',
  onTertiaryFixed: '#1c1c18',
  onTertiaryFixedVariant: '#474742',

  // ---- Surfaces ----
  /** Page background. The mocks override the M3 `surface` token with cream. */
  cream: '#FAF7F0',
  surface: '#f8f9ff',
  surfaceDim: '#d3dbe7',
  surfaceBright: '#f8f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eef4ff',
  surfaceContainer: '#e7eefc',
  surfaceContainerHigh: '#e1e9f6',
  surfaceContainerHighest: '#dbe3f0',
  surfaceVariant: '#dbe3f0',
  surfaceTint: '#435f8b',
  inverseSurface: '#29313b',
  inverseOnSurface: '#e9f1fe',

  // ---- Text ----
  onSurface: '#141c25',
  onSurfaceVariant: '#43474f',
  background: '#f8f9ff',
  onBackground: '#141c25',

  // ---- Lines ----
  outline: '#74777f',
  outlineVariant: '#c4c6d0',

  /**
   * ---- Accents (Home nutrient cards) ----
   *
   * The Home mock introduces three Tailwind accent families that are NOT part
   * of the Stitch design system: amber, emerald and rose. They colour the
   * gamified nutrient cards by how "filled" each nutrient is.
   *
   * FLAG FOR REVIEW: the rose family is a red, and the PRD guardrail says red
   * is never used for a nutrition state. On the Home mock rose marks B12 at
   * "Lv.1 / 50% filled" — which is exactly a nutrition state. Built as drawn,
   * but this is the one palette decision worth a deliberate call: either accept
   * red here, or move the low state to a neutral or to gold.
   */
  amber: '#f59e0b',
  amberBorder: '#fde68a',
  amberSurface: '#fffbeb',
  amberText: '#b45309',

  emerald: '#10b981',
  emeraldStrong: '#059669',
  emeraldBorder: '#a7f3d0',
  emeraldSurface: '#ecfdf5',
  emeraldText: '#047857',

  rose: '#f43f5e',
  roseBorder: '#fecdd3',
  roseSurface: '#fff1f2',
  roseText: '#be123c',

  /** Completed-check green used on the Home routine rows (#2E7D5B). */
  checkGreen: '#2E7D5B',

  /** ---- Hairlines and tints the mocks use directly ---- */
  /** Card hairline on cream/white surfaces. */
  hairline: '#E8EBEF',
  /** Blue hairline on the Home header and routine checkboxes. */
  hairlineBlue: '#B8D0E8',
  /** Unchecked checkbox stroke on the quiz tiles. */
  checkboxStroke: '#CBD5E1',
  /** Tinted panel behind selected tiles and the nutrient hero. */
  tintBlue: '#EEF4FA',
  /** Warm panel behind insight and summary cards. */
  tintGold: '#FFF4D6',
  /** Neutral panel, second "Learn more" card on Home. */
  tintNeutral: '#F4F5F7',
  /** Headline ink. Slightly warmer than onSurface; used for titles in mocks. */
  ink: '#0F1720',
  /** Secondary body ink used on the quiz and Q2 helper text. */
  inkMuted: '#4A5563',

  /**
   * Errors only. Per the PRD guardrail, red is NEVER used for a nutrition
   * state — a nutrient gap is gold. Do not reach for this to signal a gap.
   */
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
} as const;

export type ColorToken = keyof typeof colors;
