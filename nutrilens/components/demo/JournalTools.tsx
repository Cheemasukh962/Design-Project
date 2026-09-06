import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  focuses,
  foodGroups,
  mealTypes,
  type Meal,
  type FoodGroup,
  type JournalController,
} from "../../data/journal";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";
import { Icon } from "../ui/Icon";
import { Action, Eyebrow, ui } from "./ui";

export function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      aria-pressed={selected}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && ui.pressed,
      ]}
    >
      <Text
        style={[
          ui.small,
          { color: selected ? c.background : c.ink, fontFamily: f.medium },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
export function JournalSheet({
  mode,
  meal,
  journal,
  onClose,
}: {
  mode: "meal" | "habit" | "focus";
  meal?: Meal;
  journal: JournalController;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(meal?.title ?? "");
  const [type, setType] = useState<Meal["type"]>(meal?.type ?? "Lunch");
  const [groups, setGroups] = useState<FoodGroup[]>(meal?.groups ?? []);
  const [anchor, setAnchor] = useState("Before my first class");
  const [focus, setFocus] = useState(journal.focus);
  const duplicate =
    mode === "habit" &&
    journal.tasks.some(
      (t) => t.title.toLowerCase() === title.trim().toLowerCase(),
    );
  function save() {
    if (mode === "focus") journal.setFocus(focus);
    else if (mode === "habit") {
      if (!title.trim() || duplicate) return;
      journal.addCustomTask(title.trim(), anchor);
    } else {
      if (!title.trim()) return;
      journal.saveMeal({
        id: meal?.id ?? `meal-${Date.now()}`,
        title: title.trim(),
        type,
        groups,
      });
    }
    onClose();
  }
  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss editor"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          <View style={ui.spread}>
            <Eyebrow>
              {mode === "meal"
                ? "Your food journal"
                : mode === "habit"
                  ? "Make it yours"
                  : "One thing at a time"}
            </Eyebrow>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={ui.textButton}
            >
              <Text style={ui.link}>Cancel</Text>
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={ui.stack}
          >
            <Text style={ui.title}>
              {mode === "meal"
                ? meal
                  ? "Edit your entry."
                  : "What’s on your plate?"
                : mode === "habit"
                  ? "A habit that fits."
                  : "Pick your focus."}
            </Text>
            {mode === "focus" ? (
              <>
                <Text style={ui.body}>
                  Your focus changes the next step on Home. Switch it whenever
                  life changes.
                </Text>
                {focuses.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: item.id === focus }}
                    aria-checked={item.id === focus}
                    onPress={() => setFocus(item.id)}
                    style={[
                      ui.card,
                      ui.row,
                      item.id === focus && {
                        borderColor: c.teal,
                        backgroundColor: c.tealWash,
                      },
                    ]}
                  >
                    <Icon name={item.icon} color={c.teal} size={24} />
                    <View style={{ flex: 1 }}>
                      <Text style={ui.label}>{item.title}</Text>
                      <Text style={ui.small}>{item.caption}</Text>
                    </View>
                    {item.id === focus && (
                      <Icon name="check" color={c.teal} size={20} />
                    )}
                  </Pressable>
                ))}
              </>
            ) : (
              <>
                {mode === "meal" && (
                  <View style={styles.choices}>
                    {mealTypes.map((t) => (
                      <Choice
                        key={t}
                        label={t}
                        selected={type === t}
                        onPress={() => setType(t)}
                      />
                    ))}
                  </View>
                )}
                <Text style={ui.label}>
                  {mode === "meal" ? "A quick note is enough" : "I want to…"}
                </Text>
                <TextInput
                  accessibilityLabel={
                    mode === "meal" ? "Meal description" : "Habit name"
                  }
                  placeholder={
                    mode === "meal"
                      ? "e.g. Rice bowl with tofu & broccoli"
                      : "e.g. Pack a snack for campus"
                  }
                  placeholderTextColor={c.muted}
                  value={title}
                  maxLength={140}
                  onChangeText={setTitle}
                  style={styles.input}
                />
                <Text style={ui.label}>
                  {mode === "meal"
                    ? "What did it include? · optional"
                    : "Tie it to a moment"}
                </Text>
                <View style={styles.choices}>
                  {mode === "meal"
                    ? foodGroups.map((g) => (
                        <Choice
                          key={g}
                          label={g}
                          selected={groups.includes(g)}
                          onPress={() =>
                            setGroups((current) =>
                              current.includes(g)
                                ? current.filter((x) => x !== g)
                                : [...current, g],
                            )
                          }
                        />
                      ))
                    : [
                        "Before my first class",
                        "At the dining hall",
                        "After class",
                        "When I get home",
                      ].map((a) => (
                        <Choice
                          key={a}
                          label={a}
                          selected={anchor === a}
                          onPress={() => setAnchor(a)}
                        />
                      ))}
                </View>
                <Text style={ui.small}>
                  {mode === "meal"
                    ? "Tags are your observations. We don’t estimate calories or nutrient amounts from them."
                    : "An everyday cue helps you remember. This won’t schedule a notification."}
                </Text>
                {duplicate && (
                  <Text accessibilityLiveRegion="polite" style={ui.body}>
                    That habit is already in your routine.
                  </Text>
                )}
              </>
            )}
            <Action
              label={
                mode === "focus"
                  ? "Set my focus"
                  : mode === "habit"
                    ? "Add to my routine"
                    : meal
                      ? "Save changes"
                      : "Save meal"
              }
              onPress={save}
              disabled={mode !== "focus" && (!title.trim() || duplicate)}
              icon="check"
            />
            {meal && (
              <Action
                secondary
                label="Delete this entry"
                icon="remove"
                onPress={() => {
                  journal.deleteMeal(meal.id);
                  onClose();
                }}
              />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function MealEntries({
  meals,
  onEdit,
}: {
  meals: Meal[];
  onEdit?: (meal: Meal) => void;
}) {
  return (
    <View>
      {meals.map((meal, index) => (
        <Pressable
          key={meal.id}
          accessibilityRole={onEdit ? "button" : undefined}
          accessibilityLabel={
            onEdit ? `Edit ${meal.type}: ${meal.title}` : undefined
          }
          disabled={!onEdit}
          onPress={() => onEdit?.(meal)}
          style={styles.entry}
        >
          <Text style={styles.number}>
            {String(index + 1).padStart(2, "0")}
          </Text>
          <View style={{ flex: 1, gap: s.xs }}>
            <Eyebrow>{meal.type}</Eyebrow>
            <Text style={ui.label}>{meal.title}</Text>
            <Text style={ui.small}>
              {meal.groups.join(" · ") || "No food tags added"}
            </Text>
          </View>
          {onEdit && <Icon name="chevron-right" color={c.teal} size={20} />}
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30,40,25,0.45)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    maxHeight: "92%",
    width: "100%",
    maxWidth: 440,
    backgroundColor: c.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: s.lg,
    paddingBottom: s.xxl,
    gap: s.sm,
  },
  handle: {
    height: 4,
    width: 36,
    backgroundColor: c.line,
    alignSelf: "center",
    borderRadius: 2,
  },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: s.sm },
  chip: {
    minHeight: 44,
    paddingHorizontal: s.md,
    paddingVertical: s.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.surface,
    justifyContent: "center",
  },
  selected: { backgroundColor: c.olive, borderColor: c.olive },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.surface,
    padding: s.md,
    borderRadius: 12,
    fontFamily: f.body,
    color: c.ink,
    fontSize: 13,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    gap: s.md,
    borderTopWidth: 1,
    borderColor: c.line,
    paddingVertical: s.md,
  },
  number: { fontFamily: f.italic, color: c.roseInk, fontSize: 25 },
});
