import { Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-builder-block',
  imports: [TuiIcon, TuiCardLarge],
  templateUrl: './builder-block.html',
  styleUrl: './builder-block.scss',
})
export class BuilderBlock {
  title = input.required<string>();
  icon = input.required<string>();
}
