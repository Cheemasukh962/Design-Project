import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { KEYS, usePersistentState } from './storage';

/**
 * Nutrients the user has saved from the heart in the nutrient page's app bar.
 *
 * That control was in the Stitch mock and shipped with no handler — it drew a
 * heart and did nothing at all. A control that does nothing is worse than a
 * missing one, because tapping it and getting no response reads as the app
 * being broken rather than the feature being absent.
 *
 * Saving is deliberately not the same as adding to the routine. Adding commits
 * you to doing something daily; saving is "I want to read this again", which is
 * the more common reaction to a reference page. Saved nutrients surface on
 * Discover, which also gives that tab something real to show.
 */
type SavedStore = {
  saved: string[];
  toggleSaved: (nutrientId: string) => void;
  hydrated: boolean;
};

const SavedContext = createContext<SavedStore | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved, hydrated] = usePersistentState<string[]>(KEYS.saved, []);

  const toggleSaved = useCallback(
    (nutrientId: string) =>
      setSaved((current) =>
        current.includes(nutrientId)
          ? current.filter((id) => id !== nutrientId)
          : [...current, nutrientId],
      ),
    [setSaved],
  );

  const value = useMemo(() => ({ saved, toggleSaved, hydrated }), [saved, toggleSaved, hydrated]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedStore {
  const store = useContext(SavedContext);
  if (!store) throw new Error('useSaved must be used inside a SavedProvider');
  return store;
}
