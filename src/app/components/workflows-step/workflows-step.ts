import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GENERATED_PAGES_CONFIG } from '@shared/configs';
import { ConfigCategory } from '@shared/models';
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
    step: GENERATED_PAGES_CONFIG['workflows'],
    blocksArray: GENERATED_PAGES_CONFIG['workflows'].categories.map((cat: ConfigCategory) => ({
      ...cat,
      options: cat.items
    }))
  };

  protected override get stateSignal() {
    return this.builderState.workflowsData;
  }
}
