import { Component } from '@angular/core';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-export-step',
  imports: [StepHeader],
  templateUrl: './export-step.html',
  styleUrl: './export-step.scss',
})
export class ExportStep {
  // Bind step-specific static data to the template
  readonly view = BUILDER_STEPS.find(step => step.id === STEP_IDS.EXPORT)!;
}
