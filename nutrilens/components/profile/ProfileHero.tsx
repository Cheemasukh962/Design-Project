import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CareMeter } from '../companion/CareMeter';
import { Creature } from '../companion/Creature';
import { Icon } from '../ui/Icon';
import { CARE, SPECIES, moodLine, tokensToNextStage } from '../../data/companion';
import { useCompanion } from '../../data/CompanionContext';
import { companion } from '../../theme/companion';
import { radius, spacing, typography } from '../../theme';

type Props = {
  name: string;
  initial: string;
  /** Opens the companion screen. */
  onOpen: () => void;
  /** Opens the picker, when there is no pal yet. */
  onPick: () => void;
};

/**
 * The profile header: who you are and what you are raising, in one card.
 *
 * The old header was an initial in a circle beside "Level 3 · 820 XP". Both
 * halves were wrong — the level and the XP were invented numbers from the mock,
 * and they sat next to a real companion that earns real tokens, which is the
 * same duplicate-progress problem that was removed from Home. The pal is the
 * progression in this build, so the pal is the header.
 *
 * It carries the night ground, like the card on Home, because the containment
 * rule says the elemental colours never touch a light surface. That also does
 * the design work the brief asked for: the one screen about *you* opens with
 * the one object in the app that visibly changes because of what you did.
 */
export function ProfileHero({ name, initial, onOpen, onPick }: Props) {
  const { hydrated, speciesId, tokens, care, stage, mood } = useCompanion();

  // Hold the space until storage has been read, so the card never flashes the
  // "pick a pal" prompt at someone who already has one.
  if (!hydrated) return <View style={styles.placeholder} />;

  if (!speciesId) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name}. Pick your pal.`}
        onPress={onPick}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.top}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
          <Text style={styles.who}>{name}</Text>
        </View>

        <Creature species="sprout" stage={0} size={132} glow={false} animate />

        <Text style={styles.prompt}>No pal yet</Text>
        <Text style={styles.line}>Pick one and it starts growing with your routine.</Text>

        <View style={styles.pickRow}>
          <Text style={styles.pickLabel}>Pick your pal</Text>
          <Icon name="arrow-forward" size={18} color={companion.onNight} />
        </View>
      </Pressable>
    );
  }

  const species = SPECIES[speciesId];
  const toNext = tokensToNextStage(tokens);
  const grown = toNext === 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        `${name}. ${species.names[stage]}, stage ${stage + 1} of 3. ` +
        `${tokens} tokens. Care ${Math.round(care)} percent. ` +
        (grown ? 'Fully grown.' : `${toNext} tokens to ${species.names[stage + 1]}.`)
      }
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{initial}</Text>
        </View>
        <Text style={styles.who}>{name}</Text>
      </View>

      <Creature species={speciesId} stage={stage} mood={mood} size={124} glow />

      <Text style={[styles.palName, { color: species.palette.accent }]}>
        {species.names[stage]}
      </Text>
      <Text style={styles.line} numberOfLines={2}>
        {moodLine(speciesId, mood)}
      </Text>

      {/* HP, given the weight it earns. It is the only number here that moves
          because of something the user did today — growth takes a fortnight,
          so leading with growth made the card static. */}
      <View style={styles.hp}>
        <CareMeter care={care} fill={species.palette.accent} size={64} />
        <View style={styles.hpText}>
          <Text style={styles.hpTitle}>HP</Text>
          <Text style={styles.hpRule}>
            +{CARE.RECOVER} when you tick anything off · −{CARE.DECAY} a day away
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: { height: 320 },
  card: {
    alignItems: 'center',
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    backgroundColor: companion.night,
    borderWidth: 1,
    borderColor: companion.nightLine,
    gap: spacing.base,
  },
  pressed: { opacity: 0.92 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.stackSm,
    marginBottom: spacing.base,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: companion.nightRaised,
    borderWidth: 1,
    borderColor: companion.nightLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: companion.onNight,
  },
  who: {
    ...typography.h3,
    color: companion.onNight,
    flex: 1,
  },
  palName: {
    ...typography.display,
    fontSize: 28,
    lineHeight: 34,
    marginTop: spacing.base,
  },
  hp: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.stackMd,
    marginTop: spacing.stackMd,
    padding: spacing.stackSm,
    borderRadius: radius.md,
    backgroundColor: companion.nightRaised,
    borderWidth: 1,
    borderColor: companion.nightLine,
  },
  hpText: { flex: 1, gap: 2 },
  hpTitle: { ...typography.h3, color: companion.onNight },
  hpRule: { ...typography.micro, letterSpacing: 0, color: companion.onNightMuted },
  prompt: {
    ...typography.h3,
    color: companion.onNight,
    marginTop: spacing.base,
  },
  line: {
    ...typography.caption,
    color: companion.onNightMuted,
    textAlign: 'center',
  },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginTop: spacing.stackMd,
  },
  pickLabel: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: companion.onNight,
  },
});
