import { Component } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS, BUILDER_DICTIONARY } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-review-step',
  imports: [StepHeader],
  templateUrl: './review-step.html',
  styleUrl: './review-step.scss',
})
export class ReviewStep {
  // Bind step-specific static data to the template
  readonly view = {
    step: BUILDER_STEPS.find(step => step.id === STEP_IDS.REVIEW)!,
    dictionary: BUILDER_DICTIONARY
  };
}
