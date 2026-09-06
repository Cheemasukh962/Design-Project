import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SPECIES, moodLine } from '../../data/companion';
import { useCompanion } from '../../data/CompanionContext';
import { companion } from '../../theme/companion';
import { radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';
import { CareMeter } from '../companion/CareMeter';
import { Creature } from '../companion/Creature';

type Props = {
  onOpen: () => void;
  onPick: () => void;
};

/**
 * The companion's presence on Home.
 *
 * It carries its own dark ground rather than sitting on the page like the other
 * cards. That is the containment rule doing its job: the moment you see the
 * night ground you are looking at the game, and the elemental hues inside it
 * cannot be confused with the gold that means "worth a look" or the green that
 * means "done" elsewhere on the same screen.
 *
 * Placed above the gap summary because it is the reason to open the app on a
 * day when you already know your results — and because a creature that has been
 * waiting is a better first thing to see than a number.
 */
export function CompanionCard({ onOpen, onPick }: Props) {
  const { hydrated, speciesId, care, stage, mood } = useCompanion();

  // Nothing until storage has been read, so the card never flashes the
  // "pick a pal" prompt at someone who already has one.
  if (!hydrated) return <View style={styles.placeholder} />;

  if (!speciesId) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pick your pal"
        onPress={onPick}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <Creature species="sprout" stage={0} size={72} glow={false} animate />
        <View style={styles.text}>
          <Text style={styles.name}>Pick your pal</Text>
          <Text style={styles.line}>
            Three to choose from. It grows as you keep up your routine.
          </Text>
        </View>
        <Icon name="chevron-right" size={22} color={companion.onNightMuted} />
      </Pressable>
    );
  }

  const species = SPECIES[speciesId];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${species.names[stage]}. ${moodLine(speciesId, mood)} HP ${Math.round(care)} percent.`}
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Creature species={speciesId} stage={stage} mood={mood} size={76} />

      <View style={styles.text}>
        <Text style={[styles.name, { color: species.palette.accent }]}>
          {species.names[stage]}
        </Text>
        <Text style={styles.line} numberOfLines={2}>
          {moodLine(speciesId, mood)}
        </Text>

      </View>

      {/* The HP heart takes the chevron's place: the card is tappable anyway,
          and a number that moves daily is worth more than an affordance hint. */}
      <CareMeter care={care} fill={species.palette.accent} size={46} layout="stack" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: { height: 108 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    padding: spacing.base * 3,
    borderRadius: radius.md,
    backgroundColor: companion.night,
    borderWidth: 1,
    borderColor: companion.nightLine,
  },
  pressed: { opacity: 0.9 },
  text: { flex: 1, gap: 2 },
  name: { ...typography.h3, color: companion.onNight },
  line: { ...typography.caption, color: companion.onNightMuted },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.base * 3, marginTop: spacing.base },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { ...typography.micro, letterSpacing: 0, color: companion.onNightMuted },
});
