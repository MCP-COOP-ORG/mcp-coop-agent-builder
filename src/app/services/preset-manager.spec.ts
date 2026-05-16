import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PresetManager } from './preset-manager';
import { BuilderState } from './builder-state';
import { TuiNotificationService } from '@taiga-ui/core';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { GENERATED_PRESETS } from '@shared/configs';
describe('PresetManager', () => {
    let service: PresetManager;
    let builderState: BuilderState;
    let notificationService: TuiNotificationService;

    beforeEach(() => {
        const store: Record<string, string> = {};
        const localStorageMock = {
            getItem: vi.fn((key: string) => store[key] || null),
            setItem: vi.fn((key: string, value: string) => {
                store[key] = value;
            }),
            removeItem: vi.fn((key: string) => {
                delete store[key];
            }),
            clear: vi.fn(() => {
                for (const key in store) delete store[key];
            }),
            length: 0,
            key: vi.fn(),
        } as unknown as Storage;

        vi.stubGlobal('localStorage', localStorageMock);

        TestBed.configureTestingModule({
            providers: [
                PresetManager,
                {
                    provide: BuilderState,
                    useValue: {
                        descriptionData: signal({ field: 'value' }),
                        reviewData: signal({ review: 'data' }),
                        dynamicData: {
                            'step-1': signal({ dynamic: 'val' }),
                        },
                        createSnapshot: vi.fn().mockReturnValue({
                            description: { field: 'value' },
                            review: { review: 'data' },
                            dynamicData: { 'step-1': { dynamic: 'val' } },
                        }),
                        restoreSnapshot: vi.fn(),
                    },
                },
                {
                    provide: TuiNotificationService,
                    useValue: { open: vi.fn().mockReturnValue(of({})) },
                },
            ],
        });

        service = TestBed.inject(PresetManager);
        builderState = TestBed.inject(BuilderState);
        notificationService = TestBed.inject(TuiNotificationService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save current state as preset', () => {
        const saveSpy = vi.spyOn(window.localStorage, 'setItem');
        service.saveCurrentStateAsPreset('Test Preset');

        const systemCount = GENERATED_PRESETS.length;
        expect(service.presets().length).toBe(systemCount + 1);
        expect(service.presets()[0].name).toBe('Test Preset');
        expect(service.presets()[0].state.description).toEqual({ field: 'value' });
        expect(saveSpy).toHaveBeenCalled();
        expect(notificationService.open).toHaveBeenCalled();
    });

    it('should use default name if name is empty', () => {
        service.saveCurrentStateAsPreset('  ');
        expect(service.presets()[0].name).toBe('Preset 1');
    });

    it('should overwrite preset if name exists (case-insensitive)', () => {
        service.saveCurrentStateAsPreset('test');
        const firstId = service.presets()[0].id;

        // Change state
        builderState.createSnapshot = vi.fn().mockReturnValue({
            description: { field: 'updated' },
            review: { review: 'data' },
            dynamicData: { 'step-1': { dynamic: 'val' } },
        });

        service.saveCurrentStateAsPreset('TEST');

        const systemCount = GENERATED_PRESETS.length;
        expect(service.presets().length).toBe(systemCount + 1);
        expect(service.presets()[0].id).toBe(firstId);
        expect(service.presets()[0].state.description).toEqual({ field: 'updated' });
    });

    it('should shift oldest preset if limit reached', () => {
        // Add 10 presets with unique timestamps
        for (let i = 0; i < 10; i++) {
            vi.spyOn(Date, 'now').mockReturnValue(1000 + i);
            service.saveCurrentStateAsPreset(`Preset ${i}`);
        }
        // The oldest preset will be at index 9 because of descending sort
        const oldestPresetId = service.presets()[9].id;

        // Add 11th preset with a later timestamp
        vi.spyOn(Date, 'now').mockReturnValue(2000);
        service.saveCurrentStateAsPreset('Newest');

        const systemCount = GENERATED_PRESETS.length;
        expect(service.presets().length).toBe(systemCount + 10);
        // The oldest one should be gone
        const found = service.presets().find((p) => p.id === oldestPresetId);
        expect(found).toBeUndefined();
        expect(service.presets()[0].name).toBe('Newest');
    });

    it('should load preset into state', () => {
        service.saveCurrentStateAsPreset('Test');
        const presetId = service.presets()[0].id;

        // Clear state
        builderState.descriptionData.set({});
        builderState.dynamicData['step-1'].set({});

        service.loadPreset(presetId);

        expect(builderState.restoreSnapshot).toHaveBeenCalledWith(
            expect.objectContaining({ description: { field: 'value' } }),
        );
        expect(notificationService.open).toHaveBeenCalled();
    });

    it('should clear dynamic step if not in preset during load', () => {
        // Create preset with step-1
        service.saveCurrentStateAsPreset('Test');
        const presetId = service.presets()[0].id;

        // Add a new step to state that isn't in the preset
        builderState.dynamicData['step-2'] = signal({ data: 'new' });

        service.loadPreset(presetId);
        expect(builderState.restoreSnapshot).toHaveBeenCalled();
    });

    it('should delete preset', () => {
        service.saveCurrentStateAsPreset('Test');
        const presetId = service.presets()[0].id;

        service.deletePreset(presetId);
        const systemCount = GENERATED_PRESETS.length;
        expect(service.presets().length).toBe(systemCount);
    });

    it('should handle localStorage errors gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
            throw new Error('Quota exceeded');
        });

        service.saveCurrentStateAsPreset('Test');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should handle invalid JSON in localStorage', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.spyOn(window.localStorage, 'getItem').mockImplementation((key) => {
            if (key === 'builderPresets') return 'invalid json';
            return null;
        });

        // We can trigger it by creating a new instance
        const newService = TestBed.runInInjectionContext(() => new PresetManager());
        expect(newService).toBeTruthy();

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
