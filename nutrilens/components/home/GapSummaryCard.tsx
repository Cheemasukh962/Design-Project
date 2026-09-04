import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  label: string;
  onPress?: () => void;
};

/**
 * The gold banner under the greeting — the one route back to the results.
 *
 * Gold, not red. A nutrient gap is an opportunity in this product's language,
 * and colouring it as an alert is the fastest way to make a 20-year-old close
 * the app.
 */
export function GapSummaryCard({ label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <View style={styles.glyph}>
          <Icon name="auto-awesome" size={18} color={colors.onSecondaryContainer} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Icon name="arrow-forward" size={20} color={colors.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.base * 3,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.secondaryFixed,
    shadowColor: '#435f8b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  pressed: { opacity: 0.92 },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    flex: 1,
  },
  glyph: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.bodyLg,
    fontFamily: typography.micro.fontFamily,
    fontSize: 17,
    lineHeight: 22,
    color: colors.onBackground,
    flex: 1,
  },
});
