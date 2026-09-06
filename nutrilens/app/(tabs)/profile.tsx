import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GrowthTrack } from '../../components/companion/GrowthTrack';
import { Accordion } from '../../components/ui/Accordion';
import { ProfileHero } from '../../components/profile/ProfileHero';
import { Icon, type IconName } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { useQuiz } from '../../data/QuizContext';
import { PROFILE } from '../../data/progress';
import { useWipeAll } from '../../data/storage';
import { useCompanion } from '../../data/CompanionContext';
import { SPECIES } from '../../data/companion';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Profile.
 *
 * NO MOCK EXISTS FOR THIS SCREEN — same reasoning as Discover: the nav bar in
 * both mocks has four destinations and none of them may be dead.
 *
 * There is no account system, so this deliberately does not pretend to be an
 * account screen. It shows the demo persona, the two real controls that exist
 * (retake the quiz, start the pal over), and an honest note about what is and
 * is not stored. The note is the useful part: a tester who taps here should
 * find out that nothing persists rather than assume it does.
 *
 * WHAT "LIFETIME" IS ALLOWED TO MEAN HERE. The old stat row was headed "This
 * session" and counted routine items and ticks. Those numbers are real, but
 * they die on the next launch, and they restate what the Routine tab already
 * shows with a ring and a week strip — the same duplicate-progress problem that
 * was removed from Home. The companion is the only state that survives a
 * relaunch, so it is the only thing that can honestly sit under a heading
 * saying "lifetime". Care is the one current reading in the group, and its
 * label says so.
 */
export default function ProfileRoute() {
  const { reset } = useQuiz();
  const wipeAll = useWipeAll();
  const {
    speciesId,
    tokens,
    care,
    stage,
    reset: resetCompanion,
  } = useCompanion();
  const species = speciesId ? SPECIES[speciesId] : null;

  /**
   * Back to a genuine first run.
   *
   * Needed because the example routine is seeded only when storage is empty,
   * so the seeded state — the one both mocks draw — becomes unreachable the
   * moment anything has been saved. Sending the user back to the splash after
   * the wipe also remounts every provider, which is what makes the cleared
   * state actually appear.
   */
  const onReset = useCallback(() => {
    wipeAll().then(() => {
      reset();
      resetCompanion();
      router.replace('/');
    });
  }, [wipeAll, reset, resetCompanion]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Profile
        </Text>

        <View style={styles.hero}>
          <ProfileHero
            name={PROFILE.name}
            initial={PROFILE.initial}
            onOpen={() => router.push('/companion')}
            onPick={() => router.push('/starter')}
          />
        </View>

        {/* White, not navy. With the hero above it already dark, a second
            dark block made the screen read as navy-white-navy stripes. The
            track switches to brand navy on light so no elemental colour lands
            on a light surface. */}
        <Text style={styles.section}>Lifetime stats</Text>
        <View style={styles.statCard}>
          <View style={styles.stats}>
            <Stat icon="bolt" label="Tokens earned" value={String(tokens)} />
            <Stat icon="auto-awesome" label="Growth stage" value={stage + 1 + "/3"} />
            <Stat icon="favorite-border" label="Care right now" value={Math.round(care) + "%"} />
          </View>

          {speciesId && (
            <GrowthTrack speciesId={speciesId} stage={stage} tokens={tokens} tone="light" />
          )}

          <Text style={styles.statNote}>
            One token for every routine item you tick off. Tokens never go down,
            and re-ticking something does not count twice.
          </Text>
        </View>

        {/* A dropdown, not a grid of tiles.
            Four square tiles fitted on the screen and lost the sentence that
            made each one legible — "Not medical advice" wrapped to two lines
            inside an 80px box, and "New pal" gave no hint that it destroys
            weeks of progress. Collapsed the section costs one line; open, the
            rows have room to say what they do. */}
        <View style={styles.actions}>
          <Accordion title="Actions" meta="5 things">
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

              {species ? (
                <Row
                  icon="person"
                  label={`Start over with ${species.names[stage]}`}
                  detail={`Clears ${tokens} ${tokens === 1 ? 'token' : 'tokens'} and lets you pick again`}
                  onPress={() => {
                    resetCompanion();
                    router.push('/starter');
                  }}
                />
              ) : (
                <Row
                  icon="person"
                  label="Pick your pal"
                  detail="Three to choose from"
                  onPress={() => router.push('/starter')}
                />
              )}

              <Row
                icon="help-outline"
                label="How this works"
                detail="The rules behind your results"
                onPress={() => router.push('/how-it-works')}
              />

              <Row
                icon="open-in-new"
                label="Not medical advice"
                detail="What this app can and cannot tell you"
                onPress={() => router.push('/disclaimer')}
              />

              {/* Everything lives on this device and nothing is uploaded, so
                  the only thing to say about storage is how to clear it. */}
              <Row
                icon="remove"
                label="Reset demo"
                detail="Clears everything stored on this device"
                onPress={onReset}
              />
            </View>
          </Accordion>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Icon name={icon} size={18} color={colors.secondary} />
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
      <View style={styles.rowGlyph}>
        <Icon name={icon} size={18} color={colors.aggieBlue} />
      </View>
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
  hero: { marginBottom: spacing.stackMd },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.tintGold,
  },
  noticeBody: { flex: 1, gap: spacing.stackSm },
  noticeText: {
    ...typography.caption,
    color: colors.ink,
  },
  noticeAction: {
    ...typography.caption,
    fontFamily: typography.h3.fontFamily,
    color: colors.aggieBlue,
  },
  section: {
    ...typography.h3,
    color: colors.primary,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackSm,
  },
  statCard: {
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.stackMd,
    alignItems: 'flex-start',
  },
  stats: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.h2,
    color: colors.aggieBlue,
  },
  statNote: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  reset: {
    ...typography.caption,
    color: colors.outline,
    marginTop: spacing.stackMd,
    textAlign: 'center',
  },
  statLabel: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  actions: { marginTop: spacing.stackSm },
  stack: { gap: spacing.stackSm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
    minHeight: 60,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  rowGlyph: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
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
