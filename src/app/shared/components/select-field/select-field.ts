import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TuiTextfield, TuiLabel, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TuiChevron, TuiSelect } from '@taiga-ui/kit';
import { TuiStringHandler } from '@taiga-ui/cdk';

export interface SelectOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-select-field',
  imports: [FormsModule, TuiTextfield, TuiLabel, TuiChevron, TuiSelect, TuiDataList, TuiDropdown],
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectField),
      multi: true
    }
  ]
})
export class SelectField implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);
  
  label = input.required<string>();
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);

  value: string | null = null;
  disabled = false;

  private static nextId = 0;
  protected readonly fieldId = `select-field-${SelectField.nextId++}`;

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly stringify: TuiStringHandler<string> = (id) =>
    this.options().find((item) => item.id === id)?.label ?? '';

  writeValue(val: string | null): void {
    this.value = val;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onModelChange(val: string | null) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
