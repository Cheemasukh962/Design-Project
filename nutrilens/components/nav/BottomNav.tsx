import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon, type IconName } from '../ui/Icon';

/**
 * The bottom navigation bar, drawn to match the Home and Routine mocks.
 *
 * The default tab bar cannot produce this: the active destination is a filled
 * navy pill that wraps its icon and label together, not a tinted icon. So the
 * bar is custom, and the four destinations are declared in the layout beside
 * it rather than here.
 *
 * ONE DEPARTURE. The mock sets the active icon to `on-primary-container`
 * (#7490bf) and only the label to white. That muted blue on the navy pill
 * lands around 2.4:1 against its own background — under the 3:1 minimum for a
 * meaningful glyph, and it is the marker for "where am I". Stitch produced it
 * by mapping the M3 token mechanically. Both icon and label are white here.
 */
const ICONS: Record<string, IconName> = {
  home: 'home',
  discover: 'explore',
  routine: 'calendar-today',
  profile: 'person',
};

export function BottomNav({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.stackMd) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.title === 'string' ? options.title : route.name;
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={({ pressed }) => [
              styles.item,
              focused && styles.itemActive,
              pressed && !focused && styles.itemPressed,
            ]}
          >
            <Icon
              name={ICONS[route.name] ?? 'home'}
              size={22}
              color={focused ? colors.onPrimary : colors.outline}
            />
            <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.stackMd,
    paddingTop: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    // Upward shadow. iOS takes a negative offset; Android's elevation cannot
    // point up, so it gets a hairline instead of a fake glow.
    ...Platform.select({
      ios: {
        shadowColor: '#435f8b',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      default: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.hairline,
      },
    }),
  },
  item: {
    minHeight: 44,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.base,
    borderRadius: radius.full,
  },
  itemActive: {
    backgroundColor: colors.aggieBlue,
  },
  itemPressed: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  label: {
    ...typography.micro,
    letterSpacing: 0,
    color: colors.outline,
  },
  labelActive: {
    color: colors.onPrimary,
  },
});
