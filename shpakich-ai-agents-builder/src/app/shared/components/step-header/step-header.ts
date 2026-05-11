import { Component, input } from '@angular/core';

@Component({
  selector: 'app-step-header',
  imports: [],
  templateUrl: './step-header.html',
  styleUrl: './step-header.scss',
})
export class StepHeader {
  title = input.required<string>();
  description = input.required<string>();
}
