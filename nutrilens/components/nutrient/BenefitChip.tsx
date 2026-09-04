import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  label: string;
};

/**
 * One cell of the "Essential for" grid at the top of a nutrient page.
 *
 * These are functions of the nutrient in the body — "Bone strength", "Immune
 * function". They are not claims about the reader, which is what keeps this
 * page on the right side of the no-diagnosis rule.
 */
export function BenefitChip({ label }: Props) {
  return (
    <View style={styles.chip}>
      <Icon name="check-circle" size={20} color={colors.surfaceTint} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    paddingHorizontal: 10,
    paddingVertical: spacing.stackSm,
    borderRadius: radius.base,
    backgroundColor: 'rgba(248,249,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(196,198,208,0.35)',
  },
  label: {
    ...typography.bodyMd,
    fontFamily: typography.caption.fontFamily,
    fontSize: 15,
    lineHeight: 18,
    color: colors.onSurface,
    flexShrink: 1,
  },
});
