/**
 * Corner radius — from the Stitch design system.
 *
 * Radius carries hierarchy: do not apply one value everywhere. Small controls
 * take `sm`, cards take `md`, hero surfaces take `lg`, and pills and avatars
 * take `full`.
 *
 * MAPPING FROM THE MOCKS. The Tailwind config in the exported HTML overrides
 * Tailwind's defaults, so the class names do NOT mean their usual sizes. When
 * porting a mock, translate with this table rather than by eye:
 *
 *   rounded        0.25rem   4px    -> radius.sm
 *   rounded-lg     0.5rem    8px    -> radius.base
 *   rounded-xl     0.75rem  12px    -> radius.md      (the standard card)
 *   rounded-2xl    (default) 16px   -> radius.lg      (Q2 option tiles)
 *   rounded-full   9999px          -> radius.full
 *
 * `rounded-xl` is by far the most common class in the mocks and is 12px, not
 * the 24px Tailwind would normally give it. Getting this wrong makes every
 * card look inflated.
 */

export const radius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
