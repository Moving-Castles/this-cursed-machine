<script>
  import { onMount } from "svelte"

  let countdown = ""

  function getTimeRemaining() {
    const cetTimeZone = "Europe/Berlin"
    const now = new Date().toLocaleString("en-US", { timeZone: cetTimeZone })
    const nowCET = new Date(now)
    const targetCET = new Date(now)

    targetCET.setHours(16, 0, 0, 0) // Set target CET time to 16:00

    const difference = targetCET - nowCET

    if (difference < 0) {
      // If the difference is negative, it means the target time has passed today in CET
      // so we set the target for the same time on the next day
      targetCET.setDate(targetCET.getDate() + 1)
      return targetCET - nowCET
    }
    return difference
  }

  function formatTime(difference) {
    const seconds = Math.floor((difference / 1000) % 60)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const hours = Math.floor(difference / (1000 * 60 * 60))
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  function initializeClock() {
    const updateClock = () => {
      const total = getTimeRemaining()
      countdown = formatTime(total)

      if (total <= 0) {
        clearInterval(timeinterval)
        countdown = "00:00:00"
      }
    }

    updateClock() // Run function once at first to avoid delay
    const timeinterval = setInterval(updateClock, 1000)
  }

  onMount(() => {
    initializeClock()
  })
</script>

<div class="success">
  <!-- {#if timeLeft.days > 0}
    {timeLeft.days}
    {timeLeft.days > 1 ? "days" : "day"} and
    <br />{/if} -->
  new TCM orders in {countdown}
</div>

<style>
  .success {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    color: var(--color-success);
  }
</style>
