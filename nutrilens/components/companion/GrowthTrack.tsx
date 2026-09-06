import { StyleSheet, Text, View } from 'react-native';
import { SPECIES, STAGE_THRESHOLDS, stageProgress, tokensToNextStage, type SpeciesId, type Stage } from '../../data/companion';
import { companion } from '../../theme/companion';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  speciesId: SpeciesId;
  stage: Stage;
  tokens: number;
  /** Header row. Off when the surrounding card already has a title. */
  title?: string;
  /**
   * Which ground it is sitting on.
   *
   * `night` fills the bar with the species' own colour. `light` fills it with
   * brand navy instead — the containment rule keeps elemental hues off light
   * surfaces, so a white card gets the shape of the mechanic without the
   * colour that belongs to the game.
   */
  tone?: 'night' | 'light';
};

/**
 * The evolution track: a bar, and the three forms with the tokens each costs.
 *
 * Lives here rather than inside the pal screen because Profile shows the same
 * thing, and two hand-built copies of a progress bar drift apart the first time
 * a threshold changes.
 *
 * The costs are printed. A game that hides its thresholds is asking you to keep
 * opening it to find out whether anything happened; printing "50" under the
 * final form means a person can decide for themselves whether it is worth it,
 * which is the difference between a goal and a slot machine.
 *
 * Night ground only. The fill is the species' own colour and the containment
 * rule keeps elemental hues off light surfaces, so this component never gets a
 * light variant — put it inside a night card.
 */
export function GrowthTrack({ speciesId, stage, tokens, title, tone = 'night' }: Props) {
  const light = tone === 'light';
  const fill = light ? colors.aggieBlue : SPECIES[speciesId].palette.base;
  const ink = light ? colors.onSurface : companion.onNight;
  const inkMuted = light ? colors.onSurfaceVariant : companion.onNightMuted;
  const trackBg = light ? colors.surfaceContainerHigh : companion.night;
  const pipOff = light ? colors.outlineVariant : companion.nightLine;
  const species = SPECIES[speciesId];
  const progress = stageProgress(tokens);
  const toNext = tokensToNextStage(tokens);
  const maxed = toNext === 0;

  return (
    <View style={styles.wrap}>
      {/* The countdown always shows. It is the line that answers "why would I
          tick anything off today", and it was the first thing lost when this
          was dropped into a card that supplies its own heading. */}
      <View style={[styles.head, !title && styles.headBare]}>
        {title && <Text style={[styles.title, { color: ink }]}>{title}</Text>}
        <Text style={[styles.meta, { color: inkMuted }]}>
          {maxed
            ? 'Fully grown'
            : `${toNext} more ${toNext === 1 ? 'tick' : 'ticks'} to ${species.names[stage + 1]}`}
        </Text>
      </View>

      <View
        accessibilityRole="progressbar"
        accessibilityLabel={
          maxed
            ? `${species.names[stage]} is fully grown`
            : `${toNext} more ticks to become ${species.names[stage + 1]}`
        }
        style={[styles.track, { backgroundColor: trackBg }]}
      >
        <View
          style={[
            styles.fill,
            { width: `${Math.round(progress * 100)}%`, backgroundColor: fill },
          ]}
        />
      </View>

      <View style={styles.pips}>
        {species.names.map((n, i) => (
          <View key={n} style={styles.pip}>
            <View
              style={[
                styles.pipDot,
                { borderColor: pipOff },
                i <= stage && { backgroundColor: fill, borderColor: fill },
              ]}
            />
            <Text style={[styles.pipLabel, { color: inkMuted }, i <= stage && { color: ink }]}>
              {n}
            </Text>
            <Text style={[styles.pipCost, { color: pipOff }]}>{STAGE_THRESHOLDS[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', gap: spacing.stackSm },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headBare: { justifyContent: 'center' },
  title: { ...typography.h3, color: companion.onNight },
  meta: { ...typography.caption, color: companion.onNightMuted },
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
});
