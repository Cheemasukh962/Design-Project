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
import { Q5, TOTAL_STEPS } from '../../data/quiz';
import { colors, spacing, typography } from '../../theme';

/**
 * Quiz question 5 — dietary restrictions. Multi select.
 *
 * No Stitch mock exists; authored to Q2's pattern. This is the segment
 * question — a restriction is the one constraint a user already knows they
 * have, so it is the strongest signal in the whole quiz.
 *
 * "Nothing in particular" is mutually exclusive with everything else: picking
 * it clears the rest, and picking anything else clears it. Without that, a
 * user can submit "no dairy" *and* "nothing in particular" and the inference
 * has to guess which they meant.
 */
export default function Q5Route() {
  const { answers, toggleMulti, setMulti } = useQuiz();
  const selected = answers.restrictions;

  const isNone = selected.includes(Q5.exclusiveId);
  const count = selected.length;

  const pick = (id: string) => {
    if (isNone) {
      setMulti('restrictions', [id]);
      return;
    }
    toggleMulti('restrictions', id);
  };

  const pickNone = () =>
    setMulti('restrictions', isNone ? [] : [Q5.exclusiveId]);

  return (
    <Screen background="cream">
      <QuizHeader current={5} total={TOTAL_STEPS} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <MascotChip label={Q5.chip} />

        <View style={styles.heading}>
          <Text style={styles.question} accessibilityRole="header">
            {Q5.question}
          </Text>
          <Text style={styles.helper}>{Q5.helper}</Text>
        </View>

        <View style={styles.grid}>
          {Q5.options.map((option) => (
            <View key={option.id} style={styles.cell}>
              <OptionTile
                label={option.label}
                icon={option.icon}
                selected={!isNone && selected.includes(option.id)}
                onPress={() => pick(option.id)}
              />
            </View>
          ))}
        </View>

        <NotSureCard label={Q5.noneLabel} onPress={pickNone} />

        {count > 0 && (
          <View style={styles.insight}>
            <InsightCard>{Q5.insight}</InsightCard>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="See my results"
          trailingIcon="arrow-forward"
          shape="rounded"
          disabled={count === 0}
          onPress={() => router.push('/results')}
        />
      </View>
    </Screen>
  );
}

const GUTTER = spacing.base * 3;

const styles = StyleSheet.create({
  body: { paddingTop: spacing.base, paddingBottom: spacing.stackLg },
  heading: { marginTop: spacing.stackMd, marginBottom: spacing.stackLg, gap: 6 },
  question: { ...typography.h1, color: '#0F1720' },
  helper: { ...typography.bodyMd, color: '#4A5563' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GUTTER / 2,
    marginBottom: GUTTER,
  },
  cell: { width: '50%', paddingHorizontal: GUTTER / 2, paddingBottom: GUTTER },
  insight: { marginTop: spacing.stackMd },
  footer: {
    paddingTop: spacing.base * 3,
    paddingBottom: spacing.stackSm,
    backgroundColor: colors.cream,
  },
});
