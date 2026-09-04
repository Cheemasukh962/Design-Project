import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Creature } from '../components/companion/Creature';
import { Icon } from '../components/ui/Icon';
import { Screen } from '../components/ui/Screen';
import { SPECIES_LIST, type SpeciesId } from '../data/companion';
import { useCompanion } from '../data/CompanionContext';
import { companion } from '../theme/companion';
import { radius, spacing, typography } from '../theme';

/**
 * Starter selection.
 *
 * Three creatures, split by personality rather than by stats — the cool one,
 * the serious one, the funny one — which is how the format's own designers
 * describe the job. There is no "best" pick and nothing here says there is:
 * the three are mechanically identical, so the choice is pure self-expression,
 * which is exactly what makes people attached to it.
 *
 * Each one names the nutrients it is drawn from. That is what keeps the game
 * tied to the product: the creature is not a mascot bolted onto a nutrition
 * app, it is made of the same material the rest of the app talks about.
 */
export default function StarterRoute() {
  const { choose } = useCompanion();
  const [picked, setPicked] = useState<SpeciesId | null>(null);
  const selected = SPECIES_LIST.find((s) => s.id === picked) ?? null;

  const confirm = () => {
    if (!picked) return;
    choose(picked);
    router.replace('/home');
  };

  return (
    <Screen background="night">
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Pick your buddy
        </Text>
        <Text style={styles.sub}>
          It grows when you keep up your routine. There is no better or worse one —
          pick whichever you like looking at.
        </Text>

        <View style={styles.grid}>
          {SPECIES_LIST.map((species) => {
            const isPicked = picked === species.id;
            return (
              <Pressable
                key={species.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: isPicked }}
                accessibilityLabel={`${species.names[0]}. ${species.personality}. ${species.pitch}`}
                onPress={() => setPicked(species.id)}
                style={({ pressed }) => [
                  styles.card,
                  isPicked && { borderColor: species.palette.base, backgroundColor: companion.nightRaised },
                  pressed && !isPicked && styles.cardPressed,
                ]}
              >
                <Creature
                  species={species.id}
                  stage={0}
                  size={104}
                  glow={isPicked}
                  animate={isPicked}
                />

                <View style={styles.cardText}>
                  <Text style={[styles.name, isPicked && { color: species.palette.accent }]}>
                    {species.names[0]}
                  </Text>
                  <Text style={styles.personality}>{species.personality}</Text>
                  <Text style={styles.pitch}>{species.pitch}</Text>

                  <View style={styles.affinity}>
                    {species.affinity.map((a) => (
                      <View
                        key={a}
                        style={[styles.tag, { borderColor: species.palette.base }]}
                      >
                        <Text style={[styles.tagText, { color: species.palette.accent }]}>{a}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View
                  style={[
                    styles.radio,
                    isPicked && {
                      backgroundColor: species.palette.base,
                      borderColor: species.palette.base,
                    },
                  ]}
                >
                  {isPicked && <Icon name="check" size={14} color="#ffffff" />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !picked }}
          disabled={!picked}
          onPress={confirm}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: selected?.palette.base ?? companion.nightLine },
            !picked && styles.ctaDisabled,
            pressed && styles.ctaPressed,
          ]}
        >
          <Text style={styles.ctaLabel}>
            {selected ? `Choose ${selected.names[0]}` : 'Pick one to continue'}
          </Text>
        </Pressable>
        <Text style={styles.footnote}>You can start over later from Profile.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: spacing.stackMd, paddingBottom: spacing.stackLg },
  title: { ...typography.h1, color: companion.onNight },
  sub: {
    ...typography.bodyMd,
    color: companion.onNightMuted,
    marginTop: spacing.stackSm,
    marginBottom: spacing.stackLg,
  },
  grid: { gap: spacing.stackMd },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    padding: spacing.base * 3,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: companion.nightLine,
  },
  cardPressed: { backgroundColor: companion.nightRaised },
  cardText: { flex: 1, gap: 2 },
  name: { ...typography.h3, color: companion.onNight },
  personality: {
    ...typography.micro,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: companion.onNightMuted,
  },
  pitch: {
    ...typography.caption,
    color: companion.onNightMuted,
    marginTop: spacing.base,
  },
  affinity: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.base, marginTop: 6 },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  tagText: { ...typography.micro, fontSize: 10, letterSpacing: 0 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: companion.nightLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { paddingTop: spacing.base * 3, paddingBottom: spacing.stackSm, gap: spacing.stackSm },
  cta: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: { opacity: 0.45 },
  ctaPressed: { opacity: 0.85 },
  ctaLabel: { ...typography.h3, color: '#ffffff' },
  footnote: {
    ...typography.caption,
    color: companion.onNightMuted,
    textAlign: 'center',
  },
});
