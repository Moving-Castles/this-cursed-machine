<script lang="ts">
  import { padWithZero, parseISODateTime, formatDate } from "@modules/utils"
  export let endTime: Date | string

  endTime = formatDate(endTime)

  // This is the offset for CEST in minutes
  const CEST_OFFSET = 0

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }

  const calculateTimeLeft = () => {
    const now = new Date()
    const targetTimeInUTC = parseISODateTime(endTime).getTime()
    const targetDate = new Date(targetTimeInUTC)

    const diff = targetDate - now

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: padWithZero(Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: padWithZero(Math.floor((diff / (1000 * 60)) % 60)),
      seconds: padWithZero(Math.floor((diff / 1000) % 60)),
    }
  }

  // Update the countdown every second
  const interval = setInterval(() => {
    timeLeft = calculateTimeLeft()

    if (
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      clearInterval(interval)
    }
  }, 1000)
</script>

{#if timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0}
  <!-- Started -->
{:else}
  <div class="success">
    <!-- {#if timeLeft.days > 0}
      {timeLeft.days}
      {timeLeft.days > 1 ? "days" : "day"} and
      <br />{/if} -->
    new TCM orders in {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
  </div>
{/if}

<style>
  .success {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    color: var(--color-success);
  }
</style>
