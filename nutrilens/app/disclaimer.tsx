import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBar } from '../components/ui/AppBar';
import { Icon } from '../components/ui/Icon';
import { Screen } from '../components/ui/Screen';
import { colors, radius, spacing, typography } from '../theme';

/**
 * What this app can and cannot tell you.
 *
 * The one-line disclaimer at the bottom of a nutrient page is the legal
 * minimum and nobody reads it. This screen is the version that is actually
 * useful: it names the specific things a five-question quiz cannot know, and
 * it names the situations where the right move is a clinician rather than a
 * supplement.
 *
 * Written flatly and without hedging. A disclaimer that sounds defensive gets
 * skimmed; one that reads as straight information gets read.
 */
export default function DisclaimerRoute() {
  return (
    <Screen padded={false}>
      <AppBar title="Not medical advice" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.lead}>
          <Icon name="info-outline" size={20} color={colors.ink} />
          <Text style={styles.leadText}>
            VitaPal is a class project. It is not a medical device, it is not
            reviewed by a clinician, and nothing in it is a diagnosis.
          </Text>
        </View>

        <Block
          title="What it can tell you"
          body="Which nutrients are commonly low in diets shaped like the one you described, and where to find those nutrients in ordinary food. That is a statement about diets in general, not about your body."
        />

        <Block
          title="What it cannot tell you"
          body="Whether you are actually low in anything. That takes a blood test. Two people can give identical answers to this quiz and have completely different levels of the same nutrient — absorption, medication, pregnancy, genetics and existing conditions all change the answer, and none of them are asked about here."
        />

        <Block
          title="Talk to a clinician before supplementing if"
          bullets={[
            'You take any prescription medication. Several common ones interact with iron, calcium or vitamin K.',
            'You are pregnant, trying to become pregnant, or breastfeeding.',
            'You have a kidney, liver, thyroid or absorption condition.',
            'You already take a multivitamin — stacking it with a single-nutrient supplement is the easiest way to overshoot.',
            'You are considering a dose above what the label recommends.',
          ]}
        />

        <Block
          title="More is not better"
          body="Vitamin D, iron and vitamin A accumulate in the body rather than being flushed out, and every one of them is harmful in excess. Iron in particular is a leading cause of poisoning in young children, so anything you buy belongs out of their reach."
        />

        <Block
          title="See someone about symptoms"
          body="Persistent tiredness, breathlessness, hair loss, tingling in the hands or feet, or unexplained weight change are worth a doctor's appointment, not a supplement bought on the strength of a quiz. Those symptoms have many causes and most of them are not dietary."
        />

        <View style={styles.sourceCard}>
          <Text style={styles.sourceTitle}>Where to read something reliable</Text>
          <Text style={styles.sourceBody}>
            The NIH Office of Dietary Supplements publishes a plain-language
            fact sheet for every nutrient in this app, including how much is
            too much.
          </Text>
          <View style={styles.sourceLink}>
            <Icon name="open-in-new" size={16} color={colors.aggieBlue} />
            <Text style={styles.sourceUrl}>ods.od.nih.gov/factsheets</Text>
          </View>
        </View>

        <Text style={styles.footnote}>
          The amounts shown on nutrient pages in this build have not yet been
          checked against that source.
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Block({
  title,
  body,
  bullets,
}: {
  title: string;
  body?: string;
  bullets?: string[];
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {body && <Text style={styles.blockBody}>{body}</Text>}
      {bullets?.map((line) => (
        <View key={line} style={styles.bullet}>
          <View style={styles.dot} />
          <Text style={styles.bulletText}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.stackLg,
    gap: spacing.stackMd,
  },
  lead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.tintGold,
    marginTop: spacing.stackSm,
  },
  leadText: { ...typography.caption, color: colors.ink, flex: 1 },
  block: {
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.stackSm,
  },
  blockTitle: { ...typography.h3, color: colors.aggieBlue },
  blockBody: { ...typography.caption, color: colors.onSurfaceVariant },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.stackSm },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceTint,
    marginTop: 7,
  },
  bulletText: { ...typography.caption, color: colors.onSurfaceVariant, flex: 1 },
  sourceCard: {
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.stackSm,
  },
  sourceTitle: { ...typography.h3, color: colors.aggieBlue },
  sourceBody: { ...typography.caption, color: colors.onSurfaceVariant },
  sourceLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.base },
  sourceUrl: { ...typography.caption, color: colors.aggieBlue },
  footnote: { ...typography.caption, color: colors.outline },
});
