import { useState, useEffect } from "react";

/**
 * Persisted state hook that keeps a piece of state in sync with localStorage.
 * Usage:
 *   const [value, setValue] = useLocalStorage("key", initialValue);
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. storage full / disabled)
    }
  }, [key, value]);

  return [value, setValue] as const;
} 