import { Component } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-review-step',
  imports: [StepHeader],
  templateUrl: './review-step.html',
  styleUrl: './review-step.scss',
})
export class ReviewStep {
  // Bind step-specific static data to the template
  readonly view = BUILDER_STEPS.find(step => step.id === STEP_IDS.REVIEW)!;
}
