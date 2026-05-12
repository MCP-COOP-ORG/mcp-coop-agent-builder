import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TuiTextarea } from '@taiga-ui/kit';
import { TuiTextfield, TuiLabel } from '@taiga-ui/core';

/**
 * Reusable Textarea component with floating labels and character limits.
 * Implements ControlValueAccessor to integrate seamlessly with Angular's Reactive Forms.
 * Wraps Taiga UI's tuiTextarea and tuiTextfield.
 */
@Component({
  selector: 'app-textarea-field',
  imports: [FormsModule, TuiTextarea, TuiTextfield, TuiLabel],
  templateUrl: './textarea-field.html',
  styleUrl: './textarea-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaField),
      multi: true
    }
  ]
})
export class TextareaField implements ControlValueAccessor {
  /** The floating label for the text field, supplied by the dictionary */
  label = input.required<string>();
  
  /** Optional placeholder text */
  placeholder = input<string>('');
  
  /** Maximum number of characters allowed in the textarea */
  limit = input<number>(300);
  
  /** Optional Taiga UI icon to display at the start of the field */
  iconStart = input<string>('');

  /** Internal value bound to the native textarea */
  value = '';
  
  /** Tracks the disabled state for Reactive Forms */
  disabled = false;

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
