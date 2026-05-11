import { Component } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-ide-step',
  imports: [StepHeader],
  templateUrl: './ide-step.html',
  styleUrl: './ide-step.scss',
})
export class IdeStep {
  // Bind step-specific static data to the template
  readonly view = BUILDER_STEPS.find(step => step.id === STEP_IDS.IDE)!;
}
