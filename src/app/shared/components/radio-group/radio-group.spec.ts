import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
