/**
 * Represents a Memento (snapshot) of the BuilderState at a given point in time.
 */
export interface BuilderSnapshot {
  description?: Record<string, unknown>;
  review?: Record<string, unknown>;
  editedFiles?: Record<string, string>;
  [dynamicKey: string]: Record<string, unknown> | undefined;
}
