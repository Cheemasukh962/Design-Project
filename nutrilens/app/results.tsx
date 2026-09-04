import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ResultCard } from '../components/results/ResultCard';
import { BrandBar } from '../components/ui/BrandBar';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Screen } from '../components/ui/Screen';
import { Toast } from '../components/ui/Toast';
import { useQuiz } from '../data/QuizContext';
import { DEMO_ANSWERS, hasAnswers, inferFindings } from '../data/inference';
import { ALLERGY_CAVEAT, applyRestrictions, hasAllergyFlag } from '../data/restrictions';
import { useRoutine } from '../data/RoutineContext';
import { colors, radius, spacing, typography } from '../theme';

/**
 * Results — the payoff screen, and the most important one in the app.
 *
 * Source: Stitch "NutriLens - Results".
 *
 * Ported as drawn: brand bar, a 34px display headline, the gold summary card
 * with Vito, then one white card per nutrient, two stacked pill CTAs and the
 * disclaimer.
 *
 * TWO DEPARTURES, both about numbers rather than layout:
 *
 * 1. The mock's disclaimer reads "an estimate from 3 questions" while the quiz
 *    stepper promises five. The count is derived from the answers actually
 *    given, so the two can never disagree again.
 *
 * 2. The summary card says "These 3 nutrients" in the mock. Also derived —
 *    inferFindings caps at three but can return fewer, and a hardcoded three
 *    would be wrong for anyone whose answers produce one or two.
 *
 * The reason line added to each card is explained in components/results/ResultCard.
 */
export default function ResultsRoute() {
  const { answers } = useQuiz();
  const { added, add, remove } = useRoutine();
  const [toast, setToast] = useState<{ ids: string[]; label: string } | null>(null);

  // Someone can arrive here without taking the quiz — from Home, or a deep
  // link. Rather than an empty screen, fall back to the demo persona and say so.
  const tookQuiz = hasAnswers(answers);
  const effective = tookQuiz ? answers : DEMO_ANSWERS;

  const findings = useMemo(() => inferFindings(effective), [effective]);

  const answered = [
    effective.eating,
    effective.foods.length ? 'foods' : undefined,
    effective.outside,
    effective.produce,
    effective.restrictions.length ? 'restrictions' : undefined,
  ].filter(Boolean).length;

  const allAdded = findings.every((f) => added.includes(f.nutrient.id));

  const handleAddAll = () => {
    if (allAdded) {
      router.push('/routine');
      return;
    }
    const fresh = findings.map((f) => f.nutrient.id).filter((id) => !added.includes(id));
    fresh.forEach(add);
    setToast({
      ids: fresh,
      label: `${fresh.length} added to your routine`,
    });
  };

  return (
    <Screen>
      <BrandBar mark="photo" />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.headline} accessibilityRole="header">
          Here&apos;s what we found
        </Text>

        <View style={styles.summary}>
          <Image
            source={require('../assets/brand/vito-avatar.png')}
            style={styles.summaryAvatar}
            resizeMode="cover"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <View style={styles.summaryText}>
            <Text style={styles.summaryLead}>Based on your answers,</Text>
            <Text style={styles.summaryBody}>
              {findings.length === 1
                ? 'this nutrient may be worth your time.'
                : `these ${findings.length} nutrients may be worth your time.`}
            </Text>
          </View>
        </View>

        <View style={styles.cards}>
          {findings.map((finding) => (
            <ResultCard
              key={finding.nutrient.id}
              finding={finding}
              foods={applyRestrictions(finding.nutrient.foods, effective.restrictions)}
              onOpen={() =>
                router.push({
                  pathname: '/nutrient/[id]',
                  params: { id: finding.nutrient.id },
                })
              }
            />
          ))}
        </View>

        {/* Food allergies is the one Q5 answer we cannot act on — we never
            asked which ones, and guessing would be dangerous. So it changes
            what we say rather than what we recommend. */}
        {hasAllergyFlag(effective.restrictions) && (
          <View style={styles.caveat}>
            <Icon name="info-outline" size={18} color={colors.onSecondaryContainer} />
            <Text style={styles.caveatText}>{ALLERGY_CAVEAT}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            label={allAdded ? 'Go to my routine' : 'Add these to my routine'}
            onPress={handleAddAll}
          />
          <Button
            label="Go to home"
            variant="outline"
            onPress={() => router.replace('/home')}
          />
        </View>

        <Text style={styles.disclaimer}>
          {tookQuiz
            ? `This is an estimate from ${answered} ${answered === 1 ? 'question' : 'questions'}, not a blood test. Talk to a doctor or Student Health about anything that is actually bothering you.`
            : 'This is the example profile, not your answers. Take the quiz to get your own — and talk to a doctor or Student Health about anything that is actually bothering you.'}
        </Text>
      </ScrollView>

      {toast && (
        <Toast
          message={toast.label}
          actionLabel="Undo"
          onAction={() => {
            toast.ids.forEach(remove);
            setToast(null);
          }}
          onHide={() => setToast(null)}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: spacing.stackLg,
    paddingBottom: spacing.base * 10,
  },
  headline: {
    ...typography.display,
    color: colors.primary,
    marginBottom: spacing.stackLg,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.cardPaddingSm,
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    backgroundColor: colors.secondaryFixed,
    marginBottom: spacing.stackLg,
    shadowColor: '#435f8b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
    backgroundColor: colors.surfaceContainerLowest,
  },
  summaryText: { flex: 1, gap: spacing.base },
  summaryLead: {
    ...typography.h3,
    color: colors.onSecondaryFixed,
  },
  summaryBody: {
    ...typography.bodyMd,
    color: colors.onSecondaryFixed,
    opacity: 0.8,
  },
  cards: { gap: spacing.stackMd },
  caveat: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    marginTop: spacing.stackMd,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.tintGold,
  },
  caveatText: {
    ...typography.caption,
    color: colors.ink,
    flex: 1,
  },
  actions: {
    marginTop: spacing.stackLg,
    gap: spacing.stackMd,
  },
  disclaimer: {
    // Not fine print. The mock sets this at 70% opacity; kept at full body
    // colour instead, because the PRD requires the limits of the estimate to be
    // as legible as the estimate itself.
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.stackLg,
  },
});
