import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PillMark } from '../components/nutrient/PillMark';
import { AppBar } from '../components/ui/AppBar';
import { Icon } from '../components/ui/Icon';
import { Screen } from '../components/ui/Screen';
import { NUTRIENTS, pillFor } from '../data/nutrients';
import { colors, radius, spacing, typography } from '../theme';

/**
 * What to look for on a supplement label.
 *
 * "Where to buy supplements" was a row that went nowhere, and the obvious way
 * to make it go somewhere — a list of shops, or brands — is the one thing this
 * app must not do. Naming brands is an endorsement we cannot support, and
 * inventing local stockists would be inventing facts.
 *
 * So the row answers the question underneath the question instead: standing in
 * a pharmacy aisle looking at forty bottles, what actually distinguishes them?
 * All of it is checkable on the label in front of you, none of it is specific
 * to a product, and none of it is a health claim.
 */
export default function SupplementsRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const nutrient = id ? NUTRIENTS[id] : undefined;

  return (
    <Screen padded={false}>
      <AppBar title="Buying supplements" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {nutrient && (
          <View style={styles.hero}>
            <PillMark shape={pillFor(nutrient.id)} size={64} />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{nutrient.name}</Text>
              <Text style={styles.heroBody}>{nutrient.summary}</Text>
            </View>
          </View>
        )}

        <View style={styles.notice}>
          <Icon name="info-outline" size={18} color={colors.ink} />
          <Text style={styles.noticeText}>
            We do not sell anything, recommend brands, or earn anything from a
            purchase. Food first is genuinely the better route where it is
            available to you — the sources on each nutrient page come before
            this page for that reason.
          </Text>
        </View>

        <Text style={styles.section}>What to check on the label</Text>

        <Check
          icon="checklist"
          title="The amount per serving, and what a serving is"
          body="The big number on the front is often two or three capsules, not one. The Supplement Facts panel on the back is the one that counts."
        />
        <Check
          icon="verified"
          title="A third-party testing mark"
          body="USP, NSF or Informed Choice on the bottle means an outside lab confirmed the contents match the label. Supplements are not pre-approved by regulators the way medicines are, so this mark is doing real work."
        />
        <Check
          icon="biotech"
          title="The form, not just the nutrient"
          body="Forms differ in how well they are absorbed and how they sit with you — D3 rather than D2, and for iron, the gentler forms are worth asking a pharmacist about if tablets have upset your stomach before."
        />
        <Check
          icon="restaurant"
          title="Whether it needs food"
          body="Fat-soluble vitamins — D, A, E and K — are absorbed better with a meal containing some fat. Iron is the opposite and is usually taken away from tea, coffee and dairy."
        />
        <Check
          icon="alarm"
          title="The expiry date and the bottle count"
          body="A year's supply that expires in four months is not cheaper. Divide the price by the number of servings, not by the bottle."
        />

        <View style={styles.warn}>
          <Text style={styles.warnTitle}>Before you buy</Text>
          <Text style={styles.warnBody}>
            Check anything you are already taking, including a multivitamin, so
            you are not doubling a dose. If you take prescription medication,
            are pregnant, or have a kidney, liver or thyroid condition, ask a
            clinician or pharmacist first.
          </Text>
          <Text
            accessibilityRole="link"
            onPress={() => router.push('/disclaimer')}
            style={styles.warnLink}
          >
            Read what this app can and cannot tell you →
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Check({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  body: string;
}) {
  return (
    <View style={styles.check}>
      <View style={styles.checkGlyph}>
        <Icon name={icon} size={18} color={colors.aggieBlue} />
      </View>
      <View style={styles.checkText}>
        <Text style={styles.checkTitle}>{title}</Text>
        <Text style={styles.checkBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.stackLg,
    gap: spacing.stackSm,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    marginTop: spacing.stackSm,
  },
  heroText: { flex: 1, gap: 2 },
  heroTitle: { ...typography.h3, color: colors.aggieBlue },
  heroBody: { ...typography.caption, color: colors.onSurfaceVariant },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.tintGold,
    marginTop: spacing.stackSm,
  },
  noticeText: { ...typography.caption, color: colors.ink, flex: 1 },
  section: {
    ...typography.h3,
    color: colors.aggieBlue,
    marginTop: spacing.stackMd,
    marginBottom: spacing.base,
  },
  check: {
    flexDirection: 'row',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  checkGlyph: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { flex: 1, gap: 2 },
  checkTitle: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    fontSize: 14,
    color: colors.onSurface,
  },
  checkBody: { ...typography.caption, color: colors.onSurfaceVariant },
  warn: {
    marginTop: spacing.stackMd,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.cardEdge,
    gap: spacing.stackSm,
  },
  warnTitle: { ...typography.h3, color: colors.aggieBlue },
  warnBody: { ...typography.caption, color: colors.onSurfaceVariant },
  warnLink: { ...typography.caption, color: colors.aggieBlue },
});
