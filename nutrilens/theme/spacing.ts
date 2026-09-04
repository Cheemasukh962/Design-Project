/**
 * Spacing — the named tokens from the Stitch design system, on a 4px base.
 * Use the named tokens (screenMargin, stackMd) in layout code rather than the
 * raw scale, so intent survives a redesign.
 */

export const spacing = {
  /** 4px baseline grid. Multiply for one-off values: base * 3 === 12. */
  base: 4,

  /** 20px margin held on every screen edge. */
  screenMargin: 20,

  /** Standard informational card padding. */
  cardPaddingSm: 16,
  /** Hero / high-priority card padding. */
  cardPaddingLg: 20,

  /** Vertical rhythm between stacked elements. */
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
} as const;

/**
 * Elevation — three levels only, tinted with the brand blue rather than a
 * neutral gray. RN needs both the iOS shadow* props and the Android elevation.
 */
export const elevation = {
  /** Flat. Separation comes from the page ground behind a white card. */
  e0: {},
  /** Standard interactive card. */
  e1: {
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  /** Sheets, sticky CTA bars, floating elements. */
  e2: {
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
