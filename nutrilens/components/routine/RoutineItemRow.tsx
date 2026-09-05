import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RoutineItem, RoutineItemType } from '../../data/RoutineContext';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  item: RoutineItem;
  done: boolean;
  onToggle: () => void;
  reminderOn?: boolean;
  onToggleReminder?: () => void;
};

const TYPE_LABEL: Record<RoutineItemType, string> = {
  supplement: 'Supplement',
  food: 'Food',
  habit: 'Habit',
};

/**
 * The left edge stripe encodes the item's kind, so the mix of a routine is
 * readable down the margin without reading a word of it. That matters here:
 * a routine that is all navy is all pills, and the product's position is that
 * a 20-year-old should not be defaulted to a supplement for something a meal
 * would fix.
 */
const TYPE_STRIPE: Record<RoutineItemType, string> = {
  supplement: colors.primary,
  food: colors.secondaryContainer,
  habit: colors.surfaceTint,
};

const TYPE_CHIP: Record<RoutineItemType, { bg: string; fg: string }> = {
  supplement: { bg: colors.surfaceContainer, fg: colors.onPrimaryFixedVariant },
  food: { bg: 'rgba(255,223,160,0.5)', fg: colors.onSecondaryFixedVariant },
  habit: { bg: colors.surfaceContainerHigh, fg: colors.primary },
};

/**
 * One row of the routine checklist.
 *
 * A pending row is outlined and carries an explicit "Log" button as well as the
 * checkbox — two targets for the same action, which is the mock's decision and
 * a defensible one: the button names the verb, and the checkbox is the faster
 * repeat gesture once you know where it is.
 */
export function RoutineItemRow({
  item,
  done,
  onToggle,
  reminderOn = false,
  onToggleReminder,
}: Props) {
  const chip = TYPE_CHIP[item.type];

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: TYPE_STRIPE[item.type] },
        !done && styles.cardPending,
      ]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={`${item.title}. ${item.detail}`}
        onPress={onToggle}
        style={styles.main}
      >
        <View style={[styles.box, done && styles.boxDone]}>
          {done && <Icon name="check" size={16} color={colors.onPrimary} />}
        </View>

        <View style={styles.text}>
          <Text style={[styles.title, done && styles.titleDone]}>{item.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.time}>{item.detail}</Text>
            <View style={[styles.chip, { backgroundColor: chip.bg }]}>
              <Text style={[styles.chipText, { color: chip.fg }]}>
                {TYPE_LABEL[item.type]}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      {/* The reminder sits on every row, done or not - the point of a reminder
          is tomorrow, not today. */}
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: reminderOn }}
        accessibilityLabel={
          reminderOn
            ? `Daily reminder on for ${item.title}. Tap to turn it off.`
            : `Remind me daily about ${item.title}`
        }
        onPress={onToggleReminder}
        style={({ pressed }) => [
          styles.bell,
          reminderOn && styles.bellOn,
          pressed && styles.morePressed,
        ]}
      >
        <Icon
          name={reminderOn ? 'notifications-active' : 'notifications-none'}
          size={18}
          color={reminderOn ? colors.onPrimary : colors.outline}
        />
      </Pressable>

      {done ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Options for ${item.title}`}
          style={({ pressed }) => [styles.more, pressed && styles.morePressed]}
        >
          <Icon name="more-vert" size={20} color={colors.outline} />
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Log ${item.title}`}
          onPress={onToggle}
          style={({ pressed }) => [styles.log, pressed && styles.logPressed]}
        >
          <Icon name="add" size={16} color={colors.onPrimary} />
          <Text style={styles.logLabel}>Log</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#435f8b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPending: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primaryFixed,
    borderLeftWidth: 4,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base * 3,
    minHeight: 44,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: { flex: 1, gap: 2 },
  title: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    fontSize: 15,
    lineHeight: 20,
    color: colors.onSurface,
  },
  titleDone: {
    color: colors.outline,
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    flexWrap: 'wrap',
  },
  time: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.outline,
  },
  chip: {
    paddingHorizontal: spacing.stackSm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  chipText: {
    ...typography.micro,
    letterSpacing: 0,
  },
  bell: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  bellOn: {
    backgroundColor: colors.aggieBlue,
    borderColor: colors.aggieBlue,
  },
  more: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  morePressed: { backgroundColor: colors.surfaceContainerLow },
  log: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    paddingHorizontal: spacing.base * 3,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  logPressed: { opacity: 0.85 },
  logLabel: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
    color: colors.onPrimary,
  },
});
