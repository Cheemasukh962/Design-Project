import { useState } from 'react';
import { Image, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius } from '../../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  /**
   * Remote image. The Stitch exports point at temporary Google CDN URLs which
   * will eventually 404, so this is optional and always sits over a fallback.
   */
  uri?: string;
  /** Glyph shown when there is no image, or when the image fails to load. */
  icon: IconName;
  /** Fallback tile fill. */
  tint?: string;
  iconColor?: string;
  /** Fallback glyph size. Scale it with the frame — a 28px dot in a 128px box
   *  reads as a failed image rather than as a deliberate placeholder. */
  iconSize?: number;
  radiusToken?: number;
  style?: ViewStyle;
};

/**
 * A photo slot that degrades honestly.
 *
 * The mocks use food photography we do not own — the URLs in the export are
 * short-lived Stitch CDN links. Rather than shipping a broken image box, this
 * renders a tinted tile with the nutrient's own glyph and swaps the photo in
 * only if it actually loads. Layout is identical either way, so dropping real
 * photography in later changes nothing structural.
 */
export function Photo({
  uri,
  icon,
  tint = colors.tintBlue,
  iconColor = colors.surfaceTint,
  iconSize = 28,
  radiusToken = radius.base,
  style,
}: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;

  return (
    <View
      style={[styles.frame, { backgroundColor: tint, borderRadius: radiusToken }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {showImage ? (
        <Image
          source={{ uri }}
          resizeMode="cover"
          onError={() => setFailed(true)}
          style={[styles.image, { borderRadius: radiusToken }]}
        />
      ) : (
        <Icon name={icon} size={iconSize} color={iconColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
