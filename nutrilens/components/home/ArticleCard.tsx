import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  title: string;
  meta: string;
  tint: string;
  onPress?: () => void;
};

/**
 * A "Learn more" tile.
 *
 * NOTE: no article exists behind any of these. The titles come from the mock
 * and are content placeholders — see ARTICLES in data/progress.ts. Tapping one
 * goes to Discover rather than opening a dead end.
 */
export function ArticleCard({ title, meta, tint, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${meta}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: tint },
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{meta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 110,
    padding: 14,
    borderRadius: radius.md,
    justifyContent: 'space-between',
  },
  pressed: { opacity: 0.9 },
  title: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: colors.aggieBlue,
  },
  meta: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    paddingTop: spacing.stackSm,
  },
});
