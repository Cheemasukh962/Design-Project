import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArticleCard } from '../../components/home/ArticleCard';
import { CompanionCard } from '../../components/home/CompanionCard';
import { GapSummaryCard } from '../../components/home/GapSummaryCard';
import { HomeHeader } from '../../components/home/HomeHeader';
import { NutrientShortcut } from '../../components/home/NutrientShortcut';
import { RoutineTickRow } from '../../components/home/RoutineTickRow';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { useQuiz } from '../../data/QuizContext';
import { DEMO_ANSWERS, hasAnswers, inferFindings } from '../../data/inference';
import { NUTRIENTS } from '../../data/nutrients';
import { ARTICLES, PROFILE } from '../../data/progress';
import { useRoutine } from '../../data/RoutineContext';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Home.
 *
 * Source: Stitch "NutriLens - Home".
 *
 * Everything on this screen is ported from that mock, including the
 * gamification layer — level, XP, quests, "% filled", buff chips. Those values
 * are invented and live in data/progress.ts, which explains what has to happen
 * to them before anyone tests with this build.
 *
 * The order is the mock's, and it is a defensible one: the gold banner is the
 * route back to the result, the nutrient row is the reward, the CTA re-runs the
 * quiz, and the routine sits inline so ticking an item is one tap from a cold
 * open. That last point is the PRD's only hard requirement for Home.
 */
function greeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeRoute() {
  const { answers } = useQuiz();
  const { items, done, toggleDone, added } = useRoutine();

  const tookQuiz = hasAnswers(answers);
  const findings = inferFindings(tookQuiz ? answers : DEMO_ANSWERS);

  const nutrients = tookQuiz
    ? findings.map((f) => f.nutrient)
    : [NUTRIENTS.d, NUTRIENTS.c, NUTRIENTS.b12];

  const hour = new Date().getHours();

  return (
    <Screen padded={false}>
      <HomeHeader
        greeting={greeting(hour)}
        name={PROFILE.name}
        initial={PROFILE.initial}
        onProfile={() => router.push('/profile')}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* First thing on the page: something that has been waiting for you
            reads better on a return visit than a number you already know. */}
        <CompanionCard
          onOpen={() => router.push('/companion')}
          onPick={() => router.push('/starter')}
        />

        <GapSummaryCard
          label={`${findings.length} ${
            findings.length === 1 ? 'nutrient' : 'nutrients'
          } worth a closer look`}
          onPress={() => router.push('/results')}
        />

        {/* ---- Your nutrients ----
            The mock put a level, an XP total and a quest counter here. All of
            it was invented, and once the companion started earning tokens from
            real ticks it was a second, fake progress system sitting a card
            below a real one. The game lives in the companion now. */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Your nutrients</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.railBleed}
          contentContainerStyle={styles.rail}
        >
          {nutrients.map((nutrient) => (
            <NutrientShortcut
              key={nutrient.id}
              nutrient={nutrient}
              inRoutine={added.includes(nutrient.id)}
              onPress={() =>
                router.push({ pathname: '/nutrient/[id]', params: { id: nutrient.id } })
              }
            />
          ))}
        </ScrollView>

        {/* ---- Primary action ---- */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Check my nutrition"
          onPress={() => router.push('/quiz/q1')}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaLabel}>Check my nutrition</Text>
          <Icon name="arrow-forward" size={20} color={colors.onPrimary} />
        </Pressable>

        {/* ---- Today's routine ---- */}
        <View style={styles.routineCard}>
          <View style={styles.routineHead}>
            <Text style={styles.cardTitle}>Today&apos;s routine</Text>
            <Badge
              tone="neutral"
              label={`${items.length} ${items.length === 1 ? 'item' : 'items'}`}
            />
          </View>

          {items.length > 0 ? (
            <View style={styles.routineList}>
              {items.slice(0, 3).map((item) => (
                <RoutineTickRow
                  key={item.id}
                  title={item.title}
                  detail={item.detail}
                  done={done.includes(item.id)}
                  onToggle={() => toggleDone(item.id)}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>
              Nothing added yet. Your results are where this fills up.
            </Text>
          )}
        </View>

        {/* ---- Learn more ---- */}
        <Text style={styles.cardTitle}>Learn more</Text>
        <View style={styles.articles}>
          {ARTICLES.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              meta={article.meta}
              tint={article.tint}
              onPress={() => router.push('/discover')}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.stackSm,
    paddingBottom: spacing.stackLg,
    gap: spacing.stackMd,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.stackSm,
    marginTop: spacing.stackSm,
  },
  headLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    flexShrink: 1,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.aggieBlue,
  },
  // The rail bleeds to both screen edges so a card is visibly cut off and the
  // row reads as scrollable without a scrollbar.
  railBleed: {
    marginHorizontal: -spacing.screenMargin,
  },
  rail: {
    gap: 14,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.base,
  },
  cta: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    borderRadius: radius.md,
    backgroundColor: colors.aggieBlue,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 4,
  },
  ctaPressed: { opacity: 0.9 },
  ctaLabel: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    fontSize: 15,
    color: colors.onPrimary,
  },
  routineCard: {
    padding: 18,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  routineHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.stackMd,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.aggieBlue,
  },
  routineList: { gap: 14 },
  empty: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  articles: {
    flexDirection: 'row',
    gap: spacing.base * 3,
  },
});
