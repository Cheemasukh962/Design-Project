import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Creature } from '../components/companion/Creature';
import { Screen } from '../components/ui/Screen';
import { SPECIES_LIST, type Stage } from '../data/companion';
import { companion } from '../theme/companion';
import { spacing, typography } from '../theme';

/**
 * Design reference sheet — every species at every stage, side by side.
 *
 * NOT part of the product flow; nothing links here. It exists because an
 * evolution line can only be judged as a line: three forms that each look fine
 * alone can still fail to read as the same creature growing up. Keep it for
 * design review, and delete it before any build that goes to a participant.
 *
 * Reach it at /creatures.
 */
const STAGES: Stage[] = [0, 1, 2];

export default function CreatureSheetRoute() {
  return (
    <Screen background="night">
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Evolution lines</Text>
        <Text style={styles.sub}>
          Design reference. Three species, three stages, one skeleton.
        </Text>

        {SPECIES_LIST.map((species) => (
          <View key={species.id} style={styles.row}>
            <Text style={[styles.species, { color: species.palette.accent }]}>
              {species.personality}
            </Text>
            <View style={styles.line}>
              {STAGES.map((stage) => (
                <View key={stage} style={styles.cell}>
                  <Creature
                    species={species.id}
                    stage={stage}
                    size={104}
                    glow={false}
                    animate={false}
                  />
                  <Text style={styles.name}>{species.names[stage]}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: spacing.stackMd, paddingBottom: spacing.stackLg },
  title: { ...typography.h1Mobile, color: companion.onNight },
  sub: {
    ...typography.caption,
    color: companion.onNightMuted,
    marginBottom: spacing.stackLg,
  },
  row: { marginBottom: spacing.stackLg },
  species: {
    ...typography.micro,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.stackSm,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { alignItems: 'center' },
  name: { ...typography.caption, color: companion.onNightMuted },
});
