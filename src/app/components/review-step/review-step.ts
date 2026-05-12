import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiNotificationService } from '@taiga-ui/core';
import { BUILDER_STEPS, STEP_IDS, BUILDER_DICTIONARY } from '@shared/constants';
import { StepHeader } from '@shared/components';

@Component({
  selector: 'app-review-step',
  imports: [StepHeader],
  templateUrl: './review-step.html',
  styleUrl: './review-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStep {
  private readonly notifications = inject(TuiNotificationService);

  // All UI-bound data gathered in a single view model object
  readonly view = {
    step: BUILDER_STEPS.find((step) => step.id === STEP_IDS.REVIEW)!,
    dictionary: BUILDER_DICTIONARY,
  };

  constructor() {
    // Show a welcome notification after the component renders to avoid ExpressionChangedAfterChecked
    afterNextRender(() => {
      this.notifications
        .open(this.view.dictionary.notifications.reviewReadyMessage, {
          label: this.view.dictionary.notifications.reviewReadyLabel,
          icon: '@tui.package',
          autoClose: this.view.dictionary.notifications.autoCloseMs,
        })
        .subscribe();
    });
  }
}
