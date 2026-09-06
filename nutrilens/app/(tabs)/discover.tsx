import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../../components/brand/Logo';
import { PillMark } from '../../components/nutrient/PillMark';
import { Accordion } from '../../components/ui/Accordion';
import { Icon } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { NUTRIENTS, pillFor } from '../../data/nutrients';
import { ARTICLES } from '../../data/articles';
import { useSaved } from '../../data/SavedContext';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Discover.
 *
 * NO MOCK EXISTS FOR THIS SCREEN. It is in the build because the nav bar in
 * both the Home and Routine mocks has four destinations, and shipping the bar
 * with two of them dead would change the design rather than implement it.
 *
 * So this is the minimum honest version: the two "Learn more" titles Home
 * already points at, and an index into the nutrient pages that already exist.
 * It invents no content — the article cards say plainly that nothing is written
 * yet rather than opening a blank page.
 *
 * Whoever owns the visual design should treat this as a placeholder, not a
 * proposal.
 */
export default function DiscoverRoute() {
  const { saved } = useSaved();
  // Widened from the literal tuple length, so the singular branch below stays
  // reachable once there is more (or less) than the two placeholder pieces.
  const readingCount: number = ARTICLES.length;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Discover
        </Text>

        {/* Was a grey box apologising for the tab. A tab that opens by
            apologising teaches the reader to skip it, and the contents below
            are real: two written pieces and every nutrient page. */}
        <View style={styles.brand}>
          <Logo size={30} />
          <Text style={styles.brandLine}>
            Everything worth reading, and every nutrient we cover.
          </Text>
        </View>

        {/* Collapsed by default. Nothing in here is written yet, so a stack of
            unfinished cards was the first thing the tab showed and the nutrient
            index — the only part that goes anywhere — was pushed below it. */}
        <View style={styles.reading}>
          <Accordion
            title="Reading"
            meta={`${readingCount} ${readingCount === 1 ? 'piece' : 'pieces'}`}
          >
            <View style={styles.stack}>
              {ARTICLES.map((article) => (
                <Pressable
                  key={article.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${article.title}. ${article.meta}.`}
                  onPress={() =>
                    router.push({ pathname: '/article/[id]', params: { id: article.id } })
                  }
                  style={({ pressed }) => [
                    styles.article,
                    { backgroundColor: article.tint },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleMeta}>{article.meta}</Text>
                </Pressable>
              ))}
            </View>
          </Accordion>
        </View>

        {saved.length > 0 && (
          <>
            <Text style={styles.section}>Saved</Text>
            <View style={styles.stack}>
              {saved
                .map((sid) => NUTRIENTS[sid])
                .filter(Boolean)
                .map((nutrient) => (
                  <Pressable
                    key={nutrient.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${nutrient.name}. Saved.`}
                    onPress={() =>
                      router.push({ pathname: '/nutrient/[id]', params: { id: nutrient.id } })
                    }
                    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                  >
                    <PillMark shape={pillFor(nutrient.id)} size={44} />
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle}>{nutrient.name}</Text>
                      <Text style={styles.rowBody} numberOfLines={2}>
                        {nutrient.summary}
                      </Text>
                    </View>
                    <Icon name="favorite-border" size={20} color={colors.aggieBlue} />
                  </Pressable>
                ))}
            </View>
          </>
        )}

        <Text style={styles.section}>Nutrients</Text>
        <View style={styles.stack}>
          {Object.values(NUTRIENTS).map((nutrient) => (
            <Pressable
              key={nutrient.id}
              accessibilityRole="button"
              accessibilityLabel={`${nutrient.name}. ${nutrient.summary}`}
              onPress={() =>
                router.push({ pathname: '/nutrient/[id]', params: { id: nutrient.id } })
              }
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <PillMark shape={pillFor(nutrient.id)} size={44} />
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{nutrient.name}</Text>
                <Text style={styles.rowBody} numberOfLines={2}>
                  {nutrient.summary}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.outline} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.stackLg,
  },
  title: {
    ...typography.h1Mobile,
    color: colors.primary,
    marginBottom: spacing.stackMd,
  },
  brand: {
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  brandLine: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  section: {
    ...typography.h3,
    color: colors.primary,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackSm,
  },
  reading: { marginTop: spacing.stackLg },
  stack: { gap: spacing.stackSm },
  article: {
    padding: 14,
    borderRadius: radius.md,
    gap: spacing.base,
    // Nested inside the Reading panel, one of the article tints is within a
    // shade of the panel's own ground and the card loses its edge entirely.
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  articleTitle: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: colors.aggieBlue,
  },
  articleMeta: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  pressed: { backgroundColor: '#FCFDFF' },
  rowText: { flex: 1, gap: 2 },
  rowTitle: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: colors.onSurface,
  },
  rowBody: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
});
