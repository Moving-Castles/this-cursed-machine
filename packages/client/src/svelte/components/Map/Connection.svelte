<script>
  import "leader-line"
  import { onMount, onDestroy, tick } from "svelte"

  export let connection
  export let options = {
    color: "black",
    size: 1,
    path: "magnet",
    endPlugSize: 2,
  }

  let start
  let end
  let line

  onMount(async () => {
    await tick()
    start = document.querySelector(`.port-${connection.sourcePort}`)
    end = document.querySelector(`.port-${connection.targetPort}`)
    if (start && end) {
      line = new LeaderLine(start, end, options)
      console.log(line)
    }
  })

  const destroy = () => {
    if (line) {
      line.remove()
    }
  }

  onDestroy(destroy)
</script>
