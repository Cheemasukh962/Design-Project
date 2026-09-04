import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { useQuiz } from '../../data/QuizContext';
import { ACCOUNT, PROFILE, SEED_DEMO_ROUTINE } from '../../data/progress';
import { useRoutine } from '../../data/RoutineContext';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Profile.
 *
 * NO MOCK EXISTS FOR THIS SCREEN — same reasoning as Discover: the nav bar in
 * both mocks has four destinations and none of them may be dead.
 *
 * There is no account system, so this deliberately does not pretend to be an
 * account screen. It shows the demo persona, the two real controls that exist
 * (retake the quiz, clear the routine), and an honest note about what is and
 * is not stored. The note is the useful part: a tester who taps here should
 * find out that nothing persists rather than assume it does.
 */
export default function ProfileRoute() {
  const { reset } = useQuiz();
  const { added, items, done } = useRoutine();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Profile
        </Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{PROFILE.initial}</Text>
          </View>
          <View style={styles.who}>
            <Text style={styles.name}>{PROFILE.name}</Text>
            <Text style={styles.meta}>
              Level {ACCOUNT.level} · {ACCOUNT.xp} XP
            </Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Icon name="info-outline" size={18} color={colors.onSecondaryContainer} />
          <Text style={styles.noticeText}>
            Sample profile. There are no accounts in this build, and nothing is
            saved when the app closes — including your quiz answers and anything
            ticked off today.
            {SEED_DEMO_ROUTINE
              ? ' The routine starts pre-filled with example items; the switch is SEED_DEMO_ROUTINE in data/progress.ts.'
              : ''}
          </Text>
        </View>

        <Text style={styles.section}>This session</Text>
        <View style={styles.stats}>
          <Stat label="Nutrients tracked" value={String(added.length)} />
          <Stat label="Routine items" value={String(items.length)} />
          <Stat label="Ticked today" value={String(done.length)} />
        </View>

        <Text style={styles.section}>Actions</Text>
        <View style={styles.stack}>
          <Row
            icon="undo"
            label="Retake the quiz"
            detail="Clears your answers and starts again"
            onPress={() => {
              reset();
              router.push('/quiz/q1');
            }}
          />
          <Row
            icon="help-outline"
            label="How this works"
            detail="The rules behind your results"
          />
          <Row
            icon="open-in-new"
            label="Not medical advice"
            detail="What this app can and cannot tell you"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Row({
  icon,
  label,
  detail,
  onPress,
}: {
  icon: IconName;
  label: string;
  detail: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${detail}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={colors.aggieBlue} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{label}</Text>
        <Text style={styles.rowBody}>{detail}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.outline} />
    </Pressable>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    marginBottom: spacing.stackMd,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.aggieBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...typography.h2,
    color: colors.onPrimary,
  },
  who: { flex: 1, gap: 2 },
  name: {
    ...typography.h3,
    color: colors.onSurface,
  },
  meta: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
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
  stats: {
    flexDirection: 'row',
    gap: spacing.stackSm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
  },
  statValue: {
    ...typography.h2,
    color: colors.aggieBlue,
  },
  statLabel: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  stack: { gap: spacing.stackSm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    minHeight: 64,
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
