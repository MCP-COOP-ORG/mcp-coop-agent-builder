import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BUILDER_STEPS, STEP_IDS, DESCRIPTION_BLOCKS, BUILDER_DICTIONARY } from '@shared/constants';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField, InputField, MultiSelectField, BaseFormStep } from '@shared/components';

/**
 * Dumb component that represents the "Description" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
  selector: 'app-description-step',
  imports: [StepLayout, RadioGroup, CheckboxGroup, TextareaField, InputField, MultiSelectField, ReactiveFormsModule],
  templateUrl: './description-step.html',
  styleUrl: './description-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionStep extends BaseFormStep {
  /**
   * View Model containing all static template-bound data to avoid polluting the component class.
   * Adheres to the Zero Literals Policy by sourcing data from constants.
   */
  readonly view = {
    step: BUILDER_STEPS.find(step => step.id === STEP_IDS.DESCRIPTION)!,
    blocksArray: DESCRIPTION_BLOCKS,
    dictionary: BUILDER_DICTIONARY
  };

  protected get stateSignal() {
    return this.builderState.descriptionData;
  }
}
