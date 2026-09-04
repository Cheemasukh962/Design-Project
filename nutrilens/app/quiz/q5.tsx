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
 * No Stitch mock exists; authored to Q2's pattern, which is right because this
 * is the same kind of question: recognition over recall, across a grid.
 *
 * This is the segment question. A restriction is the one constraint a user
 * already knows they have, so it is the strongest signal in the quiz — and
 * every option now feeds something downstream (data/restrictions.ts), because
 * asking someone to declare "no fish" and then recommending salmon is worse
 * than never asking.
 *
 * "Nothing in particular" is mutually exclusive with everything else: picking
 * it clears the rest, and picking anything else clears it. Without that, a user
 * can submit "no dairy" AND "nothing in particular", and the inference has to
 * guess which they meant.
 */
export default function Q5Route() {
  const { answers, toggleMulti, setMulti } = useQuiz();
  const selected = answers.restrictions;

  const isNone = selected.includes(Q5.exclusiveId);
  const count = selected.length;

  const pick = (id: string) => {
    // Picking a real restriction clears the exclusive "nothing" answer.
    if (isNone) {
      setMulti('restrictions', [id]);
      return;
    }
    toggleMulti('restrictions', id);
  };

  const pickNone = () => setMulti('restrictions', isNone ? [] : [Q5.exclusiveId]);

  // "Nothing in particular" is an answer, so it counts toward the CTA label —
  // but showing "(1 selected)" for it would be nonsense.
  const realCount = isNone ? 0 : count;

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

        <NotSureCard label={Q5.noneLabel} selected={isNone} onPress={pickNone} />

        <View style={styles.insight}>
          <InsightCard>{Q5.insight}</InsightCard>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={realCount > 0 ? `See my results (${realCount} selected)` : 'See my results'}
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
  question: { ...typography.h1, color: colors.ink },
  helper: { ...typography.bodyMd, color: colors.inkMuted },
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
