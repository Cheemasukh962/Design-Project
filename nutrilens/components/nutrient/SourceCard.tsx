import { StyleSheet, Text, View } from 'react-native';
import type { FoodSource } from '../../data/nutrients';
import { NEUTRAL_ACCENT, colors, radius, spacing, typography, type Accent } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  source: FoodSource;
  /** The nutrient's identity colour — see theme/accents.ts. */
  accent?: Accent;
};

export const SOURCE_CARD_WIDTH = 176;

/**
 * A "Where to find it" card on the nutrient detail page.
 *
 * Amounts are portion-based — "1 palm-sized fillet", not "85g" — because the
 * point is to be actionable in a dining hall without a scale.
 *
 * The %DV badge is only rendered when there is a figure. Every figure currently
 * in the catalogue came from the mock and is UNVERIFIED; see the header comment
 * in data/nutrients.ts. Leaving the badge off is the correct rendering for a
 * source whose number has not been checked yet.
 */
export function SourceCard({ source, accent = NEUTRAL_ACCENT }: Props) {
  return (
    <View style={styles.card} accessibilityLabel={
      `${source.label}. ${source.amount ? `${source.amount}. ` : ''}${source.portion ?? ''}`
    }>
      <View style={styles.top}>
        <View style={[styles.iconTile, { backgroundColor: accent.surface }]}>
          <Icon name={source.icon} size={22} color={accent.base} />
        </View>
        {source.amount && (
          <View style={[styles.badge, { backgroundColor: accent.surface }]}>
            <Text style={[styles.badgeText, { color: accent.text }]}>{source.amount}</Text>
          </View>
        )}
      </View>

      <View>
        <Text style={styles.label} numberOfLines={2}>
          {source.label}
        </Text>
        {source.portion && (
          <Text style={styles.portion} numberOfLines={2}>
            {source.portion}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SOURCE_CARD_WIDTH,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(196,198,208,0.2)',
    justifyContent: 'space-between',
    gap: spacing.base * 3,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: spacing.stackSm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
  },
  label: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: colors.onSurface,
  },
  portion: {
    ...typography.caption,
    color: colors.outline,
    marginTop: 2,
  },
});
