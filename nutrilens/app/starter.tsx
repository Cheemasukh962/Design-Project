import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Creature } from '../components/companion/Creature';
import { Icon } from '../components/ui/Icon';
import { Screen } from '../components/ui/Screen';
import { SPECIES_LIST } from '../data/companion';
import { useCompanion } from '../data/CompanionContext';
import { companion } from '../theme/companion';
import { radius, spacing, typography } from '../theme';

/**
 * Starter selection — one pal at a time, swiped between.
 *
 * A list of three showed all of them at once, which is efficient and completely
 * wrong for this screen. The job here is not comparison, it is attachment: each
 * creature should get the whole screen, at a size where its face reads, before
 * the user moves on. Committing to one means leaving the others behind, and a
 * pager makes that feel like a choice rather than a form field.
 *
 * The copy is down to one line. Each pal used to carry a personality label, a
 * pitch, affinity tags and an evolution preview, which turned a choice between
 * three pictures into a spec sheet to be compared. They are mechanically
 * identical, so there is nothing to compare and nothing to regret — the picture
 * and the name are the whole decision, and the one line above says the only
 * thing a person needs to know before making it.
 *
 * Arrows as well as swipe: this gets reviewed in a desktop browser, where a
 * horizontal drag is not a gesture anyone will try.
 */
export default function StarterRoute() {
  const { choose } = useCompanion();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const [index, setIndex] = useState(0);
  const scroller = useRef<ScrollView>(null);

  const species = SPECIES_LIST[index];
  const last = SPECIES_LIST.length - 1;

  // Height is measured too, and applied to each page. Relying on the scroll
  // container to stretch its children left the content floating above centre.
  const onLayout = (e: LayoutChangeEvent) =>
    setSize({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width === 0) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(Math.min(last, Math.max(0, i)));
  };

  const goTo = (i: number) => {
    const clamped = Math.min(last, Math.max(0, i));
    setIndex(clamped);
    scroller.current?.scrollTo({ x: clamped * width, animated: true });
  };

  const confirm = () => {
    choose(species.id);
    // Straight on to the results when this sits inside the quiz flow, so the
    // pal is already there when the findings land.
    router.replace(next === 'results' ? '/results' : '/home');
  };

  return (
    <Screen background="night" padded={false}>
      <View style={styles.head}>
        <Text style={styles.title} accessibilityRole="header">
          Pick your pal
        </Text>
        <Text style={styles.sub}>It grows as you keep up your routine.</Text>
      </View>

      <View style={styles.pagerWrap} onLayout={onLayout}>
        {width > 0 && (
          <ScrollView
            ref={scroller}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            decelerationRate="fast"
            onMomentumScrollEnd={onScrollEnd}
            style={styles.pager}
            contentContainerStyle={styles.pagerContent}
          >
            {SPECIES_LIST.map((s, i) => (
              <View key={s.id} style={[styles.page, { width, height }]}>
                {/* With the copy gone the creature is the page, so it is sized
                    to the frame rather than to a leftover gap. */}
                <Creature
                  species={s.id}
                  stage={0}
                  size={Math.min(300, width - spacing.screenMargin * 2)}
                  glow
                  animate={i === index}
                />

                <Text style={[styles.name, { color: s.palette.accent }]}>
                  {s.names[0]}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Arrows, for anyone reviewing this with a mouse. */}
        {index > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous pal"
            onPress={() => goTo(index - 1)}
            style={[styles.arrow, styles.arrowLeft]}
          >
            <Icon name="chevron-right" size={22} color={companion.onNight} />
          </Pressable>
        )}
        {index < last && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next pal"
            onPress={() => goTo(index + 1)}
            style={[styles.arrow, styles.arrowRight]}
          >
            <Icon name="chevron-right" size={22} color={companion.onNight} />
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SPECIES_LIST.map((s, i) => (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityLabel={`Show ${s.names[0]}`}
              onPress={() => goTo(i)}
              hitSlop={10}
              style={[
                styles.dot,
                i === index && { width: 22, backgroundColor: s.palette.base },
              ]}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={confirm}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: species.palette.base },
            pressed && styles.ctaPressed,
          ]}
        >
          <Text style={styles.ctaLabel}>Choose {species.names[0]}</Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: spacing.screenMargin, paddingTop: spacing.stackSm },
  title: { ...typography.h1, color: companion.onNight },
  sub: {
    ...typography.bodyMd,
    color: companion.onNightMuted,
    marginTop: spacing.stackSm,
  },
  pagerWrap: { flex: 1 },
  pager: { flex: 1 },
  pagerContent: { alignItems: 'stretch' },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    // Clear of the arrows, which are 40px discs inset 6px from each edge.
    paddingHorizontal: spacing.screenMargin + 32,
    gap: spacing.stackSm,
  },
  name: { ...typography.display, fontSize: 34, lineHeight: 40, marginTop: spacing.stackMd },
  arrow: {
    position: 'absolute',
    top: '42%',
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: companion.nightRaised,
    borderWidth: 1,
    borderColor: companion.nightLine,
  },
  arrowLeft: { left: 6, transform: [{ rotate: '180deg' }] },
  arrowRight: { right: 6 },
  footer: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.stackSm,
    gap: spacing.stackSm,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginBottom: spacing.base,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: companion.nightLine,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    height: 52,
    borderRadius: radius.md,
  },
  ctaPressed: { opacity: 0.85 },
  ctaLabel: { ...typography.h3, color: '#ffffff' },
});
