/** Language and region-related settings. */
export type LanguageRegionSettings = {
  language: string;
  dateLocale?: string | null;
};

/** Sound-related settings. */
export type SoundSettings = {
  soundEffectsEnabled: boolean;
  soundEffectsVolume: number;
};

/** Account-related settings. */
export type AccountSettings = {
  languageRegion: LanguageRegionSettings;
  sound: SoundSettings;
};
