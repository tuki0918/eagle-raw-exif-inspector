declare const eagle: {
  // biome-ignore lint/suspicious/noExplicitAny:
  onPluginCreate: (callback: (plugin: any) => void) => void;
  onThemeChanged: (callback: (theme: string) => void) => void;
  app: {
    theme: string;
  };
  item: {
    // biome-ignore lint/suspicious/noExplicitAny:
    getSelected: () => Promise<any[]>;
  };
};

declare const i18next: {
  t: (key: string) => string;
};
