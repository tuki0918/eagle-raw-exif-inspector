declare const eagle: {
  onPluginCreate: (callback: (plugin: unknown) => void) => void;
  onThemeChanged: (callback: (theme: string) => void) => void;
  app: {
    theme: string;
  };
  item: {
    getSelected: () => Promise<unknown[]>;
    modifyTags: (options: { id: string; tags?: string[]; annotation?: string }) => Promise<unknown>;
  };
};

declare const i18next: {
  t: (key: string) => string;
};
