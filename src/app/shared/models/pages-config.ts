export interface ConfigItem {
  id: string;
  label: string;
  filePath: string;
  recommendedWith?: string[];
  discouragedWith?: string[];
}

export interface ConfigCategory {
  id: string;
  title: string;
  icon: string;
  type: 'checkbox' | 'radio';
  order?: number;
  items: ConfigItem[];
}

export interface PageConfig {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  categories: ConfigCategory[];
}
