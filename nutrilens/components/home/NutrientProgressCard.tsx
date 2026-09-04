import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NutrientProgress } from '../../data/progress';
import { accentFor, type Nutrient } from '../../data/nutrients';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';
import { Photo } from '../ui/Photo';

type Props = {
  nutrient: Nutrient;
  progress: NutrientProgress;
  onPress?: () => void;
};

export const CARD_WIDTH = 142;

/**
 * The gamified nutrient card from the Home mock: a photo, a level badge, a
 * "% filled" overlay, a buff chip and a progress bar.
 *
 * EVERY NUMBER ON THIS CARD IS INVENTED — see data/progress.ts. The app has no
 * intake log, so "80% filled" is not measuring anything. That file is where the
 * values live and where the decision about keeping them belongs; this component
 * only draws what it is handed.
 */
export function NutrientProgressCard({ nutrient, progress, onPress }: Props) {
  // The nutrient's permanent colour, not a colour for how it is going.
  const accent = accentFor(nutrient.id);
  const complete = progress.percent >= 100;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${nutrient.name}, ${progress.badge}, ${progress.percent}% filled`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: accent.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.photoRing, { borderColor: accent.border, backgroundColor: accent.surface }]}>
        <Photo
          uri={undefined}
          icon={nutrient.foods[0]?.icon ?? 'fruit-citrus'}
          tint={accent.surface}
          iconColor={accent.base}
          radiusToken={radius.sm}
          style={styles.photo}
        />
        <View
          style={[
            styles.overlay,
            // Completion is a status, so it stays green — the one place a
            // status colour is allowed, because it is not naming the nutrient.
            { backgroundColor: complete ? 'rgba(46,125,91,0.9)' : 'rgba(0,20,46,0.8)' },
          ]}
        >
          <Text style={styles.overlayText}>
            {complete ? 'Done' : `${progress.percent}% filled`}
          </Text>
        </View>
      </View>

      <View style={[styles.badge, { backgroundColor: accent.base }]}>
        <Icon name={progress.badgeIcon} size={11} color={colors.onPrimary} />
        <Text style={styles.badgeText}>{progress.badge}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {nutrient.name}
        </Text>

        <View style={[styles.buff, { backgroundColor: accent.surface }]}>
          <Text style={[styles.buffText, { color: accent.text }]} numberOfLines={1}>
            {progress.buffEmoji} {progress.buff}
          </Text>
        </View>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${Math.min(100, Math.max(0, progress.percent))}%`, backgroundColor: accent.base },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  pressed: { opacity: 0.94 },
  photoRing: {
    height: 96,
    borderRadius: radius.base,
    borderWidth: 2,
    padding: 2,
    marginBottom: spacing.stackSm,
    overflow: 'hidden',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  overlayText: {
    ...typography.micro,
    fontSize: 10,
    letterSpacing: 0.3,
    color: colors.onPrimary,
  },
  badge: {
    position: 'absolute',
    top: spacing.stackSm,
    right: spacing.stackSm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.micro,
    fontSize: 10,
    letterSpacing: 0,
    color: colors.onPrimary,
  },
  body: { gap: spacing.base },
  name: {
    ...typography.bodyMd,
    fontFamily: typography.micro.fontFamily,
    fontSize: 15,
    lineHeight: 18,
    color: colors.onBackground,
  },
  buff: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  buffText: {
    ...typography.micro,
    fontSize: 11,
    letterSpacing: 0,
  },
  track: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
    marginTop: spacing.base,
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
