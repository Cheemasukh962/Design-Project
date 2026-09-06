import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { CareMeter } from '../companion/CareMeter';
import { Creature } from '../companion/Creature';
import { Icon } from '../ui/Icon';
import { CARE, SPECIES } from '../../data/companion';
import { useCompanion } from '../../data/CompanionContext';
import { companion } from '../../theme/companion';
import { radius, spacing, typography } from '../../theme';

/** How long the pal stays visibly pleased after a check-in. */
const REACTION_MS = 2200;

/**
 * The pal, on the screen where you actually check in.
 *
 * WHY IT IS HERE. HP is the mechanic that answers "did today matter", and it
 * lived on three screens — none of them the checklist. So the one moment the
 * meter moves was the one moment nobody could see it. Ticking an item now has
 * a visible consequence a foot from the checkbox: the heart fills, a +HP
 * floats up, and the creature stops looking sleepy and bounces.
 *
 * It is also the honest form of the whole argument. "Check in every day and
 * your pal stays well" is a sentence; watching the heart rise the instant you
 * tick something is the same claim, demonstrated.
 */
export function CheckInPal() {
  const { hydrated, speciesId, care, mood, lastGain } = useCompanion();

  const [reacting, setReacting] = useState(false);
  const float = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const seen = useRef<number>(0);

  useEffect(() => {
    if (!lastGain || lastGain.at === seen.current) return;
    seen.current = lastGain.at;
    setReacting(true);

    float.setValue(0);
    bounce.setValue(0);
    Animated.parallel([
      // The +HP rises and fades.
      Animated.timing(float, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // Two quick hops. Enough to read as delight, short enough not to nag.
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 320,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const t = setTimeout(() => setReacting(false), REACTION_MS);
    return () => clearTimeout(t);
  }, [lastGain, float, bounce]);

  if (!hydrated || !speciesId) return null;

  const species = SPECIES[speciesId];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${species.names[0]}. HP ${Math.round(care)} percent. Open your pal.`}
      onPress={() => router.push('/companion')}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Animated.View
        style={{
          transform: [
            { translateY: bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
          ],
        }}
      >
        {/* Forced happy while reacting, so the face confirms the tick even
            when HP was already full and the bar cannot move. */}
        <Creature
          species={speciesId}
          stage={0}
          mood={reacting ? 'happy' : mood}
          size={64}
          glow={false}
          animate={false}
        />
      </Animated.View>

      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {reacting ? 'Nice one' : care >= 75 ? 'Doing well' : 'Needs a tick today'}
          </Text>

          {/* The gain rides beside the title rather than floating over the
              meter, where it landed on top of the percentage it was announcing. */}
          <Animated.View
            pointerEvents="none"
            style={{
              opacity: float.interpolate({
                inputRange: [0, 0.12, 0.7, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [6, -8] }) },
              ],
            }}
          >
            <Text style={[styles.gainText, { color: species.palette.accent }]}>
              +{lastGain?.amount ?? CARE.RECOVER} HP
            </Text>
          </Animated.View>
        </View>
        <Text style={styles.rule}>
          Tick something: +{CARE.RECOVER} HP. Skip a day: −{CARE.DECAY}.
        </Text>
      </View>

      <CareMeter care={care} fill={species.palette.accent} size={44} layout="stack" />

      <Icon name="chevron-right" size={20} color={companion.onNightMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    padding: spacing.stackSm,
    borderRadius: radius.md,
    backgroundColor: companion.night,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: companion.nightLine,
  },
  pressed: { opacity: 0.92 },
  text: { flex: 1, gap: 2 },
  title: { ...typography.bodyMd, fontFamily: typography.h3.fontFamily, color: companion.onNight },
  rule: { ...typography.micro, letterSpacing: 0, color: companion.onNightMuted },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  gainText: { ...typography.micro, letterSpacing: 0, fontFamily: typography.h3.fontFamily },
});
