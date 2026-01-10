declare const eagle: {
  onPluginCreate: (callback: (plugin: unknown) => void) => void;
  onThemeChanged: (callback: (theme: string) => void) => void;
  app: {
    theme: string;
    isDarkColors: () => boolean;
  };
  item: {
    getSelected: () => Promise<unknown[]>;
  };
};

declare const i18next: {
  t: (key: string) => string;
};
