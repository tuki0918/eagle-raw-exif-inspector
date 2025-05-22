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
