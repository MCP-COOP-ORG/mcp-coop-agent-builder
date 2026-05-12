import { Component, input } from '@angular/core';
import { TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-builder-block',
  imports: [TuiIcon, TuiTitle, TuiCardLarge, TuiHeader],
  templateUrl: './builder-block.html',
  styleUrl: './builder-block.scss',
})
export class BuilderBlock {
  title = input.required<string>();
  icon = input.required<string>();
}
