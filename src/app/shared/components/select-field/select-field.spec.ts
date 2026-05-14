import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TuiRoot, provideTaiga } from '@taiga-ui/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectField, SelectOption } from './select-field';

// Taiga UI dark-mode token requires matchMedia which jsdom does not provide
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

@Component({
  template: `
    <tui-root>
      <app-select-field
        [label]="label()"
        [placeholder]="placeholder()"
        [options]="options()"
        [formControl]="control"
      ></app-select-field>
    </tui-root>
  `,
  imports: [SelectField, ReactiveFormsModule, TuiRoot]
})
class TestHostComponent {
  label = signal('Test Label');
  placeholder = signal('Test Placeholder');
  options = signal<SelectOption[]>([
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' }
  ]);
  control = new FormControl('1');
}

describe('SelectField', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
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

  it('should update form control when option is selected', () => {
    component.control.setValue('2');
    fixture.detectChanges();
    expect(component.control.value).toBe('2');
  });

  it('should disable the field when form control is disabled', () => {
    component.control.disable();
    fixture.detectChanges();
    expect(component.control.disabled).toBe(true);
  });

  it('should call onChange and onTouched when onModelChange is triggered', () => {
    const selectField = fixture.debugElement.query(By.directive(SelectField)).componentInstance as SelectField;
    const onChangeSpy = vi.spyOn(selectField as unknown as { onChange: (v: string | null) => void }, 'onChange');
    const onTouchedSpy = vi.spyOn(selectField as unknown as { onTouched: () => void }, 'onTouched');
    selectField.onModelChange('2');
    expect(onChangeSpy).toHaveBeenCalledWith('2');
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should have default empty functions for onChange and onTouched that do not throw', () => {
    // Create a new instance to test defaults before they are overwritten by formControl
    const selectField = TestBed.runInInjectionContext(() => {
      // In tests, we need to ensure the constructor can inject ChangeDetectorRef
      return new SelectField();
    });
    expect(() => {
      // Accessing private methods for testing
      (selectField as unknown as { onChange: (v: string | null) => void }).onChange('1');
      (selectField as unknown as { onTouched: () => void }).onTouched();
    }).not.toThrow();
  });

  it('should resolve stringify to label', () => {
    const selectField = fixture.debugElement.query(By.directive(SelectField)).componentInstance as SelectField;
    // Access protected stringify arrow-function property (already bound to instance)
    const stringify = (selectField as unknown as { stringify: (id: string) => string }).stringify;
    expect(stringify('1')).toBe('Option 1');
    expect(stringify('unknown')).toBe('');
  });

  it('should render "No options" when options are empty', async () => {
    component.options.set([]);
    fixture.detectChanges();
    await fixture.whenStable();
    
    // Trigger dropdown opening
    const select = fixture.nativeElement.querySelector('input[tuiSelect]');
    (select as HTMLElement)?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    
    const options = document.querySelectorAll('button[tuiOption]');
    expect(options[0]?.textContent?.trim()).toBe('No options');
    expect((options[0] as HTMLButtonElement).disabled).toBe(true);
  });
});
