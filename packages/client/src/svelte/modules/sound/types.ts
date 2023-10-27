import type { Howl } from "howler";

export type Sound = {
  src: string;
  volume: number;
  sound?: Howl;
};

export type SoundAssets = {
  [index: string]: Sound;
};

export type SoundLibrary = {
  [index: string]: SoundAssets;
};
