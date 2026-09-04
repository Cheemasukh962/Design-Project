import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MascotChip } from '../../components/quiz/MascotChip';
import { OptionCard } from '../../components/quiz/OptionCard';
import { QuizHeader } from '../../components/quiz/QuizHeader';
import { Button } from '../../components/ui/Button';
import { InsightCard } from '../../components/ui/InsightCard';
import { Screen } from '../../components/ui/Screen';
import { useQuiz } from '../../data/QuizContext';
import { Q3, TOTAL_STEPS } from '../../data/quiz';
import { colors, spacing, typography } from '../../theme';

/**
 * Quiz question 3 — daylight exposure. Single select.
 *
 * No Stitch mock exists for this screen. It follows Q2's chrome — cream ground,
 * five-dot stepper, mascot chip, 52px CTA — and Q1's single-select rows, since
 * the round radio marker is what distinguishes "one of these" from Q2's square
 * multi-select checkboxes.
 *
 * It earns its step by producing the Vitamin D reason on Results: without an
 * answer here, that finding cannot cite anything the user actually said.
 */
export default function Q3Route() {
  const { answers, setSingle } = useQuiz();
  const selected = answers.outside ?? null;

  return (
    <Screen background="cream">
      <QuizHeader current={3} total={TOTAL_STEPS} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <MascotChip label={Q3.chip} />

        <View style={styles.heading}>
          <Text style={styles.question} accessibilityRole="header">
            {Q3.question}
          </Text>
        </View>

        <View style={styles.options} accessibilityRole="radiogroup">
          {Q3.options.map((option) => (
            <OptionCard
              key={option.id}
              label={option.label}
              selected={selected === option.id}
              onPress={() => setSingle('outside', option.id)}
            />
          ))}
        </View>

        {/* Always visible, as on Q2. It says why we ask, never what a good
            answer looks like — see the priming note in data/quiz.ts. */}
        <View style={styles.insight}>
          <InsightCard>{Q3.insight}</InsightCard>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          shape="rounded"
          disabled={!selected}
          onPress={() => router.push('/quiz/q4')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: spacing.base, paddingBottom: spacing.stackLg },
  heading: { marginTop: spacing.stackMd, marginBottom: spacing.stackLg, gap: 6 },
  question: { ...typography.h1, color: colors.ink },
  options: { gap: spacing.stackMd },
  insight: { marginTop: spacing.stackLg },
  footer: {
    paddingTop: spacing.base * 3,
    paddingBottom: spacing.stackSm,
    backgroundColor: colors.cream,
  },
});
