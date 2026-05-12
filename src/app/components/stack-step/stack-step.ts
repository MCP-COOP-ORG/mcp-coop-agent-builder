import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS, STACK_BLOCKS } from '@shared/constants';
import { StepLayout } from '@shared/components';
import { BuilderBlockConfig } from '../../models';

/**
 * Dumb component that represents the "Stack" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
  selector: 'app-stack-step',
  imports: [StepLayout],
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
    blocksArray: Object.values(STACK_BLOCKS) as BuilderBlockConfig[]
  };
}
