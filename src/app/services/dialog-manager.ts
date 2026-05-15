import { Injectable, inject, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TUI_CONFIRM } from '@taiga-ui/kit';

import { Observable } from 'rxjs';

/**
 * Centralized facade service for opening application dialogs.
 * Keeps UI components and Domain services decoupled from Taiga UI dialog boilerplate.
 */
@Injectable({
  providedIn: 'root'
})
export class DialogManager {
  private readonly dialogService = inject(TuiDialogService);
  private readonly injector = inject(Injector);

  openPresetDialog(): void {
    import('../components/preset-dialog/preset-dialog').then(m => {
      this.dialogService.open(
        new PolymorpheusComponent(m.PresetDialogComponent, this.injector),
        { size: 'm' }
      ).subscribe();
    });
  }

  openInfoDialog(title: string, content: string, size: 's' | 'm' | 'l' = 'm'): Observable<void> {
    return this.dialogService.open<void>(content, {
      label: title,
      size
    });
  }

  openConfirmDialog(title: string, message: string, confirmLabel: string): Observable<boolean> {
    return this.dialogService.open<boolean>(TUI_CONFIRM, {
      label: title,
      size: 's',
      data: {
        content: message,
        yes: confirmLabel,
        no: '' // Hide the 'no' button to make it an alert, not a confirm
      },
    });
  }
}
