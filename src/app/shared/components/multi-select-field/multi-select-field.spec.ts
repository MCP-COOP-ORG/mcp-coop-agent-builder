import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiRoot, provideTaiga } from '@taiga-ui/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectField } from './multi-select-field';

@Component({
  template: `
    <tui-root>
      <app-multi-select-field
        [label]="label()"
        [placeholder]="placeholder()"
        [options]="options()"
        [formControl]="control"
      ></app-multi-select-field>
    </tui-root>
  `,
  imports: [MultiSelectField, ReactiveFormsModule, TuiRoot]
})
class TestHostComponent {
  label = signal('Test Label');
  placeholder = signal('Test Placeholder');
  options = signal<{id: string; label: string}[]>([
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' }
  ]);
  control = new FormControl<string[]>(['1']);
}

describe('MultiSelectField', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    // Mock matchMedia which is missing in JSDOM but required by Taiga UI
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
      providers: [
        provideTaiga(),
        { provide: ChangeDetectorRef, useValue: { markForCheck: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update form control when options are selected', () => {
    component.control.setValue(['1', '2']);
    fixture.detectChanges();
    expect(component.control.value).toEqual(['1', '2']);
  });

  it('should disable the field when form control is disabled', () => {
    component.control.disable();
    fixture.detectChanges();
    expect(component.control.disabled).toBe(true);
  });

  it('should correctly stringify options', () => {
    const multiSelect = fixture.debugElement.query(By.directive(MultiSelectField)).componentInstance as MultiSelectField;
    expect(multiSelect.stringify('1')).toBe('Option 1');
    expect(multiSelect.stringify('unknown')).toBe('unknown');
  });

  it('should call onChange and onTouched when onModelChange is triggered', () => {
    const multiSelect = fixture.debugElement.query(By.directive(MultiSelectField)).componentInstance as MultiSelectField;
    const onChangeSpy = vi.spyOn(multiSelect as unknown as { onChange: (v: string[]) => void }, 'onChange');
    const onTouchedSpy = vi.spyOn(multiSelect as unknown as { onTouched: () => void }, 'onTouched');
    
    multiSelect.onModelChange(['2']);
    
    expect(onChangeSpy).toHaveBeenCalledWith(['2']);
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should handle writeValue with non-array values', () => {
    const multiSelect = fixture.debugElement.query(By.directive(MultiSelectField)).componentInstance as MultiSelectField;
    multiSelect.writeValue(null as unknown as string[]);
    expect(multiSelect.value).toEqual([]);
    
    multiSelect.writeValue(['1']);
    expect(multiSelect.value).toEqual(['1']);
  });

  it('should update internal value and trigger callbacks on model change', () => {
    const multiSelect = fixture.debugElement.query(By.directive(MultiSelectField)).componentInstance as MultiSelectField;
    const onChangeSpy = vi.fn();
    multiSelect.registerOnChange(onChangeSpy);
    
    multiSelect.onModelChange(['1', '2']);
    
    expect(multiSelect.value).toEqual(['1', '2']);
    expect(onChangeSpy).toHaveBeenCalledWith(['1', '2']);
  });

  it('should set disabled state', () => {
    const multiSelect = fixture.debugElement.query(By.directive(MultiSelectField)).componentInstance as MultiSelectField;
    multiSelect.setDisabledState(true);
    expect(multiSelect.disabled).toBe(true);
    
    multiSelect.setDisabledState(false);
    expect(multiSelect.disabled).toBe(false);
  });
});
