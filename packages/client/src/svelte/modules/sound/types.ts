export type Sound = {
  src: string;
  volume: number;
};

export type SoundAssets = {
  [index: string]: Sound;
};

export type SoundLibrary = {
  [index: string]: SoundAssets;
};
