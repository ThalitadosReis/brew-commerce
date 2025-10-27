"use client";

import { useEffect, useRef, useState } from "react";

export interface UseLocalStorageOptions<T> {
  sync?: boolean;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}
// utilities
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function defaultSerialize<T>(value: T): string {
  return JSON.stringify(value);
}

function defaultDeserialize<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

function safeRead<T>(
  key: string,
  fallback: T,
  deserialize: (raw: string) => T
): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw != null ? deserialize(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(
  key: string,
  value: T,
  serialize: (value: T) => string
): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, serialize(value));
  } catch {}
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  const serialize = options.serialize ?? defaultSerialize<T>;
  const deserialize = options.deserialize ?? defaultDeserialize<T>;
  const client = isBrowser();

  // initial state
  const [value, setValue] = useState<T>(() =>
    client ? safeRead<T>(key, initialValue, deserialize) : initialValue
  );

  // avoid double-initialization
  const loadedOnceRef = useRef(false);

  // value saved by earlier renders or other code paths
  useEffect(() => {
    if (!client) return;
    if (loadedOnceRef.current) return;
    loadedOnceRef.current = true;
    setValue(safeRead<T>(key, initialValue, deserialize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, key]);

  // write-through whenever the value changes
  useEffect(() => {
    if (!client) return;
    safeWrite<T>(key, value, serialize);
  }, [client, key, value, serialize]);

  // cross-tab synchronization
  useEffect(() => {
    if (!client || !options.sync) return;

    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      // if the key was removed, fall back to initialValue
      if (event.newValue === null) {
        setValue(initialValue);
        return;
      }
      try {
        setValue(deserialize(event.newValue));
      } catch {}
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [client, key, initialValue, options.sync, deserialize]);

  return [value, setValue] as const;
}

// helper to read a JSON value
export function readJSON<T>(key: string, fallback: T): T {
  return safeRead<T>(key, fallback, defaultDeserialize<T>);
}
