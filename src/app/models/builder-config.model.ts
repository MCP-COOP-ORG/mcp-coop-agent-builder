export interface BuilderBlockConfig {
  id: string;
  title: string;
  icon: string;
}

export interface SetupBlocks {
  aiAgent: BuilderBlockConfig;
  projectMeta: BuilderBlockConfig;
  conventions: BuilderBlockConfig;
}

export interface StackBlocks {
  frontend: BuilderBlockConfig;
  backend: BuilderBlockConfig;
  database: BuilderBlockConfig;
  tooling: BuilderBlockConfig;
}
