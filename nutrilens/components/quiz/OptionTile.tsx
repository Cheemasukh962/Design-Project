import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon, type IconName } from '../ui/Icon';

type Props = {
  label: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
};

/**
 * Multi-select tile (Q2), laid out two per row.
 *
 * The square checkbox is visible from the start, before anything is picked —
 * that is what tells the user more than one answer is allowed. Do not swap it
 * for a checkmark that only appears on selection.
 */
export function OptionTile({ label, icon, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        selected ? styles.tileSelected : styles.tileIdle,
        pressed && styles.tilePressed,
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconTile, selected && styles.iconTileSelected]}>
          <Icon
            name={icon}
            size={selected ? 20 : 22}
            color={selected ? colors.onPrimary : colors.aggieBlue}
          />
        </View>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </View>

      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Icon name="check" size={16} color={colors.onPrimary} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    padding: spacing.base * 3,
    borderRadius: radius.lg,
  },
  tileIdle: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tileSelected: {
    backgroundColor: '#EEF4FA',
    borderWidth: 2,
    borderColor: colors.aggieBlue,
    shadowColor: '#022851',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  tilePressed: {
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
    paddingRight: spacing.base,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
  },
  iconTileSelected: {
    backgroundColor: colors.aggieBlue,
  },
  label: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 14,
    lineHeight: 18,
    color: '#0F1720',
    flexShrink: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.base,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: colors.aggieBlue,
    backgroundColor: colors.aggieBlue,
  },
});
