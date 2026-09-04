import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  View,
  type TextStyle,
} from 'react-native';

type Props = {
  /** Split on spaces; each word folds in on its own delay. */
  children: string;
  style?: TextStyle;
  /** Stagger between words, ms. Matches the mock's .delay-1…-5 steps. */
  stagger?: number;
};

const DURATION = 800;
/** cubic-bezier(0.175, 0.885, 0.32, 1.275) — the overshoot from the mock. */
const EASING = Easing.bezier(0.175, 0.885, 0.32, 1.275);

/**
 * The headline entrance: each word rotates up from flat with a slight
 * overshoot. Purely decorative, so it is skipped entirely when the user has
 * "Reduce Motion" on — the text renders in its final position instead.
 */
export function FoldText({ children, style, stagger = 100 }: Props) {
  const words = children.split(' ');
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  // One driver per word, retained across renders.
  const progress = useRef(words.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (cancelled) return;
      setReduceMotion(enabled);

      if (enabled) {
        progress.forEach((value) => value.setValue(1));
        return;
      }

      Animated.stagger(
        stagger,
        progress.map((value) =>
          Animated.timing(value, {
            toValue: 1,
            duration: DURATION,
            easing: EASING,
            useNativeDriver: true,
          }),
        ),
      ).start();
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [progress, stagger]);

  // Hold the frame until the preference is known, so a reduce-motion user
  // never catches the first frame of an animation we are about to cancel.
  if (reduceMotion === null) {
    return (
      <View style={styles.row}>
        {words.map((word, i) => (
          <Animated.Text key={`${word}-${i}`} style={[style, styles.hidden]}>
            {word}
          </Animated.Text>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {words.map((word, i) => (
        <Animated.Text
          key={`${word}-${i}`}
          style={[
            style,
            {
              opacity: progress[i],
              transform: [
                { perspective: 1000 },
                {
                  rotateX: progress[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['90deg', '0deg'],
                  }),
                },
                {
                  translateY: progress[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {word}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // Words are separate Text nodes, so the inter-word space is a real gap.
    columnGap: 9,
  },
  hidden: {
    opacity: 0,
  },
});
