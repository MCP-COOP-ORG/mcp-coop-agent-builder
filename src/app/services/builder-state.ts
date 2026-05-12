import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BuilderState {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'builderState';

  // Signals for each step's form data
  readonly setupData = signal<Record<string, unknown>>({});
  readonly stackData = signal<Record<string, unknown>>({});

  constructor() {
    // Only access sessionStorage if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();

      // Effect to auto-save to sessionStorage whenever signals change
      effect(() => {
        const stateToSave = {
          setup: this.setupData(),
          stack: this.stackData()
        };
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
      });
    }
  }

  /**
   * Loads the initial state from sessionStorage
   */
  private loadFromStorage(): void {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.setup) this.setupData.set(parsed.setup);
        if (parsed.stack) this.stackData.set(parsed.stack);
      } catch (e) {
        console.error('Failed to parse builder state from sessionStorage', e);
      }
    }
  }

  /**
   * Hard reset of all builder state by clearing storage and reloading
   */
  reset(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.STORAGE_KEY);
      // Hard reload to completely wipe form states and memory
      window.location.href = '/builder/setup';
    }
  }
}
