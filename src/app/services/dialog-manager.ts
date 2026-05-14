import { Injectable, inject, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { PresetDialogComponent } from '../components/preset-dialog/preset-dialog';

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
    console.log('--- DEBUG ---');
    console.log('PresetDialogComponent is:', PresetDialogComponent);
    console.log('Injector is:', this.injector);
    console.log('-------------');

    this.dialogService.open(
      new PolymorpheusComponent(PresetDialogComponent, this.injector),
      { size: 'm' }
    ).subscribe();
  }
}
