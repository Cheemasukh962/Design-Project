import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DemoTask } from "../../data/demo";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";
import { Icon } from "../ui/Icon";
import { ui } from "./ui";

export function TodayCard({
  tasks,
  done,
  onToggle,
}: {
  tasks: DemoTask[];
  done: string[];
  onToggle: (id: string) => void;
}) {
  const count = tasks.filter((task) => done.includes(task.id)).length;
  return (
    <View style={ui.card}>
      <View style={ui.spread}>
        <Text style={ui.heading}>Today’s checklist</Text>
        <Text accessibilityLiveRegion="polite" style={ui.badge}>
          {count} of {tasks.length} done
        </Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Today's routine"
        aria-valuemin={0}
        aria-valuemax={tasks.length}
        aria-valuenow={count}
        accessibilityValue={{ min: 0, max: tasks.length, now: count }}
        style={styles.track}
      >
        <View
          style={[
            styles.fill,
            { width: `${tasks.length ? (count / tasks.length) * 100 : 0}%` },
          ]}
        />
      </View>
      {tasks.map((task) => {
        const checked = done.includes(task.id);
        return (
          <Pressable
            key={task.id}
            accessibilityRole="checkbox"
            accessibilityLabel={task.title}
            aria-checked={checked}
            accessibilityState={{ checked }}
            onPress={() => onToggle(task.id)}
            style={({ pressed }) => [styles.task, pressed && ui.pressed]}
          >
            <View style={[styles.checkbox, checked && styles.checked]}>
              {checked && <Icon name="check" size={16} color={c.background} />}
            </View>
            <View style={styles.copy}>
              <Text style={[ui.label, checked && styles.done]}>
                {task.title}
              </Text>
              <Text style={ui.small}>{task.detail}</Text>
            </View>
            <View style={[styles.mark, { backgroundColor: task.tint }]}>
              <Text style={styles.markText}>{task.letter}</Text>
            </View>
          </Pressable>
        );
      })}
      {tasks.length > 0 && count === tasks.length && (
        <Text accessibilityLiveRegion="polite" style={ui.body}>
          You showed up for yourself. That’s enough for today.
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  track: {
    height: 5,
    borderRadius: 4,
    backgroundColor: c.line,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4, backgroundColor: c.green },
  task: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: s.md,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: s.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: c.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { backgroundColor: c.teal, borderColor: c.teal },
  copy: { flex: 1, gap: s.xs },
  done: { color: c.muted, textDecorationLine: "line-through" },
  mark: {
    width: 29,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  markText: { fontFamily: f.heading, fontSize: 14, color: c.ink },
});
