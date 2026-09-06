import { StyleSheet, Text, View } from "react-native";
import { recentDays, type JournalController } from "../../data/journal";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";
import { Action, Eyebrow, ui } from "./ui";
import { TodayCard } from "./TodayCard";
import { WeekStrip } from "./WeekStrip";
import { MealEntries } from "./JournalTools";

export function Routine({
  journal: j,
  selected,
  onSelect,
  onHabit,
}: {
  journal: JournalController;
  selected: string;
  onSelect: (day: string) => void;
  onHabit: () => void;
}) {
  const days = recentDays(j.today);
  const activeDays = days.filter(
    (d) => j.days[d.key]?.done.length || j.days[d.key]?.meals.length,
  ).length;
  const meals = days.reduce(
    (sum, d) => sum + (j.days[d.key]?.meals.length ?? 0),
    0,
  );
  const isToday = selected === j.today;
  const day = j.days[selected];
  return (
    <>
      <View style={ui.stack}>
        <Eyebrow>YOUR ROUTINE / A WORK IN PROGRESS</Eyebrow>
        <Text style={ui.title}>
          Little rituals.
          <Text style={{ fontFamily: f.italic, color: c.roseInk }}>
            {"\n"}Real life.
          </Text>
        </Text>
        <Text style={ui.body}>
          Build around the day you have. There’s always room to begin again.
        </Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.number}>
            {activeDays}
            <Text style={ui.body}> / 7</Text>
          </Text>
          <Text style={ui.small}>days with activity</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.number}>{meals}</Text>
          <Text style={ui.small}>meals logged this week</Text>
        </View>
      </View>
      <View style={ui.stack}>
        <Eyebrow>PAST SEVEN DAYS · TAP TO LOOK BACK</Eyebrow>
        <WeekStrip
          today={j.today}
          days={j.days}
          selected={selected}
          onSelect={onSelect}
        />
      </View>
      {isToday ? (
        <>
          <TodayCard
            tasks={j.tasks}
            done={j.day.done}
            onToggle={j.toggleDone}
          />
          <Action label="Build a new habit" icon="add" onPress={onHabit} />
        </>
      ) : (
        <View style={ui.card}>
          <Eyebrow>
            {new Date(`${selected}T12:00:00`).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Eyebrow>
          <Text style={ui.heading}>
            {day?.done.length
              ? `${day.done.length} little ${day.done.length === 1 ? "win" : "wins"}`
              : "An open page."}
          </Text>
          {day?.done.map((id) => (
            <Text key={id} style={ui.label}>
              ✓ {j.tasks.find((t) => t.id === id)?.title ?? "Completed habit"}
            </Text>
          ))}
          {!day?.done.length && (
            <Text style={ui.body}>
              No habits logged on this day. Today is a fresh page.
            </Text>
          )}
          {!!day?.meals.length && <MealEntries meals={day.meals} />}
          <Action
            label="Back to today"
            secondary
            onPress={() => onSelect(j.today)}
          />
        </View>
      )}
      <View style={[ui.card, { backgroundColor: c.sage }]}>
        <Eyebrow>A NOTE FROM YOUR PAL</Eyebrow>
        <Text style={ui.heading}>Consistency has a little wiggle room.</Text>
        <Text style={ui.body}>
          A busy day doesn’t erase what you’ve done. These dots mark the days
          you logged a meal or a habit. Every new entry counts.
        </Text>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  stats: {
    flexDirection: "row",
    backgroundColor: c.paper,
    borderRadius: 20,
    padding: s.lg,
    gap: s.lg,
  },
  stat: { flex: 1, gap: s.xs },
  number: { fontFamily: f.heading, fontSize: 42, color: c.ink },
});
