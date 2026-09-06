import { StyleSheet, Text, View } from 'react-native';
import type { FoodSource } from '../../data/nutrients';
import { colors, food, radius, spacing, typography } from '../../theme';
import { FoodMark } from './FoodMark';

type Props = {
  source: FoodSource;
};

export const SOURCE_CARD_WIDTH = 158;

/**
 * A "Where to find it" card on the nutrient detail page.
 *
 * The picture leads and the words sit under it. Before this the card opened
 * with a 22px glyph in a 40px tile, which meant the first thing the eye met was
 * a small grey square — and at that size a fish, an egg and a carton of milk
 * are the same small grey square. The object now gets the top two thirds of the
 * card at a size where it is identifiable before you read anything.
 *
 * Order under the picture is deliberate: the food, then the portion. The name
 * is what you scan the rail for; the portion is what you need once you have
 * stopped on one.
 *
 * Amounts stay portion-based — "1 palm-sized fillet", not "85g" — because the
 * point is to be actionable in a dining hall without a scale.
 *
 * The %DV badge is only rendered when there is a figure. Every figure currently
 * in the catalogue came from the mock and is UNVERIFIED; see the header comment
 * in data/nutrients.ts. Leaving the badge off is the correct rendering for a
 * source whose number has not been checked yet.
 */
export function SourceCard({ source }: Props) {
  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={
        `${source.label}. ${source.amount ? `${source.amount}. ` : ''}${source.portion ?? ''}`
      }
    >
      {/* One plate colour for every food, so the rail reads as a set and only
          the objects on it differ. */}
      <View style={styles.plate}>
        <FoodMark kind={source.art} size={104} />
        {source.amount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{source.amount}</Text>
          </View>
        )}
      </View>

      <View style={styles.text}>
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
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    overflow: 'hidden',
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  plate: {
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: food.plate,
    borderBottomWidth: 1,
    borderBottomColor: food.plateEdge,
  },
  badge: {
    position: 'absolute',
    top: spacing.stackSm,
    right: spacing.stackSm,
    paddingHorizontal: spacing.stackSm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
  },
  badgeText: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
    color: colors.aggieBlue,
  },
  text: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 2,
  },
  label: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: colors.onSurface,
  },
  portion: {
    ...typography.caption,
    color: colors.outline,
  },
});
