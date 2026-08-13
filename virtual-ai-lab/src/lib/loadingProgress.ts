"use client";

import { useSyncExternalStore } from "react";

export interface ProgressHandle {
  value: number;
  ready: boolean;
}

type Listener = () => void;

function createProgressStore(): ProgressHandle & {
  subscribe: (listener: Listener) => () => void;
  setValue: (value: number) => void;
  setReady: (ready: boolean) => void;
} {
  let value = 0;
  let ready = false;
  const listeners = new Set<Listener>();

  const notify = () => {
    listeners.forEach((l) => l());
  };

  return {
    get value() {
      return value;
    },
    get ready() {
      return ready;
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setValue(v: number) {
      value = v;
      notify();
    },
    setReady(r: boolean) {
      ready = r;
      notify();
    },
  };
}

export const progressStore = createProgressStore();

export function useProgressValue(): number {
  return useSyncExternalStore(
    progressStore.subscribe,
    () => progressStore.value,
    () => 0
  );
}

export function useProgressReady(): boolean {
  return useSyncExternalStore(
    progressStore.subscribe,
    () => progressStore.ready,
    () => false
  );
}