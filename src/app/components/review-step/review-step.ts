import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TuiHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiLoader, TuiNotificationService } from '@taiga-ui/core';
import { TuiTree } from '@taiga-ui/kit';
import { CodeEditor, StepHeader } from '@shared/components';
import { BUILDER_DICTIONARY, BUILDER_STEPS, DEFAULT_LANGUAGE, GeneratedFile, LANGUAGE_MAP, STEP_IDS } from '@shared/constants';
import { ArchiveGenerator } from '../../services/archive-generator';

export interface FileTreeNode {
  readonly label: string;
  readonly path: string;
  readonly type: 'file' | 'folder';
  readonly children?: FileTreeNode[];
}

@Component({
  selector: 'app-review-step',
  imports: [StepHeader, TuiTree, TuiIcon, TuiButton, TuiLoader, CodeEditor],
  templateUrl: './review-step.html',
  styleUrl: './review-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStep {
  private readonly archiveGenerator = inject(ArchiveGenerator);
  private readonly notifications = inject(TuiNotificationService);
  private readonly codeEditor = viewChild('codeEditor', { read: CodeEditor });

  readonly view = {
    step: BUILDER_STEPS.find((step) => step.id === STEP_IDS.REVIEW)!,
    dictionary: BUILDER_DICTIONARY,
  };

  // ── State signals ─────────────────────────────────────────────────────────
  readonly isLoading = signal(true);
  readonly files = signal<GeneratedFile[]>([]);
  readonly activeFilePath = signal<string | null>(null);
  readonly editMode = signal(false);
  readonly editContent = signal('');
  readonly isDirty = signal(false);

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly activeFile = computed(() =>
    this.files().find((f) => f.path === this.activeFilePath()) ?? null,
  );
  readonly treeRoot = computed<FileTreeNode>(() =>
    this.buildTree(this.files()),
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
    afterNextRender(() => {
      void this.loadPreview();
    });
  }

  // ── Public actions ────────────────────────────────────────────────────────

  selectNode(node: FileTreeNode): void {
    if (node.type === 'folder') return;
    this.activeFilePath.set(node.path);
    this.editMode.set(false);
  }

  enableEdit(): void {
    this.editContent.set(this.activeFile()?.content ?? '');
    this.editMode.set(true);
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

  async download(): Promise<void> {
    await this.archiveGenerator.downloadArchive(this.files());
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async loadPreview(): Promise<void> {
    const generated = await this.archiveGenerator.generatePreview();
    this.files.set(generated);

    const firstFile = generated.find((f) => f.type === 'file');
    this.activeFilePath.set(firstFile?.path ?? null);

    this.isLoading.set(false);

    this.notifications
      .open(this.view.dictionary.notifications.reviewReadyMessage, {
        label: this.view.dictionary.notifications.reviewReadyLabel,
        icon: '@tui.package',
        autoClose: this.view.dictionary.notifications.autoCloseMs,
      })
      .subscribe();
  }

  /**
   * Converts a flat GeneratedFile[] into a TuiTree-compatible nested FileTreeNode hierarchy.
   * Auto-vivifies folder nodes based on file paths since explicit folder nodes are no longer required.
   */
  private buildTree(files: GeneratedFile[]): FileTreeNode {
    const rootChildren: FileTreeNode[] = [];

    const getOrCreateFolder = (pathSegments: string[]): FileTreeNode[] => {
      let currentLevel = rootChildren;
      let currentPath = '';

      for (const segment of pathSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;

        let node = currentLevel.find((n) => n.label === segment && n.type === 'folder');
        if (!node) {
          node = { label: segment, path: currentPath, type: 'folder', children: [] };
          currentLevel.push(node);
        }
        currentLevel = node.children!;
      }
      return currentLevel;
    };

    for (const entry of files) {
      if (entry.type !== 'file') continue;

      const segments = entry.path.split('/');
      const fileName = segments.pop()!;
      
      const fileNode: FileTreeNode = {
        label: fileName,
        path: entry.path,
        type: 'file',
      };

      if (segments.length > 0) {
        const parentChildren = getOrCreateFolder(segments);
        parentChildren.push(fileNode);
      } else {
        rootChildren.push(fileNode);
      }
    }

    return {
      label: BUILDER_DICTIONARY.review.sidebarTitle,
      path: '',
      type: 'folder',
      children: rootChildren,
    };
  }
}
