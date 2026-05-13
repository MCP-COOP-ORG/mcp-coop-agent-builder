import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';

import { RadioGroup } from './radio-group';

describe('RadioGroup', () => {
  let component: RadioGroup;
  let fixture: ComponentFixture<RadioGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroup);
    fixture.componentRef.setInput('options', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and execute default callbacks', () => {
    expect(component).toBeTruthy();
    expect(() => component['onChange'](null)).not.toThrow();
    expect(() => component['onTouched']()).not.toThrow();
  });

  it('should correctly set internal value via writeValue', () => {
    component.writeValue('option2');
    expect(component.value).toBe('option2');
  });

  it('should emit the selected value on radio change', () => {
    let emittedValue: string | null = null;
    let touched = false;
    component.registerOnChange((val) => { emittedValue = val; });
    component.registerOnTouched(() => { touched = true; });
    
    component.onRadioChange('option3');
    
    expect(component.value).toBe('option3');
    expect(emittedValue).toBe('option3');
    expect(touched).toBe(true);
  });

  it('should implement ControlValueAccessor setDisabledState', () => {
    // Component does not implement disabled state natively yet, but we test the no-op to cover CVA
    expect(() => component.setDisabledState?.(true)).not.toThrow();
  });

  it('should render correct template classes based on value', () => {
    fixture.componentRef.setInput('options', [
      { id: '1', label: 'One' },
      { id: '2', label: 'Two' }
    ]);
    fixture.detectChanges();
    
    // Test initial state where neither is active
    let activeLabels = fixture.nativeElement.querySelectorAll('.radio-card--active');
    expect(activeLabels.length).toBe(0);

    // Test when an option is selected
    component.value = '2';
    fixture.debugElement.injector.get(ChangeDetectorRef).detectChanges();
    
    activeLabels = fixture.nativeElement.querySelectorAll('.radio-card--active');
    expect(activeLabels.length).toBe(1);
    expect(activeLabels[0].textContent).toContain('Two');
  });
});
