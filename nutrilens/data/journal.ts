import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { initialDemoTasks, type DemoTask } from "./demo";
import { demoColors as c } from "../theme/demo";

export const foodGroups = [
  "Fruit & veg",
  "Protein foods",
  "Grains",
  "Dairy / alternatives",
] as const;
export type FoodGroup = (typeof foodGroups)[number];
export const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
export type Meal = {
  id: string;
  title: string;
  type: (typeof mealTypes)[number];
  groups: FoodGroup[];
};
export const focuses = [
  {
    id: "rhythm",
    title: "Find my meal rhythm",
    caption: "Make room for meals between classes.",
    action: "Plan a lunch break",
    anchor: "Before my first class",
    icon: "calendar-today",
    prompt: "Pick a lunch window before your day fills up.",
  },
  {
    id: "variety",
    title: "Add more variety",
    caption: "Get curious about what’s on my plate.",
    action: "Try a different fruit or vegetable",
    anchor: "At the dining hall",
    icon: "eco",
    prompt: "Choose one fruit or vegetable you haven’t had this week.",
  },
  {
    id: "learn",
    title: "Know my nutrients",
    caption: "Understand foods and supplements.",
    action: "Read a fortified food label",
    anchor: "When I make breakfast",
    icon: "lightbulb",
    prompt: "Check a cereal or plant milk label for added vitamins.",
  },
] as const;
export type FocusId = (typeof focuses)[number]["id"];
export type DayLog = { done: string[]; meals: Meal[]; mood: string | null };
type Journal = {
  version: 1;
  name: string;
  showPal: boolean;
  focus: FocusId;
  tasks: DemoTask[];
  days: Record<string, DayLog>;
};
export const STORAGE_KEY = "vitapal-journal-v1";
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function recentDays(today: string) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() - 6 + i);
    return {
      key: dateKey(date),
      label: date.toLocaleDateString("en-US", { weekday: "narrow" }),
      number: date.getDate(),
    };
  });
}
const emptyDay: DayLog = { done: [], meals: [], mood: null };
const freshJournal = (): Journal => ({
  version: 1,
  name: "Chino",
  showPal: true,
  focus: "rhythm",
  tasks: initialDemoTasks,
  days: {},
});
function validJournal(value: unknown): value is Journal {
  if (!value || typeof value !== "object") return false;
  const j = value as Journal;
  return (
    j.version === 1 &&
    typeof j.name === "string" &&
    typeof j.showPal === "boolean" &&
    focuses.some((f) => f.id === j.focus) &&
    Array.isArray(j.tasks) &&
    j.tasks.every(
      (t) =>
        t &&
        ["id", "title", "detail", "letter", "tint"].every(
          (k) => typeof t[k as keyof DemoTask] === "string",
        ),
    ) &&
    !!j.days &&
    typeof j.days === "object" &&
    Object.values(j.days).every(
      (d) =>
        d &&
        Array.isArray(d.done) &&
        d.done.every((id) => typeof id === "string") &&
        (d.mood === null || typeof d.mood === "string") &&
        Array.isArray(d.meals) &&
        d.meals.every(
          (m) =>
            m &&
            typeof m.id === "string" &&
            typeof m.title === "string" &&
            mealTypes.includes(m.type) &&
            Array.isArray(m.groups) &&
            m.groups.every((g) => foodGroups.includes(g)),
        ),
    )
  );
}
export function useJournal() {
  const [state, setState] = useState<Journal>(freshJournal);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [today, setToday] = useState(dateKey);
  const writes = useRef(Promise.resolve());
  const loadFailed = useRef(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (!validJournal(parsed)) throw new Error("Invalid journal");
        setState(parsed);
      })
      .catch(() => {
        if (active) {
          loadFailed.current = true;
          setStorageError(
            "Your saved journal couldn’t load. Changes this visit won’t be saved.",
          );
        }
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || loadFailed.current) return;
    // Serialize writes so a slower, older save cannot replace a newer one.
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)))
      .then(() => setStorageError(""))
      .catch(() =>
        setStorageError(
          "Couldn’t save on this device. Keep this page open and try another change.",
        ),
      );
  }, [state, ready]);
  useEffect(() => {
    const refresh = () => setToday(dateKey());
    const timer = setInterval(refresh, 30_000);
    const subscription = AppState.addEventListener("change", refresh);
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  function updateDay(update: (day: DayLog) => DayLog) {
    const key = dateKey();
    setToday(key);
    setState((j) => ({
      ...j,
      days: { ...j.days, [key]: update(j.days[key] ?? emptyDay) },
    }));
  }
  function addTask(task: DemoTask) {
    setState((j) =>
      j.tasks.some((t) => t.title.toLowerCase() === task.title.toLowerCase())
        ? j
        : { ...j, tasks: [...j.tasks, task] },
    );
  }
  return {
    ...state,
    today,
    ready,
    storageError,
    day: state.days[today] ?? emptyDay,
    setName: (name: string) => setState((j) => ({ ...j, name })),
    setShowPal: (showPal: boolean) => setState((j) => ({ ...j, showPal })),
    setMood: (mood: string) => updateDay((d) => ({ ...d, mood })),
    setFocus: (focus: FocusId) => setState((j) => ({ ...j, focus })),
    toggleDone: (id: string) =>
      updateDay((d) => ({
        ...d,
        done: d.done.includes(id)
          ? d.done.filter((t) => t !== id)
          : [...d.done, id],
      })),
    saveMeal: (meal: Meal) =>
      updateDay((d) => ({
        ...d,
        meals: d.meals.some((m) => m.id === meal.id)
          ? d.meals.map((m) => (m.id === meal.id ? meal : m))
          : [...d.meals, meal],
      })),
    deleteMeal: (id: string) =>
      updateDay((d) => ({ ...d, meals: d.meals.filter((m) => m.id !== id) })),
    addTask,
    addCustomTask: (title: string, anchor: string) =>
      addTask({
        id: `habit-${Date.now()}`,
        title,
        detail: anchor,
        letter: "+",
        tint: c.sage,
      }),
  };
}
export type JournalController = ReturnType<typeof useJournal>;
