import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TUI_DARK_MODE, TuiRoot } from '@taiga-ui/core';
import { AppHeader } from '@shared/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, AppHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
