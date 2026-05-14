import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly view = {
    isDark: this.darkMode,
    themeIcon: computed(() =>
      this.darkMode()
        ? BUILDER_DICTIONARY.header.lightModeIcon
        : BUILDER_DICTIONARY.header.darkModeIcon,
    ),
    ariaLabel: BUILDER_DICTIONARY.header.toggleThemeAriaLabel,
    githubWidgetUrl: this.sanitizer.bypassSecurityTrustResourceUrl(BUILDER_DICTIONARY.header.githubWidgetUrl),
  } as const;

  protected toggleTheme(): void {
    this.darkMode.update((isDark) => !isDark);
  }
}
