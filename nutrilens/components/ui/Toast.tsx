import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onHide: () => void;
  /** Milliseconds on screen before it dismisses itself. */
  duration?: number;
};

/**
 * Confirmation toast with an undo affordance.
 *
 * Undo matters more than the confirmation does: adding something to a routine
 * is the one destructive-ish action on the results screen, and an immediate,
 * obvious reversal is cheaper than a confirm dialog before every add.
 */
export function Toast({
  message,
  actionLabel,
  onAction,
  onHide,
  duration = 3200,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(onHide);
    }, duration);

    return () => clearTimeout(timer);
  }, [anim, duration, onHide]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.toast,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
          ],
        },
      ]}
    >
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      {actionLabel && (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          hitSlop={12}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.screenMargin,
    right: spacing.screenMargin,
    bottom: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.stackMd,
    paddingHorizontal: spacing.cardPaddingSm,
    paddingVertical: spacing.base * 3,
    borderRadius: radius.md,
    backgroundColor: colors.inverseSurface,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  message: {
    ...typography.bodyMd,
    color: colors.inverseOnSurface,
    flexShrink: 1,
  },
  action: {
    ...typography.caption,
    color: colors.secondaryContainer,
  },
});
