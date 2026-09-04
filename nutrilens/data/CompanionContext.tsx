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
   * Routine item ids that have already paid out a token.
   *
   * Without this, un-ticking and re-ticking the same item is an infinite token
   * farm — which would make the currency meaningless and, worse, reward
   * fiddling with the checklist rather than doing the thing.
   */
  rewarded: string[];
  /** Highest stage the user has actually been shown, for the reveal moment. */
  seenStage: Stage;
};

const EMPTY: Persisted = {
  speciesId: null,
  tokens: 0,
  care: CARE.MAX,
  lastDay: today(),
  rewarded: [],
  seenStage: 0,
};

type CompanionStore = {
  /** False until storage has been read — screens should not decide anything yet. */
  hydrated: boolean;
  speciesId: SpeciesId | null;
  tokens: number;
  care: number;
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
    const fresh = done.filter((id) => !state.rewarded.includes(id));
    if (fresh.length === 0) return;

    setState((s) => {
      const tokens = s.tokens + fresh.length * TOKENS_PER_ITEM;
      return {
        ...s,
        tokens,
        // Ticking anything today is what care responds to. Recovery is
        // deliberately larger than a day's decay, so one good day undoes
        // several bad ones and the meter never becomes a hole to climb out of.
        care: Math.min(CARE.MAX, s.care + CARE.RECOVER),
        rewarded: [...s.rewarded, ...fresh],
        lastDay: today(),
      };
    });
  }, [done, hydrated, state.speciesId, state.rewarded]);

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
    setState((s) => ({ ...s, speciesId: id, care: CARE.MAX, lastDay: today() }));
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
      stage,
      mood: moodForCare(state.care),
      pendingEvolution,
      choose,
      acknowledgeEvolution,
      reset,
    }),
    [hydrated, state, stage, pendingEvolution, choose, acknowledgeEvolution, reset],
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
