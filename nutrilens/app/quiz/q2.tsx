import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MascotChip } from '../../components/quiz/MascotChip';
import { NotSureCard } from '../../components/quiz/NotSureCard';
import { OptionTile } from '../../components/quiz/OptionTile';
import { QuizHeader } from '../../components/quiz/QuizHeader';
import { Button } from '../../components/ui/Button';
import { InsightCard } from '../../components/ui/InsightCard';
import { Screen } from '../../components/ui/Screen';
import { useQuiz } from '../../data/QuizContext';
import { Q2, TOTAL_STEPS } from '../../data/quiz';
import { colors, spacing, typography } from '../../theme';

/**
 * Quiz question 2 — food sources. Multi select, and the highest-signal
 * question in the flow: it is what drives the B12 / iron / calcium inference.
 *
 * Source: Stitch "Quiz - Question 2 (Multi-select)"
 * (projects/18215832420737560579/screens/440ce1631b4a435fa5c2703181605dbf)
 *
 * Multi-select needs an explicit Continue — auto-advancing on tap would make it
 * impossible to pick a second answer. The live count in the label is what tells
 * the user their taps registered.
 */
export default function Q2Route() {
  const { answers, toggleMulti } = useQuiz();
  const selected = answers.foods;
  const count = selected.length;

  return (
    <Screen>
      <QuizHeader current={2} total={TOTAL_STEPS} onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <MascotChip label={Q2.chip} />

        <View style={styles.heading}>
          <Text style={styles.question} accessibilityRole="header">
            {Q2.question}
          </Text>
          <Text style={styles.helper}>{Q2.helper}</Text>
        </View>

        <View style={styles.grid}>
          {Q2.options.map((option) => (
            <View key={option.id} style={styles.cell}>
              <OptionTile
                label={option.label}
                icon={option.icon}
                selected={selected.includes(option.id)}
                onPress={() => toggleMulti('foods', option.id)}
              />
            </View>
          ))}
        </View>

        <NotSureCard onPress={() => router.push('/quiz/q3')} />

        <View style={styles.insight}>
          <InsightCard>{Q2.insight}</InsightCard>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={count > 0 ? `Continue (${count} selected)` : 'Continue'}
          trailingIcon="arrow-forward"
          shape="rounded"
          disabled={count === 0}
          onPress={() => router.push('/quiz/q3')}
        />
      </View>
    </Screen>
  );
}

const GUTTER = spacing.base * 3;

const styles = StyleSheet.create({
  body: {
    paddingTop: spacing.base,
    paddingBottom: spacing.stackLg,
  },
  heading: {
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackLg,
    gap: 6,
  },
  question: {
    ...typography.h1,
    color: '#0F1720',
  },
  helper: {
    ...typography.bodyMd,
    color: '#4A5563',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GUTTER / 2,
    marginBottom: GUTTER,
  },
  cell: {
    width: '50%',
    paddingHorizontal: GUTTER / 2,
    paddingBottom: GUTTER,
  },
  insight: {
    marginTop: spacing.stackMd,
  },
  footer: {
    paddingTop: spacing.base * 3,
    paddingBottom: spacing.stackSm,
    backgroundColor: colors.surface,
  },
});
