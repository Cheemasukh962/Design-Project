import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBar } from '../../components/ui/AppBar';
import { Icon } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { articleById } from '../../data/articles';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * A reading piece.
 *
 * One route serves both articles, the same way one route serves every nutrient.
 * See data/articles.ts for the three rules the copy is written under — no
 * statistics, no diagnosis, no invented local facts.
 */
export default function ArticleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = articleById(id ?? '');

  if (!article) {
    return (
      <Screen>
        <AppBar title="Not found" onBack={() => router.back()} />
        <Text style={styles.missing}>That piece does not exist.</Text>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <AppBar title="Reading" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.head, { backgroundColor: article.tint }]}>
          <Text style={styles.meta}>{article.meta}</Text>
          <Text style={styles.title} accessibilityRole="header">
            {article.title}
          </Text>
          <Text style={styles.standfirst}>{article.standfirst}</Text>
        </View>

        {article.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.paragraph}>{section.body}</Text>
          </View>
        ))}

        {article.footnote && (
          <View style={styles.footnote}>
            <Icon name="info-outline" size={18} color={colors.ink} />
            <Text style={styles.footnoteText}>{article.footnote}</Text>
          </View>
        )}

        <Text
          accessibilityRole="link"
          onPress={() => router.push('/disclaimer')}
          style={styles.link}
        >
          What this app can and cannot tell you →
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.stackLg,
    gap: spacing.stackMd,
  },
  head: {
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.base,
    marginTop: spacing.stackSm,
  },
  meta: {
    ...typography.micro,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
  },
  title: { ...typography.h1Mobile, color: colors.aggieBlue },
  standfirst: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  section: { gap: spacing.base },
  heading: { ...typography.h3, color: colors.aggieBlue },
  paragraph: { ...typography.bodyMd, color: colors.onSurface },
  footnote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.tintGold,
    marginTop: spacing.stackSm,
  },
  footnoteText: { ...typography.caption, color: colors.ink, flex: 1 },
  link: { ...typography.caption, color: colors.aggieBlue },
  missing: { ...typography.bodyMd, color: colors.onSurfaceVariant },
});
