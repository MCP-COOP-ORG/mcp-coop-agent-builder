import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BUILDER_STEPS, STEP_IDS, SETUP_BLOCKS, BUILDER_DICTIONARY } from '@shared/constants';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField } from '@shared/components';
import { BuilderState } from '@services';

/**
 * Dumb component that represents the "Setup" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
  selector: 'app-setup-step',
  imports: [StepLayout, RadioGroup, CheckboxGroup, TextareaField, ReactiveFormsModule],
  templateUrl: './setup-step.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupStep {
  private readonly builderState = inject(BuilderState);

  /**
   * View Model containing all static template-bound data to avoid polluting the component class.
   * Adheres to the Zero Literals Policy by sourcing data from constants.
   */
  readonly view = {
    step: BUILDER_STEPS.find(step => step.id === STEP_IDS.SETUP)!,
    blocksArray: SETUP_BLOCKS,
    dictionary: BUILDER_DICTIONARY
  };

  /**
   * Temporary local form for UI visual testing purposes only.
   * Dynamically generated from the configuration array to guarantee 100% universality.
   */
  form = new FormGroup(
    SETUP_BLOCKS.reduce((acc, block) => {
      const defaultValue = block.type === 'checkbox' ? [] : (block.defaultOptionId || (block.type === 'textarea' ? '' : null));
      acc[block.id] = new FormControl(defaultValue);
      return acc;
    }, {} as Record<string, FormControl>)
  );

  constructor() {
    // Restore initial values from state if they exist, otherwise save default values to state
    const initialData = this.builderState.setupData();
    if (Object.keys(initialData).length > 0) {
      this.form.patchValue(initialData);
    } else {
      this.builderState.setupData.set(this.form.getRawValue() as Record<string, unknown>);
    }

    // Sync form changes to the global state
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(val => {
      this.builderState.setupData.set(this.form.getRawValue() as Record<string, unknown>);
    });
  }
}
