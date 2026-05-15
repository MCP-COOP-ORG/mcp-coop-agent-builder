import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
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

  constructor() {
    try {
      // 1. Initial sync from platform theme
      const platformTheme = localStorage.getItem('theme');
      
      if (platformTheme === 'dark') {
        this.darkMode.set(true);
      } else {
        this.darkMode.set(false);
      }

      // 2. Sync toggles back to platform theme
      effect(() => {
        if (this.darkMode() === true) {
          localStorage.setItem('theme', 'dark');
        } else {
          localStorage.setItem('theme', 'light');
        }
      });
    } catch {
      this.darkMode.set(false);
    }
  }
}
