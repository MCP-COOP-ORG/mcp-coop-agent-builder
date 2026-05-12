import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BUILDER_STEPS, STEP_IDS, STACK_BLOCKS } from '@shared/constants';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField } from '@shared/components';

/**
 * Dumb component that represents the "Stack" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
  selector: 'app-stack-step',
  imports: [StepLayout, RadioGroup, CheckboxGroup, TextareaField, ReactiveFormsModule],
  templateUrl: './stack-step.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackStep {
  /**
   * View Model containing all static template-bound data to avoid polluting the component class.
   * Adheres to the Zero Literals Policy by sourcing data from constants.
   */
  readonly view = {
    step: BUILDER_STEPS.find(step => step.id === STEP_IDS.STACK)!,
    blocksArray: STACK_BLOCKS
  };

  /**
   * Temporary local form for UI visual testing purposes only.
   * Dynamically generated from the configuration array to guarantee 100% universality.
   */
  form = new FormGroup(
    STACK_BLOCKS.reduce((acc, block) => {
      const defaultValue = block.type === 'checkbox' ? [] : (block.defaultOptionId || (block.type === 'textarea' ? '' : null));
      acc[block.id] = new FormControl(defaultValue);
      return acc;
    }, {} as Record<string, FormControl>)
  );
}
