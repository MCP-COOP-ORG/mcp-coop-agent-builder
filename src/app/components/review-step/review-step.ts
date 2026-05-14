import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
  Injector
} from '@angular/core';
import { TuiHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiLoader, TuiNotificationService, TuiDialogService } from '@taiga-ui/core';
import { TuiTree, TUI_CONFIRM } from '@taiga-ui/kit';
import { CodeEditor, StepHeader } from '@shared/components';
import { BUILDER_DICTIONARY, BUILDER_STEPS, DEFAULT_LANGUAGE, GeneratedFile, LANGUAGE_MAP, STEP_IDS } from '@shared/constants';
import { GENERATED_AI_ENVIRONMENTS } from '@shared/configs';
import { ArchiveGenerator } from '../../services/archive-generator';
import { BuilderState } from '../../services/builder-state';

import { buildFileTree, FileTreeNode } from '@shared/utils';

@Component({
  selector: 'app-review-step',
  imports: [StepHeader, TuiTree, TuiIcon, TuiButton, TuiLoader, CodeEditor],
  templateUrl: './review-step.html',
  styleUrl: './review-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStep {
  private readonly builderState = inject(BuilderState);
  private readonly archiveGenerator = inject(ArchiveGenerator);
  private readonly notifications = inject(TuiNotificationService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);
  private readonly codeEditor = viewChild('codeEditor', { read: CodeEditor });

  readonly view = {
    step: BUILDER_STEPS.find((step) => step.id === STEP_IDS.REVIEW)!,
    dictionary: BUILDER_DICTIONARY,
    environments: GENERATED_AI_ENVIRONMENTS
  };

  // ── State signals ─────────────────────────────────────────────────────────
  readonly isLoading = signal(true);
  readonly files = signal<GeneratedFile[]>([]);
  readonly activeFilePath = signal<string | null>(null);
  readonly editMode = signal(false);
  readonly editContent = signal('');
  readonly isDirty = signal(false);
  readonly activeEnvironment = signal<string>(
    (this.builderState.reviewData()['aiAgent'] as string) || 'antigravity'
  );

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly activeFile = computed(() =>
    this.files().find((f) => f.path === this.activeFilePath()) ?? null,
  );
  readonly treeRoot = computed<FileTreeNode>(() =>
    buildFileTree(this.files(), BUILDER_DICTIONARY.review.sidebarTitle)
  );

  readonly activeLanguage = computed(() => {
    const path = this.activeFilePath() ?? '';
    const ext = path.slice(path.lastIndexOf('.'));
    return LANGUAGE_MAP[ext] ?? DEFAULT_LANGUAGE;
  });

  /** Handler for TuiTree — returns children of a node */
  readonly childrenHandler: TuiHandler<FileTreeNode, readonly FileTreeNode[]> =
    (node) => node.children ?? [];

  constructor() {
    // Ensure global state matches local default if it was empty
    if (!this.builderState.reviewData()['aiAgent']) {
      this.builderState.reviewData.update((data) => ({ ...data, aiAgent: this.activeEnvironment() }));
    }

    afterNextRender(() => {
      void this.loadPreview(true);
    });
  }

  // ── Public actions ────────────────────────────────────────────────────────

  selectNode(node: FileTreeNode): void {
    if (node.type === 'folder') return;
    this.activeFilePath.set(node.path);
    this.editMode.set(false);
  }

  enableEdit(): void {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.view.dictionary.review.editWarningTitle,
        size: 's',
        data: {
          content: this.view.dictionary.review.editWarningMessage,
          yes: this.view.dictionary.review.editWarningConfirm,
          no: '' // Hide the 'no' button to make it an alert, not a confirm
        },
      })
      .subscribe((response) => {
        if (response) {
          this.editContent.set(this.activeFile()?.content ?? '');
          this.editMode.set(true);
        }
      });
  }

  cancelEdit(): void {
    // Revert editor content to original state from the active file
    const original = this.activeFile()?.content ?? '';
    this.codeEditor()?.resetContent(original);
    this.editMode.set(false);
  }

  saveEdit(): void {
    const path = this.activeFilePath();
    if (!path) return;

    const newContent = this.editContent();

    // Immutable update of the files array
    const updatedFiles = this.files().map((f) =>
      f.path === path ? { ...f, content: newContent } : f,
    );

    this.files.set(updatedFiles);

    // Sync edits back to the generator service so the global download button picks them up
    this.archiveGenerator.previewFiles.set(updatedFiles);

    // Save edit globally to persist across environment switches
    this.builderState.editedFiles.update(edits => ({
      ...edits,
      [path]: newContent
    }));

    this.editMode.set(false);
    this.isDirty.set(false);
  }

  onEditorChange(value: string): void {
    this.editContent.set(value);
    this.isDirty.set(true);
  }

  undoEdit(): void {
    this.codeEditor()?.undoEdit();
  }

  redoEdit(): void {
    this.codeEditor()?.redoEdit();
  }

  setEnvironment(envId: string): void {
    this.activeEnvironment.set(envId);
    this.builderState.reviewData.update((data) => ({ ...data, aiAgent: envId }));
    this.isLoading.set(true);
    void this.loadPreview();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async loadPreview(showNotification = false): Promise<void> {

    const generated = await this.archiveGenerator.generatePreview();
    this.files.set(generated);

    const firstFile = generated.find((f) => f.type === 'file');
    this.activeFilePath.set(firstFile?.path ?? null);

    this.isLoading.set(false);

    if (showNotification) {
      this.notifications
        .open(this.view.dictionary.notifications.reviewReadyMessage, {
          label: this.view.dictionary.notifications.reviewReadyLabel,
          icon: '@tui.package',
          autoClose: this.view.dictionary.notifications.autoCloseMs,
        })
        .subscribe();
    }
  }
}
