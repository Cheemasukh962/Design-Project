import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MascotChip } from '../../components/quiz/MascotChip';
import { OptionCard } from '../../components/quiz/OptionCard';
import { QuizHeader } from '../../components/quiz/QuizHeader';
import { Button } from '../../components/ui/Button';
import { InsightCard } from '../../components/ui/InsightCard';
import { Screen } from '../../components/ui/Screen';
import { useQuiz } from '../../data/QuizContext';
import { Q4, TOTAL_STEPS } from '../../data/quiz';
import { colors, spacing, typography } from '../../theme';

/**
 * Quiz question 4 — fruit and vegetable frequency. Single select.
 *
 * No Stitch mock exists; it follows Q3's pattern exactly, which is the point —
 * two consecutive single-select questions that differ visually would read as a
 * change of subject rather than a change of question.
 *
 * It earns its step by producing the Vitamin C reason on Results.
 */
export default function Q4Route() {
  const { answers, setSingle } = useQuiz();
  const selected = answers.produce ?? null;

  return (
    <Screen background="cream">
      <QuizHeader current={4} total={TOTAL_STEPS} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <MascotChip label={Q4.chip} />

        <View style={styles.heading}>
          <Text style={styles.question} accessibilityRole="header">
            {Q4.question}
          </Text>
        </View>

        <View style={styles.options} accessibilityRole="radiogroup">
          {Q4.options.map((option) => (
            <OptionCard
              key={option.id}
              label={option.label}
              selected={selected === option.id}
              onPress={() => setSingle('produce', option.id)}
            />
          ))}
        </View>

        <View style={styles.insight}>
          <InsightCard>{Q4.insight}</InsightCard>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          shape="rounded"
          disabled={!selected}
          onPress={() => router.push('/quiz/q5')}
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
