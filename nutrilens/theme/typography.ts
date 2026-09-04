/**
 * Typography — the type scale from the Stitch design system.
 *
 * One family (Inter), two-to-three weights per screen. Sizes and line heights
 * are the exact px values from the design system; RN takes unitless numbers.
 *
 * `letterSpacing` in RN is in points, not em, so the design system's em values
 * are converted here: px * em. (34 * -0.02 = -0.68)
 */

import type { TextStyle } from 'react-native';

/** Font family names registered by @expo-google-fonts/inter. */
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.68,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.28,
  },
  h1Mobile: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 30,
  },
  h2: {
    fontFamily: fontFamily.semibold,
    fontSize: 22,
    lineHeight: 28,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    lineHeight: 24,
  },
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  micro: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.55,
  },
} as const satisfies Record<string, TextStyle>;

export type TypeToken = keyof typeof typography;
