import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresetDialogComponent } from './preset-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { PresetManager } from '@services';
import { Preset } from '@shared/models';
import { ChangeDetectorRef, signal, WritableSignal } from '@angular/core';

describe('PresetDialogComponent', () => {
  let component: PresetDialogComponent;
  let fixture: ComponentFixture<PresetDialogComponent>;
  let presetManagerMock: { 
    presets: WritableSignal<Preset[]>; 
    deletePreset: ReturnType<typeof vi.fn>;
    saveCurrentStateAsPreset: ReturnType<typeof vi.fn>;
  };
  let contextMock: { completeWith: ReturnType<typeof vi.fn> };
  let presetsSignal: WritableSignal<Preset[]>;

  beforeEach(async () => {
    presetsSignal = signal([]);
    presetManagerMock = {
      presets: presetsSignal,
      deletePreset: vi.fn(),
      saveCurrentStateAsPreset: vi.fn()
    };

    contextMock = {
      completeWith: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PresetDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: PresetManager, useValue: presetManagerMock },
        { provide: POLYMORPHEUS_CONTEXT, useValue: contextMock },
        { provide: ChangeDetectorRef, useValue: { markForCheck: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should complete when cancel is called', () => {
    component.cancel();
    expect(contextMock.completeWith).toHaveBeenCalled();
  });

  it('should complete when savePreset is called and valid', () => {
    component.presetForm.setValue({ name: 'Test Preset' });
    component.savePreset();
    expect(contextMock.completeWith).toHaveBeenCalled();
  });

  it('should not save if form is invalid', () => {
    component.presetForm.setValue({ name: '' });
    component.savePreset();
    expect(contextMock.completeWith).not.toHaveBeenCalled();
  });

  it('should handle null name gracefully if validation is bypassed', () => {
    Object.defineProperty(component.presetForm, 'valid', { get: () => true });
    component.presetForm.patchValue({ name: null });
    component.savePreset();
    expect(presetManagerMock.saveCurrentStateAsPreset).toHaveBeenCalledWith('');
  });

  it('should not save if limit reached', () => {
    presetsSignal.set(Array(10).fill({ id: '1', name: 'Test', state: {}, createdAt: 1 } as Preset));
    component.presetForm.setValue({ name: 'Test' });
    component.savePreset();
    expect(contextMock.completeWith).not.toHaveBeenCalled();
  });

  it('should delete preset', () => {
    const mockEvent = new Event('click');
    vi.spyOn(mockEvent, 'stopPropagation');
    component.deletePreset('123', mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(presetManagerMock.deletePreset).toHaveBeenCalledWith('123');
  });

  it('should select preset', () => {
    component.selectPreset('Saved Preset');
    expect(component.presetForm.value.name).toBe('Saved Preset');
  });

  it('should render existing presets and handle keyboard events', () => {
    presetsSignal.set([
      { id: '1', name: 'Preset 1', createdAt: 12345, state: {} } as Preset
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const item = element.querySelector('.preset-dialog__item') as HTMLElement;
    expect(item).toBeTruthy();
    
    // Test keyup.enter
    item.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    expect(component.presetForm.value.name).toBe('Preset 1');
    
    // Clear and test keyup.space
    component.presetForm.patchValue({ name: '' });
    item.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
    expect(component.presetForm.value.name).toBe('Preset 1');
  });
});
