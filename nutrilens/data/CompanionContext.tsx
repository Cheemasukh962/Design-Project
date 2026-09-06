import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  CARE,
  SPECIES,
  TOKENS_PER_ITEM,
  daysBetween,
  decayCare,
  moodForCare,
  stageForTokens,
  today,
  type Mood,
  type SpeciesId,
  type Stage,
} from './companion';
import { useRoutine } from './RoutineContext';

const STORAGE_KEY = 'nutrilens.companion.v1';

type Persisted = {
  speciesId: SpeciesId | null;
  tokens: number;
  care: number;
  /** Date-only ISO of the last day care was updated. */
  lastDay: string;
  /**
   * Routine item ids that have already paid out a token TODAY.
   *
   * Without it, un-ticking and re-ticking the same item is an infinite token
   * farm — which would make the currency meaningless and, worse, reward
   * fiddling with the checklist rather than doing the thing.
   *
   * The "today" part is load-bearing and was missing. This list used to grow
   * forever, so a routine item paid out exactly once in its life: a five-item
   * routine could earn five tokens total, the second form costs fifteen and
   * the third costs fifty, and the pal could therefore never evolve at all.
   * The whole daily loop was unreachable. It resets with `rewardedDay`.
   */
  rewarded: string[];
  /** The day `rewarded` refers to. */
  rewardedDay: string;
  /** Highest stage the user has actually been shown, for the reveal moment. */
  seenStage: Stage;
};

const EMPTY: Persisted = {
  speciesId: null,
  tokens: 0,
  care: CARE.START,
  lastDay: today(),
  rewarded: [],
  rewardedDay: today(),
  seenStage: 0,
};

type CompanionStore = {
  /** False until storage has been read — screens should not decide anything yet. */
  hydrated: boolean;
  speciesId: SpeciesId | null;
  tokens: number;
  care: number;
  /** Set when HP was just gained, so the UI can celebrate a check-in. */
  lastGain: { at: number; amount: number } | null;
  stage: Stage;
  mood: Mood;
  /** Set when the creature has evolved but the user has not seen the reveal. */
  pendingEvolution: boolean;
  choose: (id: SpeciesId) => void;
  acknowledgeEvolution: () => void;
  reset: () => void;
};

const CompanionContext = createContext<CompanionStore | null>(null);

/**
 * Companion state, persisted across launches.
 *
 * This is the first thing in the app that survives a restart, and it has to
 * be: a care meter that resets every time you open the app measures nothing,
 * and an evolution you cannot come back to is not a reward.
 *
 * Note what is still NOT persisted — quiz answers and the routine itself. Those
 * stay in memory on purpose so usability sessions start clean. Only the
 * companion is durable, because it is the only thing whose whole point is
 * continuity. `reset()` exists so a session can be started fresh anyway.
 */
export function CompanionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [pendingEvolution, setPendingEvolution] = useState(false);
  /**
   * The last time HP was gained, and how much.
   *
   * Exposed so a screen can react to a check-in rather than poll for it. The
   * timestamp is the signal — a plain boolean could not distinguish two ticks
   * in a row, which is exactly the case worth animating.
   */
  const [lastGain, setLastGain] = useState<{ at: number; amount: number } | null>(null);
  const { done } = useRoutine();

  // ---- Load, and apply any decay that happened while the app was closed ----
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (!raw) {
          setHydrated(true);
          return;
        }
        try {
          const saved = { ...EMPTY, ...(JSON.parse(raw) as Partial<Persisted>) };
          const missed = daysBetween(saved.lastDay, today());
          setState({
            ...saved,
            // A new day is a clean slate for earning, so the same routine can
            // pay again tomorrow.
            rewarded: saved.rewardedDay === today() ? saved.rewarded : [],
            rewardedDay: today(),
            // Decay is computed from elapsed days on load rather than by a
            // timer, because a timer only runs while the app is open — which
            // is precisely when the user is not neglecting anything.
            care: decayCare(saved.care, missed),
            lastDay: today(),
          });
        } catch {
          // A corrupt record should not brick the screen. Start over quietly.
          setState(EMPTY);
        }
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Persist on every change, once hydrated ----
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Storage failure is not worth interrupting the user for. The session
      // still works; it just will not survive a restart.
    });
  }, [state, hydrated]);

  // ---- Award tokens for newly ticked routine items ----
  const prevStage = useRef<Stage>(0);
  useEffect(() => {
    if (!hydrated || !state.speciesId) return;
    // Anything ticked today that has not already paid out today.
    const sameDay = state.rewardedDay === today();
    const alreadyPaid = sameDay ? state.rewarded : [];
    const fresh = done.filter((id) => !alreadyPaid.includes(id));
    if (fresh.length === 0) return;

    setLastGain({ at: Date.now(), amount: CARE.RECOVER });
    setState((s) => {
      const tokens = s.tokens + fresh.length * TOKENS_PER_ITEM;
      return {
        ...s,
        tokens,
        // Ticking anything today is what care responds to. Recovery is
        // deliberately larger than a day's decay, so one good day undoes
        // several bad ones and the meter never becomes a hole to climb out of.
        care: Math.min(CARE.MAX, s.care + CARE.RECOVER),
        rewarded: [...alreadyPaid, ...fresh],
        rewardedDay: today(),
        lastDay: today(),
      };
    });
  }, [done, hydrated, state.speciesId, state.rewarded, state.rewardedDay]);

  const stage = stageForTokens(state.tokens);

  // ---- Notice an evolution so the UI can celebrate it ----
  useEffect(() => {
    if (!hydrated) return;
    if (stage > prevStage.current && stage > state.seenStage) {
      setPendingEvolution(true);
    }
    prevStage.current = stage;
  }, [stage, hydrated, state.seenStage]);

  const choose = useCallback((id: SpeciesId) => {
    setState((s) => {
      // The quiz now ends here every time, so this runs on people who already
      // have a pal. Re-confirming the one you have must not top the care meter
      // back up — that would make re-running the quiz a way to undo neglect.
      if (s.speciesId === id) return s;
      return { ...s, speciesId: id, care: CARE.START, lastDay: today() };
    });
  }, []);

  const acknowledgeEvolution = useCallback(() => {
    setPendingEvolution(false);
    setState((s) => ({ ...s, seenStage: stageForTokens(s.tokens) }));
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY);
    setPendingEvolution(false);
    prevStage.current = 0;
  }, []);

  const value = useMemo<CompanionStore>(
    () => ({
      hydrated,
      speciesId: state.speciesId,
      tokens: state.tokens,
      care: state.care,
      lastGain,
      stage,
      mood: moodForCare(state.care),
      pendingEvolution,
      choose,
      acknowledgeEvolution,
      reset,
    }),
    [hydrated, state, stage, lastGain, pendingEvolution, choose, acknowledgeEvolution, reset],
  );

  return (
    <CompanionContext.Provider value={value}>{children}</CompanionContext.Provider>
  );
}

export function useCompanion(): CompanionStore {
  const store = useContext(CompanionContext);
  if (!store) throw new Error('useCompanion must be used inside a CompanionProvider');
  return store;
}

/** Convenience: the chosen species record, or null. */
export function useSpecies() {
  const { speciesId } = useCompanion();
  return speciesId ? SPECIES[speciesId] : null;
}
