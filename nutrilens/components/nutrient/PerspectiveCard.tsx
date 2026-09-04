import { StyleSheet, Text, View } from 'react-native';
import type { Perspective } from '../../data/nutrients';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';
import { Photo } from '../ui/Photo';

type Props = {
  perspective: Perspective;
};

/**
 * The navy "Athlete perspective" card from the Vitamin D mock.
 *
 * ONE ADDITION TO THE MOCK, and it is deliberate: the "Illustrative persona"
 * line under the name. Marcus Vance does not exist and never said this — the
 * mock generated a name, a portrait and a testimonial together. Shown to a
 * usability participant without a label, it functions as a real endorsement of
 * a health behaviour by a real person, which is the one thing a health
 * interface cannot do.
 *
 * The label is one `<Text>` and costs the design almost nothing. The proper
 * fixes — a real attributed quote, or a sourced statement with no face — are
 * described on the `Perspective` type in data/nutrients.ts. Deleting the label
 * without doing one of those is not one of the options.
 */
export function PerspectiveCard({ perspective }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.quoteMark} pointerEvents="none">
        <Icon name="format-quote" size={48} color={colors.onPrimary} />
      </View>

      <View style={styles.eyebrowRow}>
        <Icon name="insights" size={18} color={colors.primaryFixed} />
        <Text style={styles.eyebrow}>Athlete perspective</Text>
      </View>

      <Text style={styles.quote}>&ldquo;{perspective.quote}&rdquo;</Text>

      <View style={styles.attribution}>
        <Photo
          icon="person"
          tint={colors.surfaceContainerHigh}
          iconColor={colors.surfaceTint}
          radiusToken={radius.full}
          style={styles.avatar}
        />
        <View style={styles.who}>
          <Text style={styles.name}>{perspective.name}</Text>
          <Text style={styles.role}>{perspective.role}</Text>
          {perspective.fictional && (
            <Text style={styles.fictional}>Illustrative persona — not a real quote</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.cardPaddingLg,
    borderRadius: radius.md,
    backgroundColor: colors.aggieBlue,
    overflow: 'hidden',
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  quoteMark: {
    position: 'absolute',
    top: spacing.base * 3,
    right: spacing.base * 3,
    opacity: 0.1,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginBottom: spacing.base * 3,
  },
  eyebrow: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.primaryFixed,
  },
  quote: {
    ...typography.bodyMd,
    lineHeight: 24,
    color: 'rgba(248,249,255,0.95)',
    marginBottom: spacing.stackMd,
  },
  attribution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: 'rgba(213,227,255,0.2)',
  },
  who: { flex: 1 },
  name: {
    ...typography.bodyMd,
    fontFamily: typography.micro.fontFamily,
    fontSize: 15,
    lineHeight: 20,
    color: colors.surfaceBright,
  },
  role: {
    ...typography.caption,
    color: 'rgba(116,144,191,0.9)',
  },
  fictional: {
    ...typography.micro,
    letterSpacing: 0,
    color: 'rgba(171,200,250,0.75)',
    marginTop: 2,
  },
});
