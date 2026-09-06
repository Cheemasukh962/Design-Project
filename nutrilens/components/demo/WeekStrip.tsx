import { Pressable, StyleSheet, Text, View } from "react-native";
import { recentDays, type DayLog } from "../../data/journal";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";
import { ui } from "./ui";
export function WeekStrip({
  today,
  days,
  selected = today,
  onSelect,
}: {
  today: string;
  days: Record<string, DayLog>;
  selected?: string;
  onSelect?: (key: string) => void;
}) {
  return (
    <View style={styles.week}>
      {recentDays(today).map((day) => {
        const active = Boolean(
          days[day.key]?.done.length || days[day.key]?.meals.length,
        );
        return (
          <Pressable
            key={day.key}
            accessibilityRole="button"
            accessibilityLabel={`${day.key}${active ? ", activity logged" : ", no activity"}${day.key === today ? ", today" : ""}`}
            accessibilityState={{ selected: selected === day.key }}
            aria-pressed={selected === day.key}
            onPress={() => onSelect?.(day.key)}
            disabled={!onSelect}
            style={[styles.day, selected === day.key && styles.current]}
          >
            <Text
              style={[
                ui.small,
                selected === day.key && { color: c.background },
              ]}
            >
              {day.label}
            </Text>
            <Text
              style={[
                styles.date,
                selected === day.key && { color: c.background },
              ]}
            >
              {day.number}
            </Text>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: active
                    ? selected === day.key
                      ? c.sage
                      : c.green
                    : "transparent",
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  week: { flexDirection: "row", gap: s.xs },
  day: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 74,
    gap: s.xs,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: c.line,
  },
  current: { backgroundColor: c.olive, borderColor: c.olive },
  date: { fontFamily: f.medium, fontSize: 15, color: c.ink },
  dot: { width: 5, height: 5, borderRadius: 3 },
});
