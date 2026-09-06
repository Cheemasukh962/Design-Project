import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  /** Shown centred when `onBack` is set, left-aligned as a wordmark otherwise. */
  title: string;
  onBack?: () => void;
  actionIcon?: IconName;
  onAction?: () => void;
  actionLabel?: string;
  /** Filled/tinted state, e.g. a nutrient that is already saved. */
  actionActive?: boolean;
};

/**
 * The shared top bar for non-quiz screens. The quiz uses QuizHeader instead —
 * it needs a stepper, not a title.
 */
export function AppBar({
  title,
  onBack,
  actionIcon,
  onAction,
  actionLabel,
  actionActive = false,
}: Props) {
  return (
    <View style={styles.bar}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={({ pressed }) => [styles.touch, pressed && styles.pressed]}
        >
          <Icon name="arrow-back" size={24} color="#0F1720" />
        </Pressable>
      ) : (
        <View style={styles.touch} />
      )}

      <Text style={onBack ? styles.title : styles.wordmark} numberOfLines={1}>
        {title}
      </Text>

      {actionIcon ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel ?? 'Action'}
          onPress={onAction}
          style={({ pressed }) => [styles.touch, pressed && styles.pressed]}
        >
          <Icon
            name={actionActive ? 'favorite' : actionIcon}
            size={22}
            color={actionActive ? colors.aggieBlue : colors.onSurfaceVariant}
          />
        </Pressable>
      ) : (
        <View style={styles.touch} />
      )}
    </View>
  );
}

const TOUCH = 44;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
  },
  touch: {
    width: TOUCH,
    height: TOUCH,
    marginHorizontal: -spacing.stackSm,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  title: {
    ...typography.h3,
    color: '#0F1720',
    flex: 1,
    textAlign: 'center',
  },
  wordmark: {
    ...typography.h3,
    color: colors.aggieBlue,
    flex: 1,
    textAlign: 'left',
    marginLeft: spacing.stackSm,
  },
});
