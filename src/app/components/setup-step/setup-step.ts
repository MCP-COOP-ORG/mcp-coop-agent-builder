import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS, SETUP_BLOCKS } from '@shared/constants';
import { StepLayout } from '@shared/components';
import { BuilderBlockConfig } from '../../models';

/**
 * Dumb component that represents the "Setup" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
  selector: 'app-setup-step',
  imports: [StepLayout],
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
    blocksArray: Object.values(SETUP_BLOCKS) as BuilderBlockConfig[]
  };
}
