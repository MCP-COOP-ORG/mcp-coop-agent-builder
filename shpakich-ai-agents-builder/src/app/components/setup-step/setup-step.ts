import { Component } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-setup-step',
  imports: [StepHeader],
  templateUrl: './setup-step.html',
  styleUrl: './setup-step.scss',
})
export class SetupStep {
  // Bind step-specific static data to the template
  readonly view = BUILDER_STEPS.find(step => step.id === STEP_IDS.SETUP)!;
}
