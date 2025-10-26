"use client";

import { EffectCallback, useEffect, useRef, type DependencyList } from "react";

interface DebounceOptions {
  leading?: boolean; // run immediately on the first trigger
  delay?: number; // default: 300ms
}

export function useDebouncedEffect(
  effect: EffectCallback,
  deps: DependencyList,
  options: DebounceOptions = {}
) {
  const { leading = false, delay = 300 } = options;

  const latestEffectRef = useRef<EffectCallback>(effect);
  const cleanupRef = useRef<void | (() => void)>(undefined);
  const leadingCalledRef = useRef<boolean>(false);

  // keep latest effect reference
  useEffect(() => {
    latestEffectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    let timeoutId: number | undefined;

    const runEffect = () => {
      const cleanup = latestEffectRef.current?.();
      cleanupRef.current = cleanup;
    };

    if (leading && !leadingCalledRef.current) {
      runEffect();
      leadingCalledRef.current = true;
    } else {
      timeoutId = window.setTimeout(runEffect, delay);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, leading, delay]);
}
