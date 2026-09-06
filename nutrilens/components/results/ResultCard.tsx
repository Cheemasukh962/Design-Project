import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Finding } from '../../data/inference';
import { pillFor, type FoodSource } from '../../data/nutrients';
import { colors, radius, spacing, typography } from '../../theme';
import { FoodChip } from '../nutrient/FoodChip';
import { Icon } from '../ui/Icon';
import { PillMark } from '../nutrient/PillMark';

type Props = {
  finding: Finding;
  /**
   * Food sources already filtered against the user's Q5 restrictions, so this
   * card never suggests something they told us they do not eat. Passed in
   * rather than derived here to keep the card presentational.
   */
  foods: FoodSource[];
  onOpen: () => void;
};

/**
 * One result card.
 *
 * Ported from the Results mock: nutrient name at h2 in brand blue, a plain
 * description, then the food-source pills.
 *
 * ONE ADDITION TO THE MOCK — the "Why this is here" line. The mock shows only
 * the generic description ("Crucial for bone health and immune support"), which
 * is true of the nutrient but says nothing about this person. The research this
 * project is built on found that people reject nutrition advice on relevance
 * rather than accuracy, and an earlier spec required the reason line, so
 * dropping it looked like a regression rather than a decision.
 *
 * It is added rather than substituted: the description stays exactly where the
 * mock puts it, and the reason sits underneath in a quieter register. If it is
 * genuinely unwanted, deleting the `reason` block below is the whole change.
 *
 * Note what is still absent: no percentage, no meter, no confidence score.
 * Nothing was measured, so nothing here may look measured.
 *
 * The mark is a pill, not a letter, and the card is white with a navy heading.
 * Colour was doing identity work here — a wash, then an edge, in one of five
 * hues — and it made the page look like a paint chart. Shape carries it now:
 * capsule, tablet or softgel. See components/nutrient/PillMark.
 */
export function ResultCard({ finding, foods, onOpen }: Props) {
  const { nutrient, reason } = finding;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${nutrient.name}. ${nutrient.summary} ${reason}`}
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.head}>
        <PillMark shape={pillFor(nutrient.id)} size={44} />
        <Text style={styles.name}>{nutrient.name}</Text>
        <Icon name="chevron-right" size={20} color={colors.outline} />
      </View>

      <Text style={styles.summary}>{nutrient.summary}</Text>

      <View style={styles.reason}>
        <Icon name="info-outline" size={16} color={colors.onSecondaryContainer} />
        <Text style={styles.reasonText}>{reason}</Text>
      </View>

      <View style={styles.chips}>
        {foods.length > 0 ? (
          foods
            .slice(0, 3)
            .map((food) => (
              <FoodChip key={food.label} label={food.label} icon={food.icon} />
            ))
        ) : (
          // Every common source is excluded by what they told us in Q5. Saying
          // so is more useful than an empty row, and more honest than showing a
          // food they already ruled out.
          <Text style={styles.noFoods}>
            Your restrictions rule out the usual sources — open this for the
            alternatives.
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.cardPaddingSm,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.stackSm,
    shadowColor: '#435f8b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  pressed: { backgroundColor: '#FCFDFF' },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
  },
  name: {
    ...typography.h2,
    color: colors.aggieBlue,
    flex: 1,
  },
  summary: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  reason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: spacing.stackSm + spacing.base,
    borderRadius: radius.base,
    backgroundColor: colors.tintGold,
  },
  reasonText: {
    ...typography.caption,
    color: colors.ink,
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
  },
  noFoods: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
});
