import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  type ImageStyle,
  type ImageSourcePropType,
} from 'react-native';

/**
 * Pose library. Vito's pose is a state indicator, not decoration — `thinking`
 * means the app is working, `thumbsUp` means nothing was found, `rest` means
 * an empty state. Only `idle` has art so far; the rest fall back to it.
 */
export type VitoPose = 'idle' | 'flex' | 'wave' | 'thinking' | 'thumbsUp' | 'point' | 'rest';

const POSES: Record<VitoPose, ImageSourcePropType> = {
  idle: require('../../assets/brand/vito-idle.png'),
  flex: require('../../assets/brand/vito-idle.png'),
  wave: require('../../assets/brand/vito-idle.png'),
  thinking: require('../../assets/brand/vito-idle.png'),
  thumbsUp: require('../../assets/brand/vito-idle.png'),
  point: require('../../assets/brand/vito-idle.png'),
  rest: require('../../assets/brand/vito-idle.png'),
};

/** The three sizes from the design system. Never scale outside these. */
export const VITO_SIZE = {
  hero: 160,
  inline: 80,
  avatar: 40,
} as const;

type Props = {
  pose?: VitoPose;
  size?: number;
  /** Subtle vertical float, ~1.5s cycle. Off for static contexts. */
  float?: boolean;
  style?: ImageStyle;
};

export function VitoMascot({
  pose = 'idle',
  size = VITO_SIZE.hero,
  float = true,
  style,
}: Props) {
  const offset = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!float || reduceMotion) {
      offset.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(offset, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(offset, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float, offset, reduceMotion]);

  return (
    <Animated.Image
      source={POSES[pose]}
      resizeMode="contain"
      // Decorative: the mascot carries tone, never information. Anything it
      // would "say" must also exist as real text on the screen.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.image,
        { width: size, height: size },
        {
          transform: [
            {
              translateY: offset.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              }),
            },
          ],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    // The source render ships on a white ground rather than transparent, so it
    // reads as a faint square on the page ground. Replace with a cut-out PNG.
    backgroundColor: 'transparent',
  },
});
