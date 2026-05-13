import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TUI_DARK_MODE, TuiButton } from '@taiga-ui/core';
import { BUILDER_DICTIONARY } from '@shared/constants';

@Component({
  selector: 'app-header',
  imports: [TuiButton],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private readonly darkMode = inject(TUI_DARK_MODE);

  protected readonly view = {
    isDark: this.darkMode,
    themeIcon: computed(() =>
      this.darkMode()
        ? BUILDER_DICTIONARY.header.lightModeIcon
        : BUILDER_DICTIONARY.header.darkModeIcon,
    ),
    ariaLabel: BUILDER_DICTIONARY.header.toggleThemeAriaLabel,
  } as const;

  protected toggleTheme(): void {
    this.darkMode.update((isDark) => !isDark);
  }
}
