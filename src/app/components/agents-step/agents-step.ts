import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GENERATED_PAGES_CONFIG } from '@shared/configs';
import { ConfigCategory } from '@shared/models';
import { StepLayout, RadioGroup, CheckboxGroup, TextareaField, BaseFormStep } from '@shared/components';

/**
 * Dumb component that represents the "Agents" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
  selector: 'app-agents-step',
  imports: [StepLayout, RadioGroup, CheckboxGroup, TextareaField, ReactiveFormsModule],
  templateUrl: './agents-step.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsStep extends BaseFormStep {
  /**
   * View Model containing all data from the generated file-system based configuration.
   */
  readonly view = {
    step: GENERATED_PAGES_CONFIG['agents'],
    blocksArray: GENERATED_PAGES_CONFIG['agents'].categories.map((cat: ConfigCategory) => ({
      ...cat,
      options: cat.items
    }))
  };

  protected override get stateSignal() {
    return this.builderState.agentsData;
  }
}
