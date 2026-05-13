export interface PlatformTemplates {
  skill: string;
  rule: string;
  workflow: string;
}

export interface PlatformConfig {
  id: string;
  content: string;
  templates: PlatformTemplates;
}
