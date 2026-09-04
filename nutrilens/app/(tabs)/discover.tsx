import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LetterMark } from '../../components/nutrient/LetterMark';
import { Icon } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { NUTRIENTS } from '../../data/nutrients';
import { ARTICLES } from '../../data/progress';
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
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Discover
        </Text>

        <View style={styles.notice}>
          <Icon name="info-outline" size={18} color={colors.onSecondaryContainer} />
          <Text style={styles.noticeText}>
            This tab has no design yet. It lists what the other screens already
            link to so the nav bar has no dead ends.
          </Text>
        </View>

        <Text style={styles.section}>Reading</Text>
        <View style={styles.stack}>
          {ARTICLES.map((article) => (
            <View key={article.id} style={[styles.article, { backgroundColor: article.tint }]}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleMeta}>{article.meta} · not written yet</Text>
            </View>
          ))}
        </View>

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
              <LetterMark letter={nutrient.letter} size={40} />
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
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.tintGold,
  },
  noticeText: {
    ...typography.caption,
    color: colors.ink,
    flex: 1,
  },
  section: {
    ...typography.h3,
    color: colors.primary,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackSm,
  },
  stack: { gap: spacing.stackSm },
  article: {
    padding: 14,
    borderRadius: radius.md,
    gap: spacing.base,
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
