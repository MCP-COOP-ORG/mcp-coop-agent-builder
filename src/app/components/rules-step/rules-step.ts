import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GENERATED_PAGES_CONFIG } from '@shared/configs';
import { ConfigCategory } from '@shared/models';
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
    step: GENERATED_PAGES_CONFIG['rules'],
    blocksArray: GENERATED_PAGES_CONFIG['rules'].categories.map((cat: ConfigCategory) => ({
      ...cat,
      options: cat.items
    }))
  };

  protected override get stateSignal() {
    return this.builderState.rulesData;
  }
}
