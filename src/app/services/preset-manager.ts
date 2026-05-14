import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BuilderState } from './builder-state';
import { TuiNotificationService } from '@taiga-ui/core';
import { BUILDER_DICTIONARY } from '@shared/constants';
import { BuilderSnapshot } from '@shared/models';

export interface Preset {
  id: string;
  name: string;
  state: BuilderSnapshot;
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class PresetManager {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly builderState = inject(BuilderState);
  private readonly notifications = inject(TuiNotificationService);
  private readonly STORAGE_KEY = 'builderPresets';
  private readonly MAX_PRESETS = 10;

  readonly presets = signal<Preset[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPresetsFromStorage();
    }
  }

  get currentPresets(): Preset[] {
    return this.presets();
  }

  saveCurrentStateAsPreset(name: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stateToSave = this.builderState.createSnapshot();

    const finalName = name.trim() || `Preset ${this.presets().length + 1}`;
    const current = [...this.presets()];
    const existingIndex = current.findIndex(p => p.name.toLowerCase() === finalName.toLowerCase());

    if (existingIndex !== -1) {
      // Overwrite existing preset
      current[existingIndex] = {
        ...current[existingIndex],
        state: stateToSave,
        createdAt: Date.now()
      };
    } else {
      // Add new preset
      const newPreset: Preset = {
        id: Date.now().toString(),
        name: finalName,
        state: stateToSave,
        createdAt: Date.now()
      };

      if (current.length >= this.MAX_PRESETS) {
        current.sort((a, b) => a.createdAt - b.createdAt);
        current.shift();
      }
      current.push(newPreset);
    }

    this.presets.set(current);
    this.savePresetsToStorage(current);

    this.notifications.open(BUILDER_DICTIONARY.presets.savedMessage, {
      label: BUILDER_DICTIONARY.presets.savedLabel,
      icon: '@tui.check',
      appearance: 'success'
    }).subscribe();
  }

  loadPreset(id: string): void {
    const preset = this.presets().find(p => p.id === id);
    if (!preset) return;

    this.builderState.restoreSnapshot(preset.state);

    this.notifications.open(BUILDER_DICTIONARY.presets.loadedMessage, {
      label: BUILDER_DICTIONARY.presets.loadedLabel,
      icon: '@tui.info',
      appearance: 'info'
    }).subscribe();
  }

  deletePreset(id: string): void {
    const current = this.presets().filter(p => p.id !== id);
    this.presets.set(current);
    this.savePresetsToStorage(current);
  }

  private loadPresetsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.presets.set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse presets from localStorage', e);
    }
  }

  private savePresetsToStorage(presets: Preset[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(presets));
    } catch (e) {
      console.error('Failed to save presets to localStorage', e);
    }
  }
}
