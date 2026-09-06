import { Pressable, StyleSheet, Text, View } from "react-native";
import { checkIns, demoNutrients, type DemoNutrient } from "../../data/demo";
import {
  focuses,
  foodGroups,
  type JournalController,
  type Meal,
} from "../../data/journal";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";
import { Icon } from "../ui/Icon";
import { Pal } from "./Pal";
import { TodayCard } from "./TodayCard";
import { Action, Eyebrow, SectionHeading, ui } from "./ui";
import { MealEntries, Choice } from "./JournalTools";
import { WeekStrip } from "./WeekStrip";

type Props = {
  journal: JournalController;
  onNutrient: (nutrient: DemoNutrient) => void;
  onDiscover: () => void;
  onProfile: () => void;
  onRoutine: (day?: string) => void;
  onLog: (meal?: Meal) => void;
  onFocus: () => void;
  onHabit: () => void;
};
export function Home({ journal: j, ...props }: Props) {
  const count = j.tasks.filter((t) => j.day.done.includes(t.id)).length;
  const focus = focuses.find((item) => item.id === j.focus)!;
  const selected = checkIns.find((item) => item.id === j.day.mood);
  const tags = foodGroups.filter((g) =>
    j.day.meals.some((m) => m.groups.includes(g)),
  );
  const focusAdded = j.tasks.some((t) => t.title === focus.action);
  return (
    <>
      <View style={ui.spread}>
        <View style={ui.row}>
          <Icon name="spa" color={c.olive} size={25} />
          <Text style={styles.brand}>
            VitaPal<Text style={{ color: c.roseInk }}>.</Text>
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open your profile"
          onPress={props.onProfile}
          style={styles.avatar}
        >
          <Text style={styles.initial}>
            {(j.name.trim() || "friend").slice(0, 1).toUpperCase()}
          </Text>
        </Pressable>
      </View>
      <View style={styles.intro}>
        <Eyebrow>
          {new Date(`${j.today}T12:00:00`).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}{" "}
          · THE DAILY EDIT
        </Eyebrow>
        <Text style={ui.title}>
          Small steps.
          <Text style={{ fontFamily: f.italic, color: c.roseInk }}>
            {"\n"}A well-fed you.
          </Text>
        </Text>
        <Text style={ui.body}>
          Let’s make room for you, {j.name.trim() || "friend"}.
        </Text>
      </View>
      <View style={styles.hero}>
        <View style={ui.spread}>
          <Text style={styles.lightEyebrow}>A LITTLE MORE YOU, EVERY DAY</Text>
          <Icon name="auto-awesome" color={c.yellow} size={20} />
        </View>
        <View style={ui.row}>
          <View style={{ flex: 1 }}>
            <Text accessibilityLiveRegion="polite" style={styles.heroNumber}>
              {count}
              <Text style={styles.denominator}> / {j.tasks.length}</Text>
            </Text>
            <Text style={styles.heroLabel}>habits cared for today</Text>
            <Text style={styles.heroNote}>
              {count === 0
                ? "Your first little win is waiting."
                : count === j.tasks.length
                  ? "Look at you. All done for today!"
                  : "That counts. Keep growing."}
            </Text>
          </View>
          {j.showPal && (
            <View style={styles.palStamp}>
              <Pal size={94} happy={count > 0} />
              <Text style={styles.stampText}>
                {count > 0 ? "ROOTING FOR YOU" : "LET’S GROW"}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.heroTrack}>
          {j.tasks.map((t) => (
            <View
              key={t.id}
              style={[
                styles.heroSegment,
                j.day.done.includes(t.id) && { backgroundColor: c.sage },
              ]}
            />
          ))}
        </View>
        <View style={styles.heroLink}>
          <Pressable
            accessibilityRole="button"
            onPress={() => props.onLog()}
            style={styles.quickLog}
          >
            <Icon name="add" size={20} color={c.ink} />
            <Text style={ui.label}>Log a meal</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => props.onRoutine()}
            style={ui.textButton}
          >
            <Text style={styles.heroLabel}>My routine</Text>
            <Icon name="arrow-forward" size={18} color={c.background} />
          </Pressable>
        </View>
      </View>
      <View style={{ gap: s.sm }}>
        <View style={ui.spread}>
          <Eyebrow>Seven days of showing up</Eyebrow>
          <Text style={ui.small}>Tap a day to look back</Text>
        </View>
        <WeekStrip today={j.today} days={j.days} onSelect={props.onRoutine} />
      </View>
      <View style={styles.journalCard}>
        <View style={ui.spread}>
          <View>
            <Eyebrow>01 / YOUR FOOD JOURNAL</Eyebrow>
            <Text style={ui.heading}>What’s on your plate?</Text>
          </View>
          <Icon name="restaurant" size={25} color={c.roseInk} />
        </View>
        <Text style={ui.body}>
          {j.day.meals.length
            ? `${j.day.meals.length} ${j.day.meals.length === 1 ? "meal" : "meals"} logged today. A little picture of your day.`
            : "Dining hall, desk lunch, midnight toast. It all belongs here."}
        </Text>
        {j.day.meals.length > 0 && (
          <MealEntries meals={j.day.meals} onEdit={props.onLog} />
        )}
        <Action label="Add a meal" icon="add" onPress={() => props.onLog()} />
        <Text style={[ui.small, { textAlign: "center" }]}>
          A quick note. A few tags. Back to your day.
        </Text>
      </View>
      <View style={styles.focusCard}>
        <View style={ui.spread}>
          <Eyebrow>YOUR CURRENT FOCUS</Eyebrow>
          <Pressable
            accessibilityRole="button"
            onPress={props.onFocus}
            style={ui.textButton}
          >
            <Text style={ui.link}>Change</Text>
          </Pressable>
        </View>
        <Text style={ui.heading}>{focus.title}</Text>
        <Text style={ui.body}>{focus.prompt}</Text>
        <Action
          secondary
          label={
            focusAdded
              ? "In your routine"
              : `Try this: ${focus.action.toLowerCase()}`
          }
          disabled={focusAdded}
          icon={focusAdded ? "check" : "add"}
          onPress={() => j.addCustomTask(focus.action, focus.anchor)}
        />
      </View>
      <View>
        <SectionHeading
          title="Your daily rituals"
          action="Add habit"
          onPress={props.onHabit}
        />
        <TodayCard tasks={j.tasks} done={j.day.done} onToggle={j.toggleDone} />
      </View>
      <View style={ui.stack}>
        <View>
          <Eyebrow>02 / NOTICE THE LITTLE THINGS</Eyebrow>
          <Text style={ui.heading}>A snapshot of your plate</Text>
        </View>
        <View style={styles.tagGrid}>
          {foodGroups.map((g, index) => (
            <View
              key={g}
              style={[
                styles.foodTag,
                tags.includes(g) && {
                  backgroundColor: c.sage,
                  borderColor: c.green,
                },
              ]}
            >
              <Icon
                name={(["eco", "egg", "grain", "water-drop"] as const)[index]}
                color={c.olive}
                size={22}
              />
              <Text style={ui.small}>{g}</Text>
              <Text style={styles.tagStatus}>
                {tags.includes(g) ? "NOTICED" : "NOT TAGGED"}
              </Text>
            </View>
          ))}
        </View>
        <Text style={ui.small}>
          {j.day.meals.length
            ? `${tags.length} food groups tagged in your entries. This shows variety you noticed, not whether you’ve met nutrient needs.`
            : "Log a meal and tag what you notice. Your picture builds from your own entries."}
        </Text>
      </View>
      <View style={ui.stack}>
        <SectionHeading title="How’s your day feeling?" />
        <View style={styles.chips}>
          {checkIns.map((item) => (
            <Choice
              key={item.id}
              label={item.label}
              selected={item.id === j.day.mood}
              onPress={() => j.setMood(item.id)}
            />
          ))}
        </View>
        {selected && (
          <Text accessibilityLiveRegion="polite" style={ui.body}>
            {selected.message}
          </Text>
        )}
      </View>
      <View>
        <SectionHeading
          title="A little food for thought"
          action="Explore"
          onPress={props.onDiscover}
        />
        <View style={styles.nutrients}>
          {demoNutrients.map((n) => (
            <Pressable
              key={n.id}
              accessibilityRole="button"
              accessibilityLabel={`Explore ${n.name}`}
              onPress={() => props.onNutrient(n)}
              style={[styles.nutrient, { backgroundColor: n.tint }]}
            >
              <Text style={styles.letter}>{n.letter}</Text>
              <Text style={styles.nutrientName}>{n.name}</Text>
              <Icon name="arrow-forward" color={c.ink} size={18} />
            </Pressable>
          ))}
        </View>
      </View>
      <Text style={[ui.small, { textAlign: "center" }]}>
        A little wiser. A little nourished. Very you.
      </Text>
    </>
  );
}
const styles = StyleSheet.create({
  brand: { fontFamily: f.heading, fontSize: 30, color: c.ink },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: c.peach,
    borderWidth: 1,
    borderColor: c.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { fontFamily: f.italic, fontSize: 22, color: c.ink },
  intro: { gap: s.sm },
  hero: {
    backgroundColor: c.olive,
    padding: s.lg,
    gap: s.md,
    borderRadius: 24,
    borderBottomRightRadius: 6,
  },
  lightEyebrow: {
    flexShrink: 1,
    fontFamily: f.medium,
    fontSize: 9,
    letterSpacing: 1.5,
    color: c.oliveLight,
  },
  heroNumber: {
    fontFamily: f.heading,
    fontSize: 68,
    lineHeight: 78,
    color: c.background,
  },
  denominator: { fontSize: 30, color: c.oliveLight },
  heroLabel: { fontFamily: f.medium, fontSize: 12, color: c.background },
  heroNote: {
    fontFamily: f.body,
    fontSize: 10,
    lineHeight: 17,
    color: c.oliveLight,
    marginTop: s.sm,
  },
  palStamp: {
    backgroundColor: c.yellow,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    width: 124,
    height: 132,
    transform: [{ rotate: "8deg" }],
  },
  stampText: {
    fontFamily: f.bold,
    fontSize: 7,
    letterSpacing: 1,
    color: c.ink,
  },
  quickLog: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: s.xs,
    backgroundColor: c.yellow,
    borderRadius: 12,
    paddingHorizontal: s.md,
  },
  heroTrack: { flexDirection: "row", gap: s.xs },
  heroSegment: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: c.muted,
  },
  heroLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    borderTopWidth: 1,
    borderColor: c.muted,
    paddingTop: s.sm,
  },
  journalCard: {
    padding: s.lg,
    gap: s.md,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 4,
    backgroundColor: c.surface,
    borderLeftWidth: 3,
    borderLeftColor: c.rose,
  },
  focusCard: {
    backgroundColor: c.yellow,
    padding: s.lg,
    borderRadius: 20,
    gap: s.sm,
  },
  tagGrid: { flexDirection: "row", flexWrap: "wrap", gap: s.sm },
  foodTag: {
    flexBasis: "47%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: c.line,
    padding: s.md,
    borderRadius: 14,
    gap: s.xs,
  },
  tagStatus: {
    fontFamily: f.medium,
    fontSize: 8,
    letterSpacing: 1,
    color: c.muted,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: s.sm },
  nutrients: { flexDirection: "row", gap: s.sm },
  nutrient: { flex: 1, padding: s.md, borderRadius: 14, gap: s.sm },
  letter: { fontFamily: f.italic, fontSize: 34, color: c.ink },
  nutrientName: { fontFamily: f.medium, fontSize: 10, color: c.ink },
});
