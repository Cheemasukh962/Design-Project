import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MascotChip } from '../../components/quiz/MascotChip';
import { OptionCard } from '../../components/quiz/OptionCard';
import { QuizHeader } from '../../components/quiz/QuizHeader';
import { Button } from '../../components/ui/Button';
import { Screen } from '../../components/ui/Screen';
import { useQuiz } from '../../data/QuizContext';
import { Q1, TOTAL_STEPS } from '../../data/quiz';
import { spacing, typography } from '../../theme';

/**
 * Quiz question 1 — eating pattern. Single select.
 *
 * Source: Stitch "Quiz - Question 1"
 * (projects/18215832420737560579/screens/ccefd48ab1904fef9fa48dec2b651ad2)
 *
 * HARMONISED TO Q2. Q1 and Q2 came from different Stitch batches and disagreed
 * on page colour (#f8f9ff vs cream), stepper length (3 vs 5), fill (#00142e vs
 * Aggie Blue) and CTA shape (pill vs 52px/12px). Ported as drawn they read as
 * two different apps one tap apart. Q2 is newer, uses true brand blue, and
 * matches the five-question spec, so it wins. To restore Q1's own treatment,
 * put back `backgroundColor: colors.background` and drop `shape="rounded"`.
 */
export default function Q1Route() {
  const { answers, setSingle } = useQuiz();
  const selected = answers.eating ?? null;

  return (
    <Screen>
      <QuizHeader current={1} total={TOTAL_STEPS} onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <MascotChip label={Q1.chip} />

        <Text style={styles.question} accessibilityRole="header">
          {Q1.question}
        </Text>

        <View style={styles.options} accessibilityRole="radiogroup">
          {Q1.options.map((option) => (
            <OptionCard
              key={option.id}
              label={option.label}
              selected={selected === option.id}
              onPress={() => setSingle('eating', option.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          shape="rounded"
          disabled={selected === null}
          onPress={() => router.push('/quiz/q2')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: spacing.stackLg,
    paddingBottom: spacing.stackLg,
  },
  question: {
    ...typography.h1,
    color: '#0F1720',
    marginTop: spacing.stackLg,
    marginBottom: spacing.base * 8,
  },
  options: {
    gap: spacing.stackMd,
  },
  footer: {
    paddingTop: spacing.stackLg,
    paddingBottom: spacing.base,
  },
});
