import { useState, type ReactNode } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon, type IconName } from './Icon';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string;
  children: ReactNode;
  /** Open on first render. Keep the detail page's tier-2 sections closed. */
  defaultOpen?: boolean;
  /** Leading glyph in the header, e.g. `biotech` on "What it does". */
  icon?: IconName;
  /**
   * `card` — a filled panel with a border, used for "What it does".
   * `plain` — no fill or border, used for the footer's "Sources" row.
   */
  variant?: 'card' | 'plain';
};

/**
 * Collapsible section, used for the detail page's second tier.
 *
 * Tier one answers "what is this and should I care" without scrolling; tier two
 * holds dosage, sources and purchase info for the smaller number of people who
 * want it. Collapsing it is what keeps the page from reading as a wall.
 */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  icon,
  variant = 'card',
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const plain = variant === 'plain';

  return (
    <View style={[styles.wrap, plain && styles.wrapPlain]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((o) => !o);
        }}
        style={[styles.header, plain && styles.headerPlain]}
      >
        {icon && (
          <View style={styles.icon}>
            <Icon name={icon} size={22} color={colors.surfaceTint} />
          </View>
        )}
        <Text style={[styles.title, plain && styles.titlePlain]}>{title}</Text>
        <View style={open ? styles.chevronOpen : undefined}>
          <Icon name="expand-more" size={22} color={colors.onSurfaceVariant} />
        </View>
      </Pressable>

      {open && (
        <View style={[styles.body, plain && styles.bodyPlain]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(196,198,208,0.2)',
    overflow: 'hidden',
  },
  wrapPlain: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  icon: {
    marginRight: spacing.stackSm + 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.cardPaddingSm,
    minHeight: 56,
  },
  headerPlain: {
    paddingHorizontal: 0,
    paddingVertical: spacing.base * 3,
    minHeight: 48,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  title: {
    ...typography.h3,
    color: colors.primary,
    flex: 1,
    paddingRight: spacing.stackMd,
  },
  titlePlain: {
    ...typography.bodyMd,
    fontFamily: typography.caption.fontFamily,
    fontSize: 15,
    color: colors.onSurface,
  },
  body: {
    paddingHorizontal: spacing.cardPaddingSm,
    paddingBottom: spacing.cardPaddingSm,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(196,198,208,0.15)',
    gap: spacing.base * 3,
  },
  bodyPlain: {
    paddingHorizontal: 0,
    borderTopWidth: 0,
    paddingTop: 0,
  },
});
