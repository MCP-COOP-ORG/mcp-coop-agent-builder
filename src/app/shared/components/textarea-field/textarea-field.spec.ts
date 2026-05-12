import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaField } from './textarea-field';

describe('TextareaField', () => {
  let component: TextareaField;
  let fixture: ComponentFixture<TextareaField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaField],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaField);
    fixture.componentRef.setInput('label', 'Test Label');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and execute default callbacks', () => {
    expect(component).toBeTruthy();
    expect(() => component['onChange']('')).not.toThrow();
    expect(() => component['onTouched']()).not.toThrow();
  });

  it('should write value', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should register on change', () => {
    const fn = () => {};
    component.registerOnChange(fn);
    expect((component as any).onChange).toBe(fn);
  });

  it('should register on touched', () => {
    const fn = () => {};
    component.registerOnTouched(fn);
    expect((component as any).onTouched).toBe(fn);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('should trigger change event on input change', () => {
    let changedValue = '';
    component.registerOnChange((val: string) => { changedValue = val; });
    component.onModelChange('new value');
    expect(changedValue).toBe('new value');
    expect(component.value).toBe('new value');
  });
});
