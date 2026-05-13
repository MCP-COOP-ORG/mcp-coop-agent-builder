import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BUILDER_STEPS, STEP_IDS, WORKFLOWS_BLOCKS } from '@shared/constants';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField, BaseFormStep } from '@shared/components';

@Component({
  selector: 'app-workflows-step',
  imports: [StepLayout, RadioGroup, CheckboxGroup, TextareaField, ReactiveFormsModule],
  templateUrl: './workflows-step.html',
  styleUrl: './workflows-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowsStep extends BaseFormStep {
  readonly view = {
    step: BUILDER_STEPS.find(step => step.id === STEP_IDS.WORKFLOWS)!,
    blocksArray: WORKFLOWS_BLOCKS
  };

  protected get stateSignal() {
    return this.builderState.workflowsData;
  }
}
