import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BUILDER_STEPS, STEP_IDS, RULES_BLOCKS } from '@shared/constants';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField, BaseFormStep } from '@shared/components';

@Component({
  selector: 'app-rules-step',
  imports: [StepLayout, RadioGroup, CheckboxGroup, TextareaField, ReactiveFormsModule],
  templateUrl: './rules-step.html',
  styleUrl: './rules-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesStep extends BaseFormStep {
  readonly view = {
    step: BUILDER_STEPS.find(step => step.id === STEP_IDS.RULES)!,
    blocksArray: RULES_BLOCKS
  };

  protected get stateSignal() {
    return this.builderState.rulesData;
  }
}
