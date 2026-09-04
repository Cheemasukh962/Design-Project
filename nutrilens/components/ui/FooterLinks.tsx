import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export type FooterLink = {
  label: string;
  onPress?: () => void;
};

type Props = {
  links: FooterLink[];
};

/**
 * The dot-separated legal/help row.
 *
 * Per the PRD this is not fine print: it stays fully legible (13px at 70%
 * opacity on the page ground clears 4.5:1) and every item is a real 44pt touch target.
 */
export function FooterLinks({ links }: Props) {
  return (
    <View style={styles.row}>
      {links.map((link, i) => (
        <Fragment key={link.label}>
          {i > 0 && <Text style={styles.separator}>·</Text>}
          <Pressable
            accessibilityRole="link"
            onPress={link.onPress}
            hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
          >
            {({ pressed }) => (
              <Text style={[styles.link, pressed && styles.linkPressed]}>{link.label}</Text>
            )}
          </Pressable>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base * 2,
  },
  link: {
    ...typography.caption,
    color: colors.outline,
    opacity: 0.7,
  },
  linkPressed: {
    color: colors.primary,
    opacity: 1,
  },
  separator: {
    ...typography.caption,
    color: colors.outline,
    opacity: 0.7,
  },
});
