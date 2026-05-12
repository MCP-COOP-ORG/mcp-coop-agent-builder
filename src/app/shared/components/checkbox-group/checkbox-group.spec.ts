import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroup } from './checkbox-group';

describe('CheckboxGroup', () => {
  let component: CheckboxGroup;
  let fixture: ComponentFixture<CheckboxGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroup);
    fixture.componentRef.setInput('options', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and execute default callbacks', () => {
    expect(component).toBeTruthy();
    expect(() => component['onChange']([])).not.toThrow();
    expect(() => component['onTouched']()).not.toThrow();
  });

  it('should correctly map array of string values to object boolean map via writeValue', () => {
    fixture.componentRef.setInput('options', [
      { id: 'opt1', label: '1' },
      { id: 'opt2', label: '2' }
    ]);
    component.writeValue(['opt2']);
    expect(component.value['opt1']).toBe(false);
    expect(component.value['opt2']).toBe(true);
  });

  it('should emit array of selected IDs on checkbox change', () => {
    fixture.componentRef.setInput('options', [
      { id: 'opt1', label: '1' },
      { id: 'opt2', label: '2' }
    ]);
    let emittedValue: string[] = [];
    let touched = false;
    component.registerOnChange((val) => { emittedValue = val; });
    component.registerOnTouched(() => { touched = true; });
    
    // Simulate user checking opt1
    component.value = { opt1: true, opt2: false };
    component.onCheckboxChange();
    
    expect(emittedValue).toEqual(['opt1']);
    expect(touched).toBe(true);
  });
});
