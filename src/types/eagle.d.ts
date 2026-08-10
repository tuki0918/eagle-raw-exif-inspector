interface EagleItem {
  readonly id: string;
  readonly fileURL: string;
  annotation: string;
  save: () => Promise<boolean>;
}

declare const eagle: {
  onPluginCreate: (callback: (plugin: unknown) => void) => void;
  onThemeChanged: (callback: (theme: string) => void) => void;
  app: {
    theme: string;
    isDarkColors: () => boolean;
  };
  item: {
    getById: (itemId: string) => Promise<EagleItem | null>;
    getSelected: () => Promise<EagleItem[]>;
  };
};

declare const i18next: {
  t: (key: string) => string;
};
