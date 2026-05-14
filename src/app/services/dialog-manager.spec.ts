import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DialogManager } from './dialog-manager';
import { TuiDialogService } from '@taiga-ui/core';
import { of } from 'rxjs';

describe('DialogManager', () => {
  let service: DialogManager;
  let dialogService: TuiDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DialogManager,
        {
          provide: TuiDialogService,
          useValue: { open: vi.fn().mockReturnValue(of({})) }
        }
      ]
    });

    service = TestBed.inject(DialogManager);
    dialogService = TestBed.inject(TuiDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open preset dialog', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    service.openPresetDialog();
    expect(dialogService.open).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
