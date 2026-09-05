import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SEED_DEMO_ROUTINE, SEED_DONE, SEED_NUTRIENTS } from './progress';
import { useQuiz } from './QuizContext';

export type RoutineItemType = 'supplement' | 'food' | 'habit';

export type RoutineItem = {
  id: string;
  /** Nutrient this item serves, when it came from a result. */
  nutrientId?: string;
  title: string;
  detail: string;
  type: RoutineItemType;
};

type RoutineStore = {
  /** Nutrient ids the user has added. */
  added: string[];
  items: RoutineItem[];
  done: string[];
  /**
   * Item ids with a daily reminder switched on.
   *
   * Forgetting is the actual failure mode this product has to survive - a
   * routine you agreed to and never think about again is indistinguishable
   * from no routine. So the reminder is a first-class control on every row
   * rather than a setting buried somewhere.
   */
  reminders: string[];
  reminderTime: string;
  add: (nutrientId: string) => void;
  remove: (nutrientId: string) => void;
  toggleDone: (itemId: string) => void;
  toggleReminder: (itemId: string) => void;
  remindAll: () => void;
};

/**
 * What a nutrient expands into once it is in the routine.
 *
 * A nutrient is not itself a thing you do, so adding one has to produce actual
 * actions. Each nutrient offers a food route and a habit route alongside the
 * supplement, because defaulting a 20-year-old to a pill for something a meal
 * would fix is the wrong instinct — and it is the reason the PRD warns against
 * a pill-shaped mascot.
 */
type Expansion = Omit<RoutineItem, 'id' | 'nutrientId'> & {
  /** Restriction ids that remove this item entirely. */
  excludedBy?: string[];
  /**
   * Restriction id -> replacement title. Most items narrow rather than drop:
   * telling someone who avoids dairy that calcium is simply unavailable to them
   * would be both wrong and the opposite of useful, since they are exactly the
   * person the finding was raised for.
   */
  narrows?: Record<string, string>;
};

const EXPANSIONS: Record<string, Expansion[]> = {
  d: [
    { title: 'Vitamin D3, 1,000 IU', detail: 'Morning, with food', type: 'supplement' },
    { title: '15 minutes outside', detail: 'Around midday', type: 'habit' },
    {
      title: 'Salmon fillet or 2 eggs',
      detail: 'Lunch or dinner',
      type: 'food',
      narrows: { 'no-fish': '2 eggs' },
    },
  ],
  b12: [
    {
      title: 'Fortified cereal or nutritional yeast',
      detail: 'Breakfast',
      type: 'food',
      narrows: { 'gluten-free': 'Gluten-free fortified cereal or nutritional yeast' },
    },
    { title: 'B12 supplement', detail: 'Morning', type: 'supplement' },
  ],
  c: [
    { title: 'A piece of fruit', detail: 'Any time — it is not stored', type: 'food' },
    { title: 'Peppers or greens with a meal', detail: 'Lunch or dinner', type: 'food' },
  ],
  iron: [
    { title: 'Beans, lentils or leafy greens', detail: 'With something citrus', type: 'food' },
  ],
  calcium: [
    {
      title: 'Fortified milk or yoghurt',
      detail: 'Breakfast',
      type: 'food',
      narrows: { 'no-dairy': 'Fortified plant milk, tofu or leafy greens' },
    },
  ],
};

/**
 * When reminders fire.
 *
 * One time for everything, deliberately. Per-item scheduling means a settings
 * screen and a time picker for a benefit nobody asked for; the failure being
 * solved is "I forgot entirely", not "I took it at the wrong hour".
 *
 * NOT YET DELIVERED BY THE OS. The state, the controls and the copy are real;
 * firing an actual notification needs expo-notifications and a permission
 * prompt, which is a build change rather than a design one. Nothing in the UI
 * claims a notification has been scheduled.
 */
export const REMINDER_TIME = '9:00 am';

const RoutineContext = createContext<RoutineStore | null>(null);

export function RoutineProvider({ children }: { children: ReactNode }) {
  // Seeded so the app opens in the populated state both mocks draw. The switch
  // lives in data/progress.ts — turn it off before a usability session.
  const [added, setAdded] = useState<string[]>(
    SEED_DEMO_ROUTINE ? [...SEED_NUTRIENTS] : [],
  );
  const [done, setDone] = useState<string[]>(SEED_DEMO_ROUTINE ? [...SEED_DONE] : []);
  const [reminders, setReminders] = useState<string[]>([]);

  const add = useCallback((nutrientId: string) => {
    setAdded((current) =>
      current.includes(nutrientId) ? current : [...current, nutrientId],
    );
  }, []);

  const remove = useCallback((nutrientId: string) => {
    setAdded((current) => current.filter((id) => id !== nutrientId));
  }, []);

  const toggleReminder = useCallback((itemId: string) => {
    setReminders((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  }, []);

  const toggleDone = useCallback((itemId: string) => {
    setDone((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  }, []);

  // The routine has to respect Q5 for the same reason Results does: adding
  // salmon to the daily list of someone who just told us "no fish" is the
  // fastest way to prove the quiz was decorative.
  const { answers } = useQuiz();
  const restrictions = answers.restrictions;

  const items = useMemo<RoutineItem[]>(
    () =>
      added.flatMap((nutrientId) =>
        (EXPANSIONS[nutrientId] ?? [])
          .filter(
            (item) => !item.excludedBy?.some((id) => restrictions.includes(id)),
          )
          .map(({ excludedBy: _excludedBy, narrows, ...item }, i) => {
            const narrowed = restrictions
              .map((id) => narrows?.[id])
              .find(Boolean);
            return {
              ...item,
              title: narrowed ?? item.title,
              nutrientId,
              // Index is stable across restriction changes because filtering
              // happens before mapping - ids stay tied to position in the
              // surviving list, which is what `done` refers to.
              id: `${nutrientId}-${i}`,
            };
          }),
      ),
    [added, restrictions],
  );

  const remindAll = useCallback(() => setReminders(items.map((i) => i.id)), [items]);

  const value = useMemo(
    () => ({
      added,
      items,
      done,
      reminders,
      reminderTime: REMINDER_TIME,
      add,
      remove,
      toggleDone,
      toggleReminder,
      remindAll,
    }),
    [added, items, done, reminders, add, remove, toggleDone, toggleReminder, remindAll],
  );

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>;
}

export function useRoutine(): RoutineStore {
  const store = useContext(RoutineContext);
  if (!store) throw new Error('useRoutine must be used inside a RoutineProvider');
  return store;
}
