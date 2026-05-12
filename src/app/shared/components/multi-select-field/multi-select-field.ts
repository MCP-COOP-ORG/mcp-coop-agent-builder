import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TuiTextfield, TuiLabel, TuiDataList } from '@taiga-ui/core';
import { TuiInputChip, TuiChevron, TuiMultiSelect } from '@taiga-ui/kit';

/**
 * Reusable Multi-Select component with checkboxes and chips.
 * Implements ControlValueAccessor to integrate seamlessly with Angular's Reactive Forms.
 * Wraps Taiga UI's tuiInputChip and tui-data-list.
 */
@Component({
  selector: 'app-multi-select-field',
  imports: [
    FormsModule, 
    TuiTextfield, 
    TuiLabel, 
    TuiDataList, 
    TuiInputChip, 
    TuiChevron, 
    TuiMultiSelect
  ],
  templateUrl: './multi-select-field.html',
  styleUrl: './multi-select-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectField),
      multi: true
    }
  ]
})
export class MultiSelectField implements ControlValueAccessor {
  /** The floating label for the field */
  label = input.required<string>();
  
  /** Placeholder text when nothing is selected */
  placeholder = input<string>('');
  
  /** Array of objects to populate the dropdown */
  options = input<{id: string; label: string}[]>([]);

  /** Internal value bound to the native input */
  value: string[] = [];
  
  /** Tracks the disabled state for Reactive Forms */
  disabled = false;

  private static nextId = 0;
  protected readonly fieldId = `multi-select-field-${MultiSelectField.nextId++}`;

  private onChange: (value: string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  /** Converts the selected ID back to the display label for the chips */
  readonly stringify = (id: string): string => {
    return this.options().find(opt => opt.id === id)?.label || id;
  };

  writeValue(val: string[]): void {
    this.value = Array.isArray(val) ? val : [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onModelChange(val: string[]) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
