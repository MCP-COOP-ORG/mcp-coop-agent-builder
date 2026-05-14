export interface PlatformTemplates {
  skill: string;
  rule: string;
  workflow: string;
}

export interface PlatformDefaults {
  trigger?: string;
  globs?: string;
  skillDescription?: string;
  ruleDescription?: string;
  workflowDescription?: string;
}

export interface PlatformConfig {
  id: string;
  label: string;
  content: string;
  templates: PlatformTemplates;
  defaults?: PlatformDefaults;
}

