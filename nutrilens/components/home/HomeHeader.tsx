import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  greeting: string;
  name?: string;
  initial: string;
  onProfile?: () => void;
};

/**
 * Home's top bar: a soft blue wash, a decorative ring motif, the wordmark, the
 * profile avatar and the greeting.
 *
 * The decoration is drawn rather than shipped as an image so it scales to any
 * width and costs nothing to recolour. Blur is faked with low-opacity discs —
 * a real blur would need expo-blur and an extra native module for two shapes
 * nobody will look at directly.
 *
 * NOTE: the mock places a bitmap logo here (a temporary Stitch CDN URL). We do
 * not have that asset, so the wordmark is set in type next to Vito's avatar.
 * Drop a real logo in and it replaces the two elements in `brand` below.
 */
export function HomeHeader({ greeting, name, initial, onProfile }: Props) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['rgba(238,244,250,0.8)', colors.surface, colors.surface]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative only — hidden from screen readers. */}
      <View
        style={styles.decor}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.blobBlue} />
        <View style={styles.blobGold} />
        <Svg
          width={288}
          height={288}
          viewBox="0 0 200 200"
          style={styles.rings}
          fill="none"
          stroke={colors.surfaceTint}
          strokeWidth={1.2}
        >
          <Circle cx="100" cy="100" r="80" strokeDasharray="4 6" opacity={0.15} />
          <Circle cx="100" cy="100" r="60" opacity={0.09} />
          <Circle cx="100" cy="100" r="40" strokeDasharray="2 4" opacity={0.12} />
          <Path d="M20 100 Q 60 40, 100 100 T 180 100" opacity={0.06} />
          <Path d="M30 130 Q 80 80, 130 130 T 190 110" opacity={0.045} />
        </Svg>
      </View>

      <View style={styles.row}>
        <View style={styles.brand}>
          <Image
            source={require('../../assets/brand/vito-avatar.png')}
            style={styles.mark}
            resizeMode="cover"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <Text style={styles.wordmark}>NutriLens</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Your profile"
          onPress={onProfile}
          style={({ pressed }) => [styles.avatarRing, pressed && styles.pressed]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.greeting} accessibilityRole="header">
        {name ? `${greeting}, ${name}` : greeting}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.base * 5,
    paddingBottom: spacing.stackMd,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184,208,232,0.4)',
    overflow: 'hidden',
  },
  decor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    overflow: 'hidden',
  },
  rings: {
    position: 'absolute',
    top: -48,
    right: -32,
  },
  blobBlue: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 176,
    height: 176,
    borderRadius: radius.full,
    backgroundColor: 'rgba(171,200,250,0.18)',
  },
  blobGold: {
    position: 'absolute',
    top: 8,
    right: 48,
    width: 112,
    height: 112,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,223,160,0.22)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
  },
  wordmark: {
    ...typography.h1Mobile,
    color: colors.aggieBlue,
  },
  avatarRing: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    padding: 2,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  pressed: { opacity: 0.85 },
  avatar: {
    flex: 1,
    borderRadius: radius.full,
    backgroundColor: colors.aggieBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...typography.caption,
    fontFamily: typography.micro.fontFamily,
    color: colors.onPrimary,
  },
  greeting: {
    ...typography.h1Mobile,
    color: colors.aggieBlue,
    marginTop: spacing.stackSm,
  },
});
