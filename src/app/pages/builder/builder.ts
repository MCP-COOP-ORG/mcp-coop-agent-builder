import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiStep, TuiStepper } from '@taiga-ui/kit';
import { filter, map, startWith } from 'rxjs';
import { APP_ROUTES, BUILDER_DICTIONARY, BUILDER_STEPS } from '@shared/constants';
import { ArchiveGenerator } from '@services';

@Component({
  selector: 'app-builder',
  imports: [RouterOutlet, TuiStepper, TuiStep, TuiButton],
  templateUrl: './builder.html',
  styleUrl: './builder.scss',
})
export class Builder {
  // Injecting router via modern inject() function, abandoning constructors
  private readonly router = inject(Router);
  private readonly archiveGenerator = inject(ArchiveGenerator);

  // All constants and UI texts gathered into a single object
  readonly view = {
    ...BUILDER_DICTIONARY,
    steps: BUILDER_STEPS
  };

  // Converting router events stream into a Signal
  // This is a reactive way to track the active URL without manual subscriptions
  private readonly urlSignal = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  // Computing current step index based on URL
  // computed() will automatically recalculate only when urlSignal changes
  readonly activeStepIndex = computed(() => {
    const url = this.urlSignal() || '';
    const index = this.view.steps.findIndex((step) => url.includes(`${APP_ROUTES.BUILDER}/${step.id}`));
    return index === -1 ? 0 : index;
  });

  // Navigating to the next step. The stepper updates automatically thanks to computed()
  nextStep() {
    const current = this.activeStepIndex();
    if (current < this.view.steps.length - 1) {
      this.router.navigate([APP_ROUTES.BUILDER, this.view.steps[current + 1].id]);
    }
  }

  // Navigating to the previous step
  prevStep() {
    const current = this.activeStepIndex();
    if (current > 0) {
      this.router.navigate([APP_ROUTES.BUILDER, this.view.steps[current - 1].id]);
    }
  }

  // Handling manual stepper item clicks
  onStepClick(index: number) {
    if (index >= 0 && index < this.view.steps.length) {
      this.router.navigate([APP_ROUTES.BUILDER, this.view.steps[index].id]);
    }
  }

  // Placeholder for downloading the context archive on the final Export step
  async download() {
    console.log('Downloading context archive...');
    await this.archiveGenerator.downloadArchive();
  }
}
