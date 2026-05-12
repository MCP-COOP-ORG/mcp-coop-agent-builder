import { 
  Component, 
  input, 
  signal, 
  viewChildren, 
  ElementRef, 
  contentChild, 
  TemplateRef, 
  computed, 
  afterNextRender,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TuiTabs } from '@taiga-ui/kit';
import { BuilderStep, BUILDER_DICTIONARY, BuilderBlockConfig } from '@shared/constants';
import { StepHeader } from '../step-header/step-header';
import { BuilderBlock } from '../builder-block/builder-block';

/**
 * Universal layout component for Builder steps.
 * Handles the 2-column grid layout, ScrollSpy navigation, and block rendering.
 * It is a Dumb component that relies purely on input signals.
 */
@Component({
  selector: 'app-step-layout',
  imports: [StepHeader, BuilderBlock, TuiTabs, NgTemplateOutlet],
  templateUrl: './step-layout.html',
  styleUrl: './step-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepLayout {
  /** The view model containing dictionary labels for strict zero-literals compliance */
  readonly view = {
    labels: BUILDER_DICTIONARY.labels
  };

  /** The step configuration (title, description, icon) */
  step = input.required<BuilderStep>();
  
  /** The array of blocks to render in the layout */
  blocks = input.required<BuilderBlockConfig[]>();

  /** The projected template from the parent containing specific block controls */
  contentTemplate = contentChild<TemplateRef<{ $implicit: BuilderBlockConfig }>>(TemplateRef);
  
  /** Query for all rendered block wrapper elements to track scroll position */
  blockElements = viewChildren<ElementRef>('blockElement');

  /** Tracks the currently active tab index for the right-hand sidebar */
  activeTabIndex = signal(0);
  
  /** Computed view model for the sidebar tabs based on the blocks input */
  tabs = computed(() => {
    return this.blocks().map(block => ({
      id: block.id,
      label: block.title
    }));
  });

  constructor() {
    // We use afterNextRender to safely access the DOM for IntersectionObserver
    // This is the Angular Best Practice for DOM APIs, avoiding SSR/SSG issues.
    afterNextRender({
      read: () => this.setupScrollSpy()
    });
  }

  /**
   * Programmatically scrolls the window to a specific block when a sidebar tab is clicked.
   * @param index The index of the block in the blocks array
   */
  scrollToBlock(index: number) {
    this.activeTabIndex.set(index);
    const element = this.blockElements()[index]?.nativeElement;
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  /**
   * Initializes the IntersectionObserver to track which block is currently in the viewport.
   * Updates the activeTabIndex signal accordingly.
   */
  private setupScrollSpy() {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = this.tabs().findIndex(t => t.id === id);
          if (index !== -1) {
            this.activeTabIndex.set(index);
          }
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' });

    // Iterate over the signal array directly
    this.blockElements().forEach(el => observer.observe(el.nativeElement));
  }
}
