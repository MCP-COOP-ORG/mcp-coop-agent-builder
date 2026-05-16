import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputField } from './input-field';
import { FormsModule } from '@angular/forms';
import { ComponentRef } from '@angular/core';

describe('InputField', () => {
    let component: InputField;
    let fixture: ComponentFixture<InputField>;
    let componentRef: ComponentRef<InputField>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputField, FormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(InputField);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;

        // Set required inputs
        componentRef.setInput('label', 'Test Label');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should implement ControlValueAccessor writeValue', () => {
        component.writeValue('New Value');
        expect(component.value).toBe('New Value');
    });

    it('should handle null in writeValue', () => {
        component.writeValue(null as unknown as string);
        expect(component.value).toBe('');
    });

    it('should implement ControlValueAccessor registerOnChange', () => {
        const fn = vi.fn();
        component.registerOnChange(fn);
        component.onModelChange('Changed');
        expect(fn).toHaveBeenCalledWith('Changed');
    });

    it('should implement ControlValueAccessor registerOnTouched', () => {
        const fn = vi.fn();
        component.registerOnTouched(fn);
        component.onModelChange('Changed');
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
            component['onChange']('test');
            component['onTouched']();
        }).not.toThrow();
    });
});
