import { Directive, inject, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuilderState } from '@services';
import { BuilderBlockConfig } from '@shared/constants';
import { Subject, takeUntil } from 'rxjs';

@Directive()
export abstract class BaseFormStep implements OnInit, OnDestroy {
  protected readonly builderState = inject(BuilderState);
  protected readonly destroy$ = new Subject<void>();

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
            const defaultValue = isArray ? [] : (field.options?.[0]?.id || '');
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

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.stateSignal.set(this.form.getRawValue() as Record<string, unknown>);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
