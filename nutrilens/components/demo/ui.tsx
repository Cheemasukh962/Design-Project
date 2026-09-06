import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon, type IconName } from "../ui/Icon";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={ui.eyebrow}>{children}</Text>;
}
export function Action({
  label,
  onPress,
  secondary = false,
  disabled = false,
  icon = "arrow-forward",
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        ui.action,
        secondary && ui.secondary,
        disabled && { opacity: 0.55 },
        pressed && ui.pressed,
      ]}
    >
      <Text style={[ui.actionText, secondary && { color: c.teal }]}>
        {label}
      </Text>
      <Icon name={icon} size={19} color={secondary ? c.teal : c.background} />
    </Pressable>
  );
}
export function SectionHeading({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={ui.sectionHeading}>
      <Text style={ui.heading}>{title}</Text>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={ui.textButton}
        >
          <Text style={ui.link}>{action}</Text>
          <Icon name="chevron-right" size={17} color={c.teal} />
        </Pressable>
      )}
    </View>
  );
}
export const ui = StyleSheet.create({
  page: {
    gap: s.xl,
    paddingHorizontal: s.lg,
    paddingTop: s.xl,
    paddingBottom: s.xxl,
  },
  row: { flexDirection: "row", alignItems: "center", gap: s.md },
  spread: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: s.sm,
  },
  stack: { gap: s.md },
  title: { fontFamily: f.heading, fontSize: 36, lineHeight: 40, color: c.ink },
  heading: {
    flexShrink: 1,
    fontFamily: f.heading,
    fontSize: 25,
    lineHeight: 31,
    color: c.ink,
  },
  body: { fontFamily: f.body, fontSize: 13, lineHeight: 21, color: c.muted },
  label: { fontFamily: f.medium, fontSize: 14, lineHeight: 21, color: c.ink },
  small: { fontFamily: f.body, fontSize: 11, lineHeight: 17, color: c.muted },
  eyebrow: {
    fontFamily: f.bold,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: c.muted,
  },
  card: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 20,
    padding: s.lg,
    gap: s.md,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: s.sm,
    marginBottom: s.sm,
  },
  textButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: s.xs,
  },
  link: { fontFamily: f.medium, fontSize: 12, color: c.teal },
  action: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: c.teal,
    padding: s.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s.md,
  },
  actionText: { fontFamily: f.medium, fontSize: 13, color: c.background },
  secondary: { backgroundColor: c.tealWash },
  pressed: { opacity: 0.7 },
  badge: {
    flexShrink: 0,
    minWidth: 72,
    textAlign: "center",
    fontFamily: f.medium,
    fontSize: 10,
    lineHeight: 17,
    color: c.green,
    backgroundColor: c.sage,
    paddingHorizontal: s.sm,
    paddingVertical: s.xs,
    borderRadius: 30,
    overflow: "hidden",
  },
});
