import { Howl } from "howler";
import { writable } from "svelte/store";
import { soundLibrary } from "./sound-library";

export const music = writable(new Howl({ src: [""] }));
export const fx = writable([new Howl({ src: [""] })]);

/**
 * Initializes and preloads all sounds from the `tcm` property of the `soundLibrary` object.
 * This ensures that there's minimal delay when the sounds are played for the first time.
 *
 * @example
 * initSound();  // Preloads all the sounds in soundLibrary.tcm
 *
 * @returns {void}
 */
export function initSound(): void {
  for (const key in soundLibrary.tcm) {
    soundLibrary.tcm[key].sound = new Howl({
      src: [soundLibrary.tcm[key].src],
      volume: soundLibrary.tcm[key].volume,
      preload: true
    })
  }
}

/**
 * Plays a sound based on category and id. Provides options for looping and fade effects.
 *
 * @export
 * @param {string} category - The category of the sound.
 * @param {string} id - The id of the sound within the category.
 * @param {boolean} [loop=false] - Determines if the sound should loop.
 * @param {boolean} [fade=false] - Determines if the sound should have fade in/out effects.
 * @param {number} [pitch=1] - The pitch of the sound.
 * @returns {Howl | undefined} - The Howl object of the sound.
 */
export function playSound(category: string, id: string, loop: boolean = false, fade: boolean = false, pitch: number = 1): Howl | undefined {

  const sound = soundLibrary[category][id].sound

  if (!sound) return

  if (loop) {
    sound.loop(true)
  }

  if (fade) {
    // Fade on begin and end
    const FADE_TIME = 2000;

    // Init
    sound.rate(pitch)
    sound.play();
    sound.fade(0, soundLibrary[category][id].volume, FADE_TIME);
  } else {
    sound.rate(pitch)
    sound.play();
  }

  return sound
}
/**
 * @returns {number} - A random pitch 
 */
export function randomPitch(): number {
  const max = 2;
  const min = 0.8;
  return Math.random() * (max - min) + min;
}