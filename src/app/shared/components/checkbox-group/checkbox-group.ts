import { Component, ChangeDetectionStrategy, input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TuiCheckbox } from '@taiga-ui/core';

/**
 * Reusable Checkbox Group component for the builder form.
 * Implements ControlValueAccessor to integrate seamlessly with Angular's Reactive Forms.
 * Uses Taiga UI checkboxes styled as interactive cards.
 */
@Component({
  selector: 'app-checkbox-group',
  imports: [FormsModule, TuiCheckbox],
  templateUrl: './checkbox-group.html',
  styleUrl: './checkbox-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroup),
      multi: true
    }
  ]
})
export class CheckboxGroup implements ControlValueAccessor {
  /** 
   * Array of options to render as interactive checkbox cards.
   * Driven by configuration data to adhere to the Single Source of Truth pattern.
   */
  options = input.required<{ id: string; label: string }[]>();

  /** Internal dictionary to map option IDs to their boolean selected state */
  value: Record<string, boolean> = {};

  private onChange: (value: string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(val: string[]): void {
    const newValue: Record<string, boolean> = {};
    
    // Initialize all available options to false (prevents indeterminate 'minus' state)
    const currentOptions = this.options();
    if (currentOptions) {
      currentOptions.forEach(opt => newValue[opt.id] = false);
    }

    if (val && Array.isArray(val)) {
      val.forEach(id => newValue[id] = true);
    }
    
    this.value = newValue;
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onCheckboxChange() {
    const selectedIds = Object.keys(this.value).filter(k => this.value[k]);
    this.onChange(selectedIds);
    this.onTouched();
  }
}
