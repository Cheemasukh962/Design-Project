import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { syncDailyReminder, type ReminderStatus } from './reminders';
import { SEED_DEMO_ROUTINE, SEED_DONE, SEED_PICKS } from './progress';
import { useQuiz } from './QuizContext';
import { KEYS, today, usePersistentState } from './storage';
import {
  ALL_OPTIONS,
  nutrientsIn,
  resolveItems,
  streakFrom,
  supplementOption,
  type RoutineItem,
  type RoutineItemType,
} from './routine';

// Re-exported so callers keep importing routine types from one place.
export {
  ALL_OPTIONS,
  supplementOption,
  type RoutineItem,
  type RoutineItemType,
  type RoutineOption,
} from './routine';

/** The one record written to storage. */
type Persisted = {
  /**
   * The exact routes the user chose, by id.
   *
   * This replaced an `added` list of nutrients plus a `hidden` list of the
   * rows they did not want. Adding one nutrient used to drop three rows into
   * the routine — a pill, a meal and a habit — so a routine of three vitamins
   * was nine lines the user never asked for, and pruning it meant removing
   * things one at a time. Choosing what goes in is simpler than un-choosing
   * what does not.
   */
  picks: string[];
  done: string[];
  reminders: string[];
  /** Calendar day `done` belongs to. */
  day: string;
  /**
   * How many items were ticked on each past day, keyed YYYY-MM-DD.
   *
   * This is what makes the week strip and the streak true. Both used to come
   * from invented constants in data/progress.ts, so the app claimed a five-day
   * streak to somebody who had opened it for the first time thirty seconds
   * earlier — the single least defensible thing a habit tracker can do.
   */
  history: Record<string, number>;
};

type RoutineStore = {
  /** Nutrient ids with at least one route in the routine. Derived. */
  added: string[];
  /** The chosen route ids. */
  picks: string[];
  /** False until storage has been read. */
  hydrated: boolean;
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
  /**
   * What the OS actually did with the last sync.
   *
   * Surfaced so the interface can say "reminders are on" only when something
   * is genuinely scheduled, and say something else when the browser cannot
   * deliver one or the user declined the permission.
   */
  reminderStatus: ReminderStatus;
  /** Ticks per day, keyed YYYY-MM-DD. Real, not seeded. */
  history: Record<string, number>;
  /** Consecutive days ending today with at least one tick. */
  streak: number;
  /** Adds the supplement route for a nutrient. The default meaning of "add". */
  add: (nutrientId: string) => void;
  /** Adds one specific route — a food or a habit, chosen deliberately. */
  addOption: (optionId: string) => void;
  /** Drops every route belonging to a nutrient. */
  remove: (nutrientId: string) => void;
  /** Drops a single row. */
  removeItem: (itemId: string) => void;
  toggleDone: (itemId: string) => void;
  toggleReminder: (itemId: string) => void;
  remindAll: () => void;
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
  /**
   * One stored record rather than three, so a tick and the day it happened on
   * can never be written separately and disagree.
   *
   * `day` is what makes "ticked off" mean "ticked off today". Without it a
   * routine opened the next morning would show yesterday's checkmarks and
   * report itself complete, which is the one thing a daily checklist must not
   * do. Tokens already earned are not clawed back — see CompanionContext.
   */
  const [state, setState, hydrated] = usePersistentState<Persisted>(
    KEYS.routine,
    // The demo seed is the value used when storage is empty, so it applies to
    // a genuine first run and is not re-applied over real state afterwards.
    SEED_DEMO_ROUTINE
      ? {
          picks: [...SEED_PICKS],
          done: [...SEED_DONE],
          reminders: [],
          day: today(),
          history: { [today()]: SEED_DONE.length },
        }
      : { picks: [], done: [], reminders: [], day: today(), history: {} },
    (stored) => ({
      picks: stored.picks ?? [],
      reminders: stored.reminders ?? [],
      history: stored.history ?? {},
      // A new day starts with nothing ticked.
      done: stored.day === today() ? (stored.done ?? []) : [],
      day: today(),
    }),
  );

  const { picks, done, reminders, history } = state;
  const setDone = useCallback(
    (fn: (prev: string[]) => string[]) =>
      setState((s) => {
        const next = fn(s.done);
        const day = today();
        // History is written here rather than in an effect, so it can never
        // disagree with the ticks that produced it.
        return { ...s, done: next, day, history: { ...s.history, [day]: next.length } };
      }),
    [setState],
  );
  const setReminders = useCallback(
    (fn: (prev: string[]) => string[]) => setState((s) => ({ ...s, reminders: fn(s.reminders) })),
    [setState],
  );

  const add = useCallback(
    (nutrientId: string) => {
      const option = supplementOption(nutrientId);
      if (!option) return;
      setState((s) =>
        s.picks.includes(option.id) ? s : { ...s, picks: [...s.picks, option.id] },
      );
    },
    [setState],
  );

  const addOption = useCallback(
    (optionId: string) =>
      setState((s) =>
        s.picks.includes(optionId) ? s : { ...s, picks: [...s.picks, optionId] },
      ),
    [setState],
  );

  const remove = useCallback(
    (nutrientId: string) =>
      setState((s) => {
        const mine = (id: string) => id.startsWith(`${nutrientId}-`);
        return {
          ...s,
          picks: s.picks.filter((id) => !mine(id)),
          done: s.done.filter((id) => !mine(id)),
          reminders: s.reminders.filter((id) => !mine(id)),
        };
      }),
    [setState],
  );

  const toggleReminder = useCallback((itemId: string) => {
    setReminders((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  }, [setReminders]);

  const toggleDone = useCallback((itemId: string) => {
    setDone((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  }, [setDone]);

  // The routine has to respect Q5 for the same reason Results does: adding
  // salmon to the daily list of someone who just told us "no fish" is the
  // fastest way to prove the quiz was decorative.
  const { answers } = useQuiz();
  const restrictions = answers.restrictions;

  const items = useMemo(() => resolveItems(picks, restrictions), [picks, restrictions]);

  // Nutrients with anything in the routine. Derived, so it cannot disagree
  // with the rows on screen.
  const added = useMemo(() => nutrientsIn(items), [items]);

  const removeItem = useCallback(
    (itemId: string) =>
      setState((s) => ({
        ...s,
        picks: s.picks.filter((id) => id !== itemId),
        done: s.done.filter((id) => id !== itemId),
        reminders: s.reminders.filter((id) => id !== itemId),
      })),
    [setState],
  );

  const remindAll = useCallback(
    () => setReminders(() => items.map((i) => i.id)),
    [items, setReminders],
  );

  /**
   * Keep the OS schedule matching the toggles.
   *
   * Driven by the count of live reminders rather than by each toggle, so the
   * schedule is correct after a restore from storage as well as after a tap —
   * and so turning three bells on in a row does not schedule three times.
   */
  const [reminderStatus, setReminderStatus] = useState<ReminderStatus>('cleared');
  const liveReminders = useMemo(
    () => reminders.filter((id) => items.some((i) => i.id === id)).length,
    [reminders, items],
  );

  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    syncDailyReminder(liveReminders).then((status) => {
      if (alive) setReminderStatus(status);
    });
    return () => {
      alive = false;
    };
  }, [hydrated, liveReminders]);

  const value = useMemo(
    () => ({
      hydrated,
      added,
      picks,
      items,
      done,
      reminders,
      reminderTime: REMINDER_TIME,
      reminderStatus,
      history,
      streak: streakFrom(history),
      add,
      addOption,
      remove,
      removeItem,
      toggleDone,
      toggleReminder,
      remindAll,
    }),
    [
      hydrated,
      added,
      picks,
      items,
      done,
      reminders,
      reminderStatus,
      history,
      add,
      remove,
      removeItem,
      toggleDone,
      toggleReminder,
      remindAll,
    ],
  );

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>;
}

export function useRoutine(): RoutineStore {
  const store = useContext(RoutineContext);
  if (!store) throw new Error('useRoutine must be used inside a RoutineProvider');
  return store;
}
