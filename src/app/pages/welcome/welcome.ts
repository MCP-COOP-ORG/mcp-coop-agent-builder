import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { BUILDER_DICTIONARY } from '@shared/constants';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink, TuiButton],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  readonly view = {
    labels: BUILDER_DICTIONARY.labels,
    buttons: BUILDER_DICTIONARY.buttons,
  } as const;
}
