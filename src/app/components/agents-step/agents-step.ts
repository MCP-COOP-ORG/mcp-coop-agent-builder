import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BUILDER_STEPS, STEP_IDS, AGENTS_BLOCKS } from '@shared/constants';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField, BaseFormStep } from '@shared/components';

/**
 * Dumb component that represents the "Agents" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
  selector: 'app-agents-step',
  imports: [StepLayout, RadioGroup, CheckboxGroup, TextareaField, ReactiveFormsModule],
  templateUrl: './agents-step.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsStep extends BaseFormStep {
  /**
   * View Model containing all static template-bound data to avoid polluting the component class.
   * Adheres to the Zero Literals Policy by sourcing data from constants.
   */
  readonly view = {
    step: BUILDER_STEPS.find(step => step.id === STEP_IDS.AGENTS)!,
    blocksArray: AGENTS_BLOCKS
  };

  protected get stateSignal() {
    return this.builderState.agentsData;
  }
}
