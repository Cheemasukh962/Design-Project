import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Persistence for the demo.
 *
 * WHY THIS EXISTS NOW. Until this file, the companion was the only thing that
 * survived a relaunch: quiz answers and the routine were held in memory and
 * wiped on every reload. That is defensible for a design prototype and
 * indefensible for a demo someone is asked to use — a participant who closes
 * the app and comes back to an empty routine learns that the app forgets them,
 * which is not the thing being tested.
 *
 * Everything is namespaced `vitapal.*` and versioned, so a shape change is a
 * new key rather than a crash on old data.
 */
export const KEYS = {
  quiz: 'vitapal.quiz.v1',
  routine: 'vitapal.routine.v1',
  saved: 'vitapal.saved.v1',
  /** Owned by data/CompanionContext.tsx, listed here so wipeAll can reach it. */
  companion: 'nutrilens.companion.v1',
} as const;

/**
 * State that loads itself from storage and writes itself back.
 *
 * `hydrated` is the part that matters. Reading storage is asynchronous, so the
 * first render always has the fallback value; writing during that window would
 * overwrite real saved data with the empty default. Nothing is written until
 * the first read has finished.
 */
export function usePersistentState<T>(
  key: string,
  fallback: T,
  /** Runs on the value read from storage, e.g. to expire yesterday's ticks. */
  migrate?: (stored: T) => T,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);
  const migrateRef = useRef(migrate);
  migrateRef.current = migrate;

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (!alive) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as T;
            setValue(migrateRef.current ? migrateRef.current(parsed) : parsed);
          } catch {
            // Corrupt entry: keep the fallback rather than crash the app.
          }
        }
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
    return () => {
      alive = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {
      // A failed write costs this session's memory, not the session itself.
    });
  }, [key, value, hydrated]);

  return [value, setValue, hydrated];
}

/** Local calendar day as YYYY-MM-DD. Matches data/companion.ts. */
export function today(): string {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Clears everything the app has stored.
 *
 * Needed because the demo seeds an example routine on a first run, and the only
 * way to see that first run again is to get back to genuinely empty storage.
 * Used by Profile's "Reset demo".
 */
export function useWipeAll() {
  return useCallback(async () => {
    await AsyncStorage.multiRemove(Object.values(KEYS)).catch(() => {});
  }, []);
}
