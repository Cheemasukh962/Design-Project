import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import type { OpaqueColorValue } from 'react-native';

/**
 * The mocks are drawn with Google's Material Symbols. @expo/vector-icons ships
 * MaterialIcons, which covers all but one of the glyphs we need — `nutrition`
 * exists only in MaterialCommunityIcons. This wrapper hides that split so
 * screens name an icon once and never pick a font set.
 *
 * Names here are the Material Symbols names from the mocks, kebab-cased.
 */
export type IconName =
  // ---- navigation & chrome ----
  | 'arrow-back'
  | 'arrow-forward'
  | 'arrow-forward-ios'
  | 'chevron-right'
  | 'expand-less'
  | 'more-vert'
  | 'notifications'
  | 'notifications-active'
  | 'notifications-none'
  | 'expand-more'
  | 'alarm'
  | 'home'
  | 'explore'
  | 'calendar-today'
  | 'person'
  | 'favorite-border'
  | 'open-in-new'
  | 'storefront'
  // ---- state & feedback ----
  | 'add'
  | 'add-circle'
  | 'check'
  | 'check-circle'
  | 'remove'
  | 'undo'
  | 'help-outline'
  | 'info-outline'
  | 'lightbulb'
  | 'auto-awesome'
  | 'format-quote'
  | 'insights'
  | 'biotech'
  // ---- gamification / progress ----
  | 'bolt'
  | 'stars'
  | 'verified'
  | 'shield'
  | 'fitness-center'
  | 'local-fire-department'
  // ---- mascot & brand ----
  | 'smart-toy'
  | 'emoji-people'
  // ---- food & nutrient sources ----
  | 'bakery-dining'
  | 'eco'
  | 'egg'
  | 'egg-alt'
  | 'grain'
  | 'light-mode'
  | 'local-florist'
  | 'fruit-citrus'
  | 'chili-mild'
  | 'restaurant'
  | 'set-meal'
  | 'spa'
  | 'water-drop'
  | 'wb-sunny'
  | 'wb-twilight'
  | 'checklist';

/**
 * Glyphs that must come from MaterialCommunityIcons instead.
 *
 * MaterialIcons has no produce at all — its `nutrition` symbol is a packaged
 * food label, which read as a barcode at 22px on the nutrient cards. The
 * Community set has the actual fruit and vegetable glyphs.
 *
 * `egg` is here for the same reason: the MaterialIcons version is a rounded
 * blob that was indistinguishable from `water-drop` at 22px, so Eggs and Dairy
 * appeared as the same icon side by side on the Vitamin B12 page.
 */
const COMMUNITY = new Set<IconName>(['fruit-citrus', 'chili-mild', 'egg']);

type Props = {
  name: IconName;
  size?: number;
  color?: string | OpaqueColorValue;
};

export function Icon({ name, size = 24, color }: Props) {
  if (COMMUNITY.has(name)) {
    return <MaterialCommunityIcons name={name as never} size={size} color={color} />;
  }
  return <MaterialIcons name={name as never} size={size} color={color} />;
}
