import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { KEYS, usePersistentState } from './storage';

/**
 * Quiz answers, stored on the device.
 *
 * These used to be memory-only, on the argument that a demo which remembers
 * stale answers between usability sessions is worse than one that starts
 * clean. That argument was right about back-to-back sessions and wrong about
 * everything else: a participant who reloads mid-task lost their answers, and
 * Home silently fell back to the demo persona, so the app appeared to invent
 * results. Between sessions the fix is Profile's "Reset demo", which is
 * explicit and takes one tap.
 *
 * Every answer id here is referenced by name in data/inference.ts, which is
 * what lets a result cite the exact answer that produced it.
 */
export type QuizAnswers = {
  /** Q1, single: how they usually eat. */
  eating?: string;
  /** Q2, multi: food sources eaten regularly. */
  foods: string[];
  /** Q3, single: time spent outside on a typical day. */
  outside?: string;
  /** Q4, single: how often fruit or vegetables show up. */
  produce?: string;
  /** Q5, multi: dietary restrictions. */
  restrictions: string[];
};

const EMPTY: QuizAnswers = { foods: [], restrictions: [] };

type QuizStore = {
  answers: QuizAnswers;
  /** False until storage has been read. */
  hydrated: boolean;
  setSingle: (key: 'eating' | 'outside' | 'produce', value: string) => void;
  toggleMulti: (key: 'foods' | 'restrictions', value: string) => void;
  /** Replaces a multi answer outright — used by mutually exclusive options. */
  setMulti: (key: 'foods' | 'restrictions', values: string[]) => void;
  reset: () => void;
};

const QuizContext = createContext<QuizStore | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers, hydrated] = usePersistentState<QuizAnswers>(
    KEYS.quiz,
    EMPTY,
    // Older entries predate these arrays; a missing one would crash the
    // multi-select toggles on the first tap.
    (stored) => ({ ...EMPTY, ...stored, foods: stored.foods ?? [], restrictions: stored.restrictions ?? [] }),
  );

  const setSingle = useCallback(
    (key: 'eating' | 'outside' | 'produce', value: string) =>
      setAnswers((a) => ({ ...a, [key]: value })),
    [],
  );

  const toggleMulti = useCallback(
    (key: 'foods' | 'restrictions', value: string) =>
      setAnswers((a) => ({
        ...a,
        [key]: a[key].includes(value)
          ? a[key].filter((x) => x !== value)
          : [...a[key], value],
      })),
    [],
  );

  const setMulti = useCallback(
    (key: 'foods' | 'restrictions', values: string[]) =>
      setAnswers((a) => ({ ...a, [key]: values })),
    [],
  );

  const reset = useCallback(() => setAnswers(EMPTY), []);

  const value = useMemo(
    () => ({ answers, hydrated, setSingle, toggleMulti, setMulti, reset }),
    [answers, hydrated, setSingle, toggleMulti, setMulti, reset],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizStore {
  const store = useContext(QuizContext);
  if (!store) throw new Error('useQuiz must be used inside a QuizProvider');
  return store;
}
