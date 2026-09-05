import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BenefitChip } from '../../components/nutrient/BenefitChip';
import { PerspectiveCard } from '../../components/nutrient/PerspectiveCard';
import { PillMark } from '../../components/nutrient/PillMark';
import { SourceCard } from '../../components/nutrient/SourceCard';
import { Accordion } from '../../components/ui/Accordion';
import { AppBar } from '../../components/ui/AppBar';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Screen } from '../../components/ui/Screen';
import { NUTRIENTS, pillFor } from '../../data/nutrients';
import { useQuiz } from '../../data/QuizContext';
import { applyRestrictions } from '../../data/restrictions';
import { useRoutine } from '../../data/RoutineContext';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Nutrient reference page. One design, reachable from anywhere.
 *
 * Source: Stitch "Vitamin D Reference".
 *
 * The mock is Vitamin D specific; this route is parameterised so the same
 * screen serves every nutrient, which is what the PRD requires. Content per
 * nutrient lives in data/nutrients.ts.
 *
 * Tier one — the hero, the benefits grid and the source cards — is readable
 * without opening anything. Tier two is collapsed: the mechanism, and the
 * sources. That split is what keeps a reference page from reading as a wall.
 */
export default function NutrientDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { added, add, items, reminders, reminderTime, toggleReminder } = useRoutine();
  const { answers } = useQuiz();

  const nutrient = NUTRIENTS[id ?? ''];

  if (!nutrient) {
    return (
      <Screen>
        <AppBar title="Not found" onBack={() => router.back()} />
        <Text style={styles.empty}>We don&apos;t have a page for that nutrient yet.</Text>
      </Screen>
    );
  }

  const inRoutine = added.includes(nutrient.id);
  // Every routine item this nutrient expanded into.
  const mine = items.filter((i) => i.nutrientId === nutrient.id);
  const remindOn = mine.length > 0 && mine.every((i) => reminders.includes(i.id));
  // Never show a source the user told us in Q5 that they do not eat.
  const foods = applyRestrictions(nutrient.foods, answers.restrictions);

  return (
    <Screen padded={false}>
      <View style={styles.bar}>
        <AppBar
          title={nutrient.name}
          onBack={() => router.back()}
          actionIcon="favorite-border"
          actionLabel={`Save ${nutrient.name}`}
        />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* ---- Hero ---- */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Essential for</Text>
          <View style={styles.benefits}>
            {nutrient.benefits.map((benefit) => (
              <View key={benefit} style={styles.benefitCell}>
                <BenefitChip label={benefit} />
              </View>
            ))}
          </View>
          {/* The mock puts food photography here. We do not own any, and the
              export's image URLs are temporary Stitch CDN links that will rot.
              A tinted plate carrying the nutrient's own mark fills the frame
              deliberately instead of showing an empty image box — and a real
              photo drops into the same frame with no layout change. */}
          {/* The pill itself, turning. It replaces the letter placeholder and
              is the one moment of motion on an otherwise still page. */}
          <View style={styles.heroPlate}>
            <PillMark shape={pillFor(nutrient.id)} size={196} spin />
          </View>
        </View>

        {/* ---- Where to find it ---- */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Where to find it</Text>
          <Text style={styles.sectionMeta}>Everyday sources</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.railBleed}
          contentContainerStyle={styles.rail}
        >
          {foods.map((source) => (
            <SourceCard key={source.label} source={source} />
          ))}
        </ScrollView>

        {/* ---- Tier two ---- */}
        <View style={styles.section}>
          <Accordion title="What it does" icon="biotech">
            <Text style={styles.paragraph}>{nutrient.detail}</Text>
            <View style={styles.facts}>
              {nutrient.facts.map((fact) => (
                <View key={fact.title} style={styles.fact}>
                  <Icon name={fact.icon} size={18} color={colors.surfaceTint} />
                  <View style={styles.factText}>
                    <Text style={styles.factTitle}>{fact.title}</Text>
                    <Text style={styles.factBody}>{fact.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Accordion>
        </View>

        {nutrient.perspective && (
          <View style={styles.section}>
            <PerspectiveCard perspective={nutrient.perspective} />
          </View>
        )}

        {/* ---- Footer detail rows ---- */}
        <View style={styles.footerRows}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Where to buy supplements"
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}
          >
            <Text style={styles.linkLabel}>Where to buy supplements</Text>
            <Icon name="chevron-right" size={22} color={colors.outline} />
          </Pressable>

          <Accordion title="Scientific sources" variant="plain">
            <View style={styles.sources}>
              <Text style={styles.sourceLine}>
                National Institutes of Health, Office of Dietary Supplements —{' '}
                {nutrient.name} fact sheet for health professionals.
              </Text>
              <Text style={styles.sourceLine}>
                Institute of Medicine, Food and Nutrition Board — Dietary Reference
                Intakes.
              </Text>
            </View>
            <View style={styles.sourceLink}>
              <Icon name="open-in-new" size={16} color={colors.aggieBlue} />
              <Text style={styles.sourceUrl}>ods.od.nih.gov</Text>
            </View>
            {/* The figures on the cards above have not been checked against
                these sources yet. See data/nutrients.ts. */}
            <Text style={styles.pending}>
              The amounts on this page still need checking against these sources
              before anyone relies on them.
            </Text>
          </Accordion>
        </View>

        <Text style={styles.disclaimer}>
          Not medical advice. See a clinician for diagnosis or before starting a
          supplement.
        </Text>
      </ScrollView>

      {/* ---- Sticky CTA ---- */}
      <View style={styles.cta}>
        {/* The reminder offer appears the moment something is added, because
            that is the only moment the user is thinking about it. Buried in a
            settings screen it would never be found, and forgetting is the
            failure this whole product has to survive. */}
        {inRoutine && (
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: remindOn }}
            accessibilityLabel={
              remindOn
                ? `Daily reminder on at ${reminderTime}. Tap to turn off.`
                : `Remind me daily about ${nutrient.name}`
            }
            onPress={() => mine.forEach((i) => toggleReminder(i.id))}
            style={({ pressed }) => [
              styles.remind,
              remindOn && styles.remindOn,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Icon
              name={remindOn ? 'notifications-active' : 'notifications-none'}
              size={20}
              color={remindOn ? colors.onPrimary : colors.aggieBlue}
            />
            <Text style={[styles.remindLabel, remindOn && { color: colors.onPrimary }]}>
              {remindOn ? `Reminder set for ${reminderTime}` : 'Remind me daily'}
            </Text>
          </Pressable>
        )}

        <Button
          label={inRoutine ? 'In your routine' : 'Add to my routine'}
          variant={inRoutine ? 'outline' : 'primary'}
          onPress={() => (inRoutine ? router.push('/routine') : add(nutrient.id))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: spacing.screenMargin,
    backgroundColor: colors.surfaceBright,
  },
  body: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.stackLg,
    paddingBottom: spacing.stackLg,
  },
  empty: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackLg,
  },
  hero: {
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(238,244,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(196,198,208,0.2)',
    gap: spacing.base * 3,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  heroTitle: {
    ...typography.h3,
    color: colors.primary,
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  // Two per row: half the hero width, minus half the 10px gap.
  benefitCell: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
  },
  heroPlate: {
    height: 196,
    width: '100%',
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackSm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
  },
  sectionMeta: {
    ...typography.caption,
    color: colors.outline,
  },
  railBleed: {
    marginHorizontal: -spacing.screenMargin,
  },
  rail: {
    gap: spacing.base * 3,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.base,
  },
  section: {
    marginTop: spacing.stackLg,
  },
  paragraph: {
    ...typography.bodyMd,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
  },
  facts: {
    gap: spacing.stackSm,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.stackSm,
    padding: 10,
    borderRadius: radius.base,
    backgroundColor: 'rgba(231,238,252,0.6)',
  },
  factText: { flex: 1 },
  factTitle: {
    ...typography.caption,
    fontFamily: typography.h3.fontFamily,
    color: colors.onSurface,
  },
  factBody: {
    ...typography.caption,
    color: colors.outline,
  },
  footerRows: {
    marginTop: spacing.stackLg,
    paddingTop: spacing.stackLg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(196,198,208,0.3)',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: spacing.base * 3,
  },
  linkPressed: { opacity: 0.6 },
  linkLabel: {
    ...typography.bodyMd,
    fontFamily: typography.caption.fontFamily,
    fontSize: 15,
    color: colors.onSurface,
  },
  sources: {
    gap: spacing.stackSm,
    paddingLeft: spacing.stackSm,
    borderLeftWidth: 2,
    borderLeftColor: colors.surfaceVariant,
  },
  sourceLine: {
    ...typography.caption,
    color: colors.outline,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceUrl: {
    ...typography.caption,
    color: colors.aggieBlue,
  },
  pending: {
    ...typography.caption,
    color: colors.onSecondaryContainer,
    backgroundColor: colors.tintGold,
    padding: spacing.stackSm + spacing.base,
    borderRadius: radius.base,
    overflow: 'hidden',
  },
  disclaimer: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackLg,
  },
  remind: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.aggieBlue,
    marginBottom: spacing.stackSm,
  },
  remindOn: {
    backgroundColor: colors.aggieBlue,
    borderColor: colors.aggieBlue,
  },
  remindLabel: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    fontSize: 15,
    color: colors.aggieBlue,
  },
  cta: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.stackSm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(196,198,208,0.2)',
    backgroundColor: 'rgba(248,249,255,0.98)',
  },
});
