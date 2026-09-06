import { useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  demoNutrients,
  nutrientActions,
  type DemoTask,
  type DemoNutrient,
} from "../../data/demo";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";
import { Icon } from "../ui/Icon";
import { Choice } from "./JournalTools";
import { Action, Eyebrow, ui } from "./ui";

export function Discover({
  onNutrient,
}: {
  onNutrient: (nutrient: DemoNutrient) => void;
}) {
  const [query, setQuery] = useState("");
  const visible = demoNutrients.filter((n) =>
    [n.name, ...nutrientActions[n.id].foods]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <View style={ui.stack}>
        <Eyebrow>A little knowledge</Eyebrow>
        <Text style={ui.title}>
          Good things to{"\n"}
          <Text style={{ fontFamily: f.italic, color: c.roseInk }}>
            grow on.
          </Text>
        </Text>
        <Text style={ui.body}>
          Food ideas, supplement basics, and a next step you can actually use.
        </Text>
      </View>
      <TextInput
        accessibilityLabel="Search nutrients"
        placeholder="Search nutrients or foods…"
        placeholderTextColor={c.muted}
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />
      {visible.map((n) => (
        <Pressable
          key={n.id}
          accessibilityRole="button"
          accessibilityLabel={`Learn about ${n.name}`}
          onPress={() => onNutrient(n)}
          style={({ pressed }) => [ui.card, ui.row, pressed && ui.pressed]}
        >
          <View style={[styles.mark, { backgroundColor: n.tint }]}>
            <Text style={styles.letter}>{n.letter}</Text>
          </View>
          <View style={{ flex: 1, gap: s.xs }}>
            <Text style={ui.heading}>{n.name}</Text>
            <Text style={ui.small}>{n.caption}</Text>
          </View>
          <Icon name="arrow-forward" size={20} color={c.teal} />
        </Pressable>
      ))}
      {!visible.length && (
        <Text accessibilityLiveRegion="polite" style={ui.body}>
          No match yet. Try “B12”, “milk”, or “broccoli”.
        </Text>
      )}
      <View style={[ui.card, { backgroundColor: c.yellow }]}>
        <Eyebrow>The everyday edit · 1 minute</Eyebrow>
        <Text style={ui.heading}>Make the small thing easier.</Text>
        <Text style={ui.body}>
          Choose one thing that fits the day you actually have. Put a piece of
          fruit by your bag. Leave space for lunch on your calendar. Take a
          pause after class.
        </Text>
        <Text style={ui.body}>
          Then let that be enough. Tomorrow is another chance to show up.
        </Text>
      </View>
    </>
  );
}
export function NutrientDetail({
  nutrient,
  onBack,
  tasks,
  onAdd,
}: {
  nutrient: DemoNutrient;
  onBack: () => void;
  tasks: DemoTask[];
  onAdd: (title: string, anchor: string) => void;
}) {
  const [error, setError] = useState(false);
  const [section, setSection] = useState("Food ideas");
  const notes = nutrientActions[nutrient.id];
  const action =
    section === "Food ideas"
      ? notes.habit
      : `Prepare questions about ${nutrient.name}`;
  const added = tasks.some((t) => t.title === action);
  return (
    <>
      <Action label="Back" secondary icon="arrow-back" onPress={onBack} />
      <View style={[styles.hero, { backgroundColor: nutrient.tint }]}>
        <Eyebrow>Your nutrient notes</Eyebrow>
        <Text style={styles.heroLetter}>{nutrient.letter}</Text>
        <Text style={ui.heading}>{nutrient.name}</Text>
      </View>
      <View style={ui.row}>
        {["Food ideas", "Supplement basics"].map((label) => (
          <Choice
            key={label}
            label={label}
            selected={section === label}
            onPress={() => setSection(label)}
          />
        ))}
      </View>
      <Text style={ui.title}>
        {section === "Food ideas"
          ? nutrient.prompt
          : "A little context before the capsule."}
      </Text>
      <Text style={ui.body}>
        {section === "Food ideas" ? nutrient.body : notes.supplement}
      </Text>
      <View style={[ui.card, { backgroundColor: c.yellow }]}>
        <Eyebrow>
          {section === "Food ideas"
            ? "TRY THIS ON CAMPUS"
            : "TAKE IT TO CAMPUS HEALTH"}
        </Eyebrow>
        <Text style={ui.body}>
          {section === "Food ideas" ? notes.idea : notes.question}
        </Text>
        {section === "Food ideas" && (
          <Text style={ui.small}>{notes.foods.join(" · ")}</Text>
        )}
        <Action
          label={
            added
              ? "Added to your routine"
              : section === "Food ideas"
                ? "Make this a habit"
                : "Save a questions habit"
          }
          disabled={added}
          icon={added ? "check" : "add"}
          onPress={() =>
            onAdd(
              action,
              section === "Food ideas"
                ? "When I choose a meal"
                : "Before my next health visit",
            )
          }
        />
      </View>
      <View style={ui.card}>
        <Eyebrow>Keep exploring</Eyebrow>
        <Text style={ui.body}>
          Read the NIH Office of Dietary Supplements fact sheet for food sources
          and more information.
        </Text>
        <Action
          label="Read the NIH fact sheet"
          icon="open-in-new"
          onPress={() => {
            setError(false);
            Linking.openURL(nutrient.source).catch(() => setError(true));
          }}
        />
        {error && (
          <Text accessibilityLiveRegion="polite" style={ui.body}>
            The link couldn’t open. Please try again.
          </Text>
        )}
      </View>
      <Text style={ui.small}>
        For learning, not a diagnosis or a supplement prescription.
      </Text>
    </>
  );
}
const styles = StyleSheet.create({
  search: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.surface,
    paddingHorizontal: s.lg,
    fontFamily: f.body,
    fontSize: 13,
    color: c.ink,
  },
  mark: {
    width: 64,
    height: 72,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  letter: { fontFamily: f.heading, fontSize: 30, color: c.ink },
  hero: { padding: s.xl, borderRadius: 24, alignItems: "center", gap: s.sm },
  heroLetter: {
    fontFamily: f.heading,
    fontSize: 100,
    lineHeight: 120,
    color: c.ink,
  },
});
