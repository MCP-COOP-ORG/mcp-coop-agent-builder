import { Component } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-stack-step',
  imports: [StepHeader],
  templateUrl: './stack-step.html',
  styleUrl: './stack-step.scss',
})
export class StackStep {
  // Bind step-specific static data to the template
  readonly view = BUILDER_STEPS.find(step => step.id === STEP_IDS.STACK)!;
}
