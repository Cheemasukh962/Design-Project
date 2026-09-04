import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CareMeter } from '../components/companion/CareMeter';
import { Creature } from '../components/companion/Creature';
import { Icon } from '../components/ui/Icon';
import { Screen } from '../components/ui/Screen';
import {
  SPECIES,
  STAGE_THRESHOLDS,
  moodLine,
  stageProgress,
  tokensToNextStage,
} from '../data/companion';
import { useCompanion } from '../data/CompanionContext';
import { companion } from '../theme/companion';
import { radius, spacing, typography } from '../theme';

/**
 * The companion screen — the game half of the product, kept behind its own
 * dark ground so its three elemental hues never sit on the same surface as the
 * health app's colour language.
 *
 * Everything shown here is derived from something the user actually did:
 * tokens come only from ticked routine items, care responds only to whether
 * they ticked anything today. There is no invented XP on this screen, which
 * is the difference between this and the placeholder layer still sitting on
 * Home (see data/progress.ts).
 */
export default function CompanionRoute() {
  const {
    hydrated,
    speciesId,
    tokens,
    care,
    stage,
    mood,
    pendingEvolution,
    acknowledgeEvolution,
  } = useCompanion();

  // Hold a blank night ground until storage is read, so the screen never
  // flashes the "no buddy" state at someone who already has one.
  if (!hydrated) {
    return (
      <Screen background="night">
        <View />
      </Screen>
    );
  }

  if (!speciesId) {
    return (
      <Screen background="night">
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No buddy yet</Text>
          <Text style={styles.emptyBody}>
            Pick one and it starts growing with your routine.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/starter')}
            style={styles.emptyCta}
          >
            <Text style={styles.emptyCtaLabel}>Pick your buddy</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const species = SPECIES[speciesId];
  const name = species.names[stage];
  const progress = stageProgress(tokens);
  const toNext = tokensToNextStage(tokens);
  const maxed = stage === 2;

  return (
    <Screen background="night">
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Icon name="arrow-back" size={24} color={companion.onNight} />
        </Pressable>
        <Text style={styles.barTitle}>Your buddy</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.stage}>
          <Creature species={speciesId} stage={stage} mood={mood} size={220} />
        </View>

        <Text style={[styles.name, { color: species.palette.accent }]}>{name}</Text>
        <Text style={styles.stageLabel}>
          {maxed ? 'Fully grown' : `Stage ${stage + 1} of 3`} · {species.personality}
        </Text>
        <Text style={styles.mood}>{moodLine(speciesId, mood)}</Text>

        {/* ---- Care and tokens ---- */}
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <CareMeter care={care} fill={species.palette.base} />
          </View>
          <View style={styles.statCard}>
            <View style={styles.tokenRow}>
              <Icon name="bolt" size={22} color={species.palette.accent} />
              <View>
                <Text style={styles.statValue}>{tokens}</Text>
                <Text style={styles.statLabel}>Tokens</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ---- Growth ---- */}
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <Text style={styles.panelTitle}>Growth</Text>
            <Text style={styles.panelMeta}>
              {maxed
                ? 'Fully grown'
                : `${toNext} more ${toNext === 1 ? 'tick' : 'ticks'} to evolve`}
            </Text>
          </View>

          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${Math.round(progress * 100)}%`, backgroundColor: species.palette.base },
              ]}
            />
          </View>

          <View style={styles.pips}>
            {species.names.map((n, i) => (
              <View key={n} style={styles.pip}>
                <View
                  style={[
                    styles.pipDot,
                    i <= stage && { backgroundColor: species.palette.base, borderColor: species.palette.base },
                  ]}
                />
                <Text style={[styles.pipLabel, i <= stage && { color: companion.onNight }]}>
                  {n}
                </Text>
                <Text style={styles.pipCost}>{STAGE_THRESHOLDS[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---- Where tokens come from ---- */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>How it grows</Text>
          <Text style={styles.panelBody}>
            One token for each thing you tick off your routine. Nothing else earns
            them — no bonus for opening the app, and re-ticking something you
            already did does not count twice.
          </Text>
          <View style={styles.affinity}>
            {species.affinity.map((a) => (
              <View key={a} style={[styles.tag, { borderColor: species.palette.base }]}>
                <Text style={[styles.tagText, { color: species.palette.accent }]}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/routine')}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: species.palette.base },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.ctaLabel}>Go to my routine</Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </Pressable>
      </ScrollView>

      {/* ---- Evolution reveal ---- */}
      {pendingEvolution && (
        <View style={styles.overlay}>
          <View style={styles.reveal}>
            <Text style={styles.revealEyebrow}>It grew</Text>
            <Creature species={speciesId} stage={stage} mood="happy" size={200} />
            <Text style={[styles.revealName, { color: species.palette.accent }]}>
              {species.names[Math.max(0, stage - 1)]} became {name}
            </Text>
            <Text style={styles.revealBody}>
              That is {STAGE_THRESHOLDS[stage]} things ticked off. It stays this way —
              evolutions are never taken back.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={acknowledgeEvolution}
              style={[styles.cta, { backgroundColor: species.palette.base, marginTop: spacing.stackMd }]}
            >
              <Text style={styles.ctaLabel}>Nice</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  barTitle: { ...typography.h3, color: companion.onNight },
  body: { paddingBottom: spacing.stackLg, alignItems: 'center' },
  stage: { alignItems: 'center', paddingTop: spacing.stackSm },
  name: { ...typography.display, fontSize: 30, lineHeight: 36 },
  stageLabel: {
    ...typography.micro,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: companion.onNightMuted,
    marginTop: 2,
  },
  mood: {
    ...typography.bodyMd,
    color: companion.onNight,
    textAlign: 'center',
    marginTop: spacing.stackSm,
    marginBottom: spacing.stackLg,
  },
  statRow: { flexDirection: 'row', gap: spacing.stackSm, width: '100%' },
  statCard: {
    flex: 1,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: companion.nightRaised,
    borderWidth: 1,
    borderColor: companion.nightLine,
  },
  tokenRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statValue: { ...typography.h3, color: companion.onNight },
  statLabel: { ...typography.micro, letterSpacing: 0, color: companion.onNightMuted },
  panel: {
    width: '100%',
    marginTop: spacing.stackMd,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: companion.nightRaised,
    borderWidth: 1,
    borderColor: companion.nightLine,
    gap: spacing.stackSm,
  },
  panelHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  panelTitle: { ...typography.h3, color: companion.onNight },
  panelMeta: { ...typography.caption, color: companion.onNightMuted },
  panelBody: { ...typography.caption, color: companion.onNightMuted },
  track: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: companion.night,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.full },
  pips: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.base },
  pip: { alignItems: 'center', gap: 3, flex: 1 },
  pipDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: companion.nightLine,
  },
  pipLabel: { ...typography.micro, letterSpacing: 0, color: companion.onNightMuted },
  pipCost: { ...typography.micro, fontSize: 10, letterSpacing: 0, color: companion.nightLine },
  affinity: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.base },
  tag: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: radius.sm, borderWidth: 1 },
  tagText: { ...typography.micro, fontSize: 10, letterSpacing: 0 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    height: 52,
    width: '100%',
    borderRadius: radius.md,
    marginTop: spacing.stackLg,
  },
  ctaLabel: { ...typography.h3, color: '#ffffff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.stackSm },
  emptyTitle: { ...typography.h2, color: companion.onNight },
  emptyBody: { ...typography.bodyMd, color: companion.onNightMuted, textAlign: 'center' },
  emptyCta: {
    marginTop: spacing.stackMd,
    paddingHorizontal: spacing.stackLg,
    height: 48,
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: companion.nightLine,
  },
  emptyCtaLabel: { ...typography.h3, color: companion.onNight },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4,27,51,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenMargin,
  },
  reveal: { alignItems: 'center', width: '100%' },
  revealEyebrow: {
    ...typography.micro,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: companion.onNightMuted,
  },
  revealName: { ...typography.h2, textAlign: 'center', marginTop: spacing.stackSm },
  revealBody: {
    ...typography.caption,
    color: companion.onNightMuted,
    textAlign: 'center',
    marginTop: spacing.stackSm,
  },
});
