
import { playSound } from "../../../modules/sound"

/**
 * Plays a sound based on the input keyboard event key.
 * @param {KeyboardEvent} e - The keyboard event triggered by user input.
 */
export function playInputSound(e: KeyboardEvent) {
    if (e.key === "Backspace") {
        playSound("tcm", "button3")
    } else if (e.key === "Enter") {
        playSound("tcm", "bow")
    } else {
        // Check if the key represents a single, printable character.
        if (e.key.length === 1 && e.key >= ' ' && e.key <= '~') {
            playSound("tcm", "button2")
        }
    }
}