import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  label: string;
};

/**
 * Small Vito pill above the question ("Let's get to know you").
 *
 * The mascot carries tone here and nothing else — the chip never states a
 * finding, and removing it would cost no information. That is the test for
 * whether a mascot appearance is allowed.
 */
export function MascotChip({ label }: Props) {
  return (
    <View style={styles.chip}>
      <Image
        source={require('../../assets/brand/vito-avatar.png')}
        style={styles.avatar}
        resizeMode="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.stackSm,
    paddingLeft: 6,
    paddingRight: spacing.base * 3,
    paddingVertical: spacing.base,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    backgroundColor: colors.surfaceContainerLow,
  },
  label: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
});
