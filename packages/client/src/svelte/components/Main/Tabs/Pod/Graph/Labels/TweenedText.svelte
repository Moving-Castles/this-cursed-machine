<script lang="ts">
  import { tweened } from "svelte/motion"
  import { derived } from "svelte/store"
  import { bounceIn } from "svelte/easing"

  export let mouseover = false

  export let words = []
  export let duration = 100 // default duration for each tween
  export let delay = 4000 // default delay between tweens

  let timeout: ReturnType<typeof setTimeout>
  let isAnimating = false

  const maxLength = Math.max(...words.map(w => w.length))
  const normalizedWords = words.map(w => w.padEnd(maxLength, " "))

  const progress = tweened(0, { duration, easing: bounceIn })

  let currentWordIndex = 0

  const init = () => {
    if (isAnimating) return
    isAnimating = true

    // Automatically start the animation when the component mounts
    progress.set(1)

    progress.subscribe($progress => {
      if ($progress === 1) {
        currentWordIndex = (currentWordIndex + 1) % normalizedWords.length
        progress.set(0) // Reset progress for the next tween
        timeout = setTimeout(() => progress.set(1), delay) // Start the next tween after a delay
      }
    })
  }

  init()

  const interpolatedWord = derived(progress, $progress => {
    const startWord = normalizedWords[currentWordIndex]
    const endWord =
      normalizedWords[(currentWordIndex + 1) % normalizedWords.length]
    return startWord
      .split("")
      .map((char, index) => {
        if (char === " " && endWord[index] === " ") return " "
        const startCharCode = char.charCodeAt(0)
        const endCharCode = endWord[index].charCodeAt(0)
        const interpolatedCharCode = Math.round(
          startCharCode + $progress * (endCharCode - startCharCode)
        )
        return String.fromCharCode(interpolatedCharCode)
      })
      .join("")
  })
</script>

<!-- This will render the current interpolated word -->
{$interpolatedWord}
