import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../ui/Icon';

type Props = {
  label: string;
};

/**
 * The small pill above a quiz question ("Let's get to know you").
 *
 * It used to carry a mascot avatar. That is wrong here for a concrete reason:
 * the pal is chosen *after* the quiz, so any creature shown during it belongs
 * to nobody — and showing one the user has not picked undercuts the choice they
 * are about to make.
 *
 * The chip carries tone and nothing else. Removing it would cost no
 * information, which is the test for whether it is allowed to exist.
 */
export function MascotChip({ label }: Props) {
  return (
    <View style={styles.chip}>
      <Icon name="auto-awesome" size={16} color={colors.aggieBlue} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.base * 3,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  label: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
});
