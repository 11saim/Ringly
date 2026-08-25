import { useState, useEffect } from "react";

let listeners: ((collapsed: boolean) => void)[] = [];
let collapsedState = false;

export function getCollapsed() {
  return collapsedState;
}

export function setCollapsed(value: boolean) {
  collapsedState = value;
  listeners.forEach((l) => l(value));
}

export function toggleCollapsed() {
  setCollapsed(!collapsedState);
}

export function useSidebarCollapsed() {
  const [state, setState] = useState(collapsedState);

  useEffect(() => {
    const listener = (value: boolean) => setState(value);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return [state, setCollapsed, toggleCollapsed] as const;
}
