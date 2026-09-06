/**
 * Colours for the food illustrations, and nowhere else.
 *
 * WHY THIS EXISTS AND WHY IT IS NOT A RETURN TO THE PAINT CHART. The nutrient
 * accents were removed because they were arbitrary: Vitamin D was not orange
 * for any reason, so the colour carried no information and only made the
 * interface loud. Food colour is the opposite — an orange that is not orange is
 * not an orange, and a leaf that is navy is not a leaf. The colour here is
 * describing the object, not labelling a category.
 *
 * It is contained the same way the companion's elemental colours are: these
 * values may only be used INSIDE a FoodMark drawing. The card around it, the
 * plate behind it, the label under it and every other surface stay on the
 * white-and-navy system. So the interface is one colour and only the objects
 * sitting on it vary, which is how an illustration behaves in a restrained
 * layout.
 *
 * All tones are pulled down in chroma from their supermarket versions so they
 * sit beside #022851 without shouting. Each pair is a lit face and a shadow
 * face for the same material.
 */
export const food = {
  /** The tinted plate every food sits on. One value for all of them. */
  plate: '#eef3fb',
  plateEdge: 'rgba(2,40,81,0.06)',

  salmon: { base: '#e39177', deep: '#c26c52', trim: '#f6d3c4' },
  egg: { base: '#f6ead2', deep: '#dfceac', trim: '#e8b04b' },
  milk: { base: '#eaf1fa', deep: '#cdd9e9', trim: '#ffffff' },
  sun: { base: '#f0c25a', deep: '#d8a232', trim: '#fbe6ac' },
  grain: { base: '#dcc08a', deep: '#bda068', trim: '#f3e7cd' },
  citrus: { base: '#eda454', deep: '#d4842f', trim: '#f9d9a8' },
  pepper: { base: '#d4705f', deep: '#b25246', trim: '#7ba36a' },
  greens: { base: '#7ba36a', deep: '#5c8451', trim: '#a8c79a' },
  beans: { base: '#b57b5e', deep: '#92604a', trim: '#d7ab90' },
  meat: { base: '#c4746b', deep: '#a1554f', trim: '#f0dcd2' },
} as const;
