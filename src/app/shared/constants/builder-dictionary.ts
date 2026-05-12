export const BUILDER_DICTIONARY = {
  buttons: {
    back: 'Back',
    next: 'Next',
    generate: 'Generate',
    download: 'Download',
    reset: 'Reset All',
  },
  labels: {
    contents: 'Contents',
    projectIdentity: 'Project Identity',
    projectName: 'Project Name',
    businessDomains: 'Business Domains',
  },
  placeholders: {
    projectIdentity: 'Describe your project goal, key features, and core identity...',
    projectName: 'e.g. My Awesome App',
    businessDomains: 'Select domains',
  },
  icons: {
    downloadButton: '@tui.download',
    resetButton: '@tui.trash',
  },
  notifications: {
    reviewReadyLabel: 'Archive ready',
    reviewReadyMessage: 'Your AI context is configured. Click "Download" to save ai-context.zip.',
    autoCloseMs: 3000,
  }
} as const;
