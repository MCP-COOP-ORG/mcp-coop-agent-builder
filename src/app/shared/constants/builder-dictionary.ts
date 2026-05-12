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
  messages: {
    reviewReady: 'The system is ready to bundle your AI configuration archive. Click "Download" to generate and save your ai-context.zip file.',
  }
} as const;
