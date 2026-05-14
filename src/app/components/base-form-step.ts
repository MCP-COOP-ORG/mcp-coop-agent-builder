import { Directive, inject, OnInit, WritableSignal, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuilderState } from '@services';
import { BuilderBlockConfig } from '@shared/constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Directive()
export abstract class BaseFormStep implements OnInit {
  protected readonly builderState = inject(BuilderState);
  protected readonly destroyRef = inject(DestroyRef);

  abstract readonly view: { blocksArray: BuilderBlockConfig[]; [key: string]: unknown };
  
  form!: FormGroup;

  // Each child step must define which signal it binds to
  protected abstract get stateSignal(): WritableSignal<Record<string, unknown>>;

  ngOnInit() {
    this.form = new FormGroup(
      this.view.blocksArray.reduce((acc, block) => {
        if (block.type === 'composite' && block.fields) {
          const nestedGroup: Record<string, FormControl> = {};
          block.fields.forEach(field => {
            const isArray = field.type === 'checkbox' || field.type === 'multi-select';
            let defaultValue: string | string[] | null = isArray ? [] : '';
            if (field.type === 'select' || field.type === 'radio') {
              defaultValue = null;
            }
            const validators = field.validators?.includes('required') ? [Validators.required] : [];
            nestedGroup[field.id] = new FormControl(defaultValue, validators);
          });
          acc[block.id] = new FormGroup(nestedGroup);
        } else {
          const defaultValue = block.type === 'checkbox' ? [] : (block.defaultOptionId || (block.type === 'textarea' ? '' : null));
          acc[block.id] = new FormControl(defaultValue);
        }
        return acc;
      }, {} as Record<string, FormControl | FormGroup>)
    );

    const initialData = this.stateSignal();
    if (Object.keys(initialData).length > 0) {
      this.form.patchValue(initialData);
    } else {
      this.stateSignal.set(this.form.getRawValue() as Record<string, unknown>);
    }

    this.form.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.stateSignal.set(this.form.getRawValue() as Record<string, unknown>);
    });
  }
}
