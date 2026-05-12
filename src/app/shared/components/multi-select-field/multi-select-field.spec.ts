import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiSelectField } from './multi-select-field';
import { FormsModule } from '@angular/forms';
import { ComponentRef } from '@angular/core';

describe('MultiSelectField', () => {
  let component: MultiSelectField;
  let fixture: ComponentFixture<MultiSelectField>;
  let componentRef: ComponentRef<MultiSelectField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectField, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectField);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    // Set required inputs
    componentRef.setInput('label', 'Test Label');
    componentRef.setInput('options', [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' }
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue(['1']);
    expect(component.value).toEqual(['1']);
  });

  it('should handle non-array in writeValue', () => {
    component.writeValue(null as unknown as string[]);
    expect(component.value).toEqual([]);
  });

  it('should implement ControlValueAccessor registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onModelChange(['2']);
    expect(fn).toHaveBeenCalledWith(['2']);
  });

  it('should implement ControlValueAccessor registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onModelChange(['2']);
    expect(fn).toHaveBeenCalled();
  });

  it('should implement ControlValueAccessor setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
    
    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('should cover default CVA callbacks', () => {
    // Tests that the default no-op functions do not crash
    expect(() => {
      component['onChange'](['1']);
      component['onTouched']();
    }).not.toThrow();
  });

  it('should correctly stringify options', () => {
    expect(component.stringify('1')).toBe('Option 1');
    expect(component.stringify('unknown')).toBe('unknown');
  });
});
