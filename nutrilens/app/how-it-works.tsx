import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBar } from '../components/ui/AppBar';
import { Icon } from '../components/ui/Icon';
import { Screen } from '../components/ui/Screen';
import { MAX_FINDINGS, RULES } from '../data/inference';
import { STAGE_THRESHOLDS } from '../data/companion';
import { colors, radius, spacing, typography } from '../theme';

/**
 * How the results are produced.
 *
 * This screen is the honesty guarantee made visible. Every finding in this app
 * comes from a written rule in data/inference.ts — no model, no scoring nobody
 * can inspect — and the whole point of that decision is lost if a user cannot
 * see the rules. So the rules are printed, in the same words the code uses.
 *
 * It is also the answer to the question a nutrition app has to be able to
 * answer: "how do you know that about me?" The answer is always "you told us,
 * here is the answer we used" — never "we measured you".
 */
export default function HowItWorksRoute() {
  return (
    <Screen padded={false}>
      <AppBar title="How this works" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>
          Nothing here is measured. Five questions go in, and a short list of
          nutrients worth a closer look comes out. Every item on that list can
          be traced back to a specific answer you gave.
        </Text>

        <Section
          icon="checklist"
          title="The rules"
          body={`These are the whole set. At most ${MAX_FINDINGS} are shown at once — four or more reads as "everything is wrong with you" and produces paralysis rather than a next step. If none match, the results page says so rather than filling the space.`}
        />

        <View style={styles.rules}>
          {RULES.map((rule) => (
            <View key={rule.id} style={styles.rule}>
              <Text style={styles.ruleWhen}>{rule.when}</Text>
              <View style={styles.ruleThen}>
                <Icon name="arrow-forward" size={16} color={colors.surfaceTint} />
                <Text style={styles.ruleNutrient}>{rule.nutrientId}</Text>
              </View>
            </View>
          ))}
        </View>

        <Section
          icon="info-outline"
          title="What it will not do"
          body="It will not tell you that you are deficient in anything. A deficiency is a blood test and a clinician, not a five-question quiz. The word this app uses is 'worth a closer look', and it means exactly that."
        />

        <Section
          icon="restaurant"
          title="Restrictions actually change the answer"
          body="If you say you do not eat fish, salmon is removed from every suggestion — not greyed out, removed. Halal and kosher rename the meat suggestion rather than dropping it, because they govern how meat is sourced, not whether it is eaten."
        />

        <Section
          icon="bolt"
          title="How the pal grows"
          body={`One token for each item you tick off your routine. Nothing else earns them — no bonus for opening the app, and re-ticking something you already did does not count twice. ${STAGE_THRESHOLDS[1]} tokens for the second form, ${STAGE_THRESHOLDS[2]} for the third.`}
        />

        <Section
          icon="favorite-border"
          title="The care meter cannot empty"
          body="It falls if you are away and recovers when you come back, but it stops well short of zero and your pal never dies or loses a form it has reached. The behaviour worth reinforcing is taking the thing, not opening an app every day to keep something alive."
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            The amounts shown on nutrient pages still need checking against the
            NIH Office of Dietary Supplements before anyone relies on them.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Section({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  body: string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Icon name={icon} size={20} color={colors.aggieBlue} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionBody}>{body}</Text>
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
    ...typography.bodyMd,
    color: colors.onSurface,
    marginTop: spacing.stackSm,
  },
  section: {
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.stackSm,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
  },
  sectionTitle: { ...typography.h3, color: colors.aggieBlue, flex: 1 },
  sectionBody: { ...typography.caption, color: colors.onSurfaceVariant },
  rules: { gap: spacing.stackSm },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  ruleWhen: { ...typography.caption, color: colors.onSurface, flex: 1 },
  ruleThen: { flexDirection: 'row', alignItems: 'center', gap: spacing.base },
  ruleNutrient: {
    ...typography.micro,
    letterSpacing: 0.4,
    color: colors.aggieBlue,
  },
  footer: {
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.tintGold,
  },
  footerText: { ...typography.caption, color: colors.ink },
});
