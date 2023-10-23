import { Howl } from "howler";
import { soundLibrary } from "./sound-library";
import { get, writable } from "svelte/store";

export const music = writable(new Howl({ src: [""] }));
export const fx = writable([new Howl({ src: [""] })]);

/**
 * Plays a sound based on category and id. Provides options for looping and fade effects.
 *
 * @export
 * @param {string} category - The category of the sound.
 * @param {string} id - The id of the sound within the category.
 * @param {boolean} [loop=false] - Determines if the sound should loop.
 * @param {boolean} [fade=false] - Determines if the sound should have fade in/out effects.
 */
export function playSound(category: string, id: string, loop = false, fade = false) {

  const sound = new Howl({
    src: [soundLibrary[category][id].src],
    volume: soundLibrary[category][id].volume,
    preload: true,
    loop: loop,
  })

  const sounds = get(fx)

  fx.set([...sounds, sound]);

  if (fade) {
    // Fade on begin and end
    const FADE_TIME = 2000;

    // Init
    sound.play();
    sound.fade(0, 0.4, FADE_TIME);
    sound.on("load", function () {
      const FADE_OUT_TIME = sound.duration() * 1000 - sound.seek() - FADE_TIME;
      setTimeout(function () {
        sound.fade(0.4, 0, FADE_TIME);
      }, FADE_OUT_TIME);
    });
  } else {
    sound.play();
  }
}