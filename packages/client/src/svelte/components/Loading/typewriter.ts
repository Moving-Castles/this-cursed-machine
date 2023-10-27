// --- TYPES ------------------------------------------------------------

type Child = {
    _type: string
    marks: string[]
    text: string
    _key: string
}

type ObjType = {
    children: Child[]
    _type: string
    style: string
    _key: string
    markDefs: any[]
}

// --- API --------------------------------------------------------------

/**
 * Creates div elements from the given array of objects and appends them sequentially
 * to the root element with a typewriter effect and an optional delay between divs.
 * @param {HTMLElement} root - The HTML element to append the divs to.
 * @param {ObjType[]} array - The array of objects.
 * @param {number} speed - The speed at which to write each character.
 * @param {number} delayBetweenDivs - The delay between the output of the divs.
 * @returns {Promise<void>} - A promise that resolves when all divs and their children have been appended.
 */
export async function animateContent(
    root: HTMLElement,
    array: ObjType[],
    speed: number = 100,
    delayBetweenDivs: number = 0
): Promise<void> {
    if (!root) return

    for (const obj of array) {
        const div = document.createElement("div")
        root.appendChild(div)

        for (const child of obj.children) {
            const span = document.createElement(child._type)
            div.appendChild(span)

            if (child.marks && child.marks.length > 0) {
                child.marks.forEach(mark => {
                    span.classList.add(mark)
                })
            }

            await typeWriter(span, child.text, speed)

            // Check and adjust the scroll position after appending each child
            adjustScrollPosition(div, root)
        }

        if (delayBetweenDivs > 0)
            await new Promise(res => setTimeout(res, delayBetweenDivs))
    }
}

/**
 * Creates a typewriter effect for each character of the given text within the given HTML element.
 * @param {HTMLElement} element - The HTML element to write the text into.
 * @param {string} text - The text to write.
 * @param {number} speed - The speed at which to write each character.
 * @returns {Promise<void>} - A promise that resolves when the typing is complete.
 */
export async function typeWriter(
    element: HTMLElement,
    text: string,
    speed: number
): Promise<void> {
    let i = 0
    return new Promise<void>(resolve => {
        // if (!element) return
        const intervalId = setInterval(() => {
            if (i < text.length) {
                // If the character is a newline character, append a <br> element; otherwise, append the character.
                if (text.charAt(i) === "\n") {
                    element.innerHTML += "<br>"
                } else {
                    element.innerHTML += text.charAt(i)
                }
                i++
            } else {
                clearInterval(intervalId)
                resolve()
            }
        }, speed)
    })
}

/**
 * Adjusts the scroll position of the root container if the newly appended div is within
 * a certain distance from the lower edge of the root container.
 * @param {HTMLDivElement} div - The newly created and appended div element.
 * @param {HTMLElement} root - The root container element.
 */
function adjustScrollPosition(div: HTMLDivElement, root: HTMLElement): void {
    // Define the distance from the bottom of the root container at which scrolling should start.
    const scrollThreshold = 200 // px

    // Get the bottom offset of the div relative to the root container
    const offsetBottom =
        div.getBoundingClientRect().bottom - root.getBoundingClientRect().bottom

    // Check if the div is within the threshold distance from the lower edge of the root container
    if (offsetBottom > -scrollThreshold) {
        // Adjust the scroll position of the root container to maintain the distance
        root.scrollTop += offsetBottom + scrollThreshold
    }
}