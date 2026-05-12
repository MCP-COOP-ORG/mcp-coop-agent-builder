import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BUILDER_STEPS, STEP_IDS, SETUP_BLOCKS, BUILDER_DICTIONARY } from '@shared/constants';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField } from '@shared/components';

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
}
