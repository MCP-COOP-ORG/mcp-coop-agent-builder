import { Component } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-project-step',
  imports: [StepHeader],
  templateUrl: './project-step.html',
  styleUrl: './project-step.scss',
})
export class ProjectStep {
  // Bind step-specific static data to the template
  readonly view = BUILDER_STEPS.find(step => step.id === STEP_IDS.PROJECT)!;
}
