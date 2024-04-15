
import { playSound } from "@modules/sound"

/**
 * Plays a sound based on the input keyboard event key.
 * @param {KeyboardEvent} e - The keyboard event triggered by user input.
 */
export function playInputSound(e: KeyboardEvent) {
    // Check if the key represents a single, printable character.
    if (e.key.length === 1 && e.key >= ' ' && e.key <= '~') {
        playSound("tcm", "typingPos2")
    } else if (e.key === "Backspace") {
        playSound("tcm", "typingNeg")
    }
}