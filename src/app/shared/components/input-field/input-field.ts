import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TuiInput } from '@taiga-ui/core';
import { TuiTextfield, TuiLabel } from '@taiga-ui/core';

/**
 * Reusable single-line text input component with floating labels.
 * Implements ControlValueAccessor to integrate seamlessly with Angular's Reactive Forms.
 * Wraps Taiga UI's tuiInput and tuiTextfield.
 */
@Component({
  selector: 'app-input-field',
  imports: [FormsModule, TuiInput, TuiTextfield, TuiLabel],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputField),
      multi: true
    }
  ]
})
export class InputField implements ControlValueAccessor {
  /** The floating label for the text field, supplied by the dictionary */
  label = input.required<string>();
  
  /** Optional placeholder text */
  placeholder = input<string>('');
  
  /** Optional Taiga UI icon to display at the start of the field */
  iconStart = input<string>('');

  /** Internal value bound to the native input */
  value = '';
  
  /** Tracks the disabled state for Reactive Forms */
  disabled = false;

  private static nextId = 0;
  protected readonly fieldId = `input-field-${InputField.nextId++}`;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(val: string): void {
    this.value = val || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onModelChange(val: string) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
