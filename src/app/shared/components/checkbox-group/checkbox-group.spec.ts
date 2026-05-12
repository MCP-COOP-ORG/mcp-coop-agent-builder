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

  it('should create', () => {
    expect(component).toBeTruthy();
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
    component.registerOnChange((val) => { emittedValue = val; });
    
    // Simulate user checking opt1
    component.value = { opt1: true, opt2: false };
    component.onCheckboxChange();
    
    expect(emittedValue).toEqual(['opt1']);
  });
});
