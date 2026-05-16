import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-builder-block',
  imports: [TuiIcon, TuiCardLarge, TuiBadge, KeyValuePipe],
  templateUrl: './builder-block.html',
  styleUrl: './builder-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderBlock {
  title = input.required<string>();
  icon = input.required<string>();
  events = input<Record<string, string>>();
  description = input<string>();
  isDefault = input<boolean>();
}
