<script>
  import "leader-line"
  import { showFlowChart } from "../../modules/ui/stores"
  import { ports } from "../../modules/state"
  import { PortPlacement } from "../../modules/state/enums"
  import { onMount, onDestroy, tick } from "svelte"

  const mappings = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left",
  }

  export let connection
  const defaults = {
    color: "var(--terminal-color)",
    size: 1,
    path: "grid",
    endPlugSize: 2,
    startSocket:
      mappings[PortPlacement[$ports[connection.sourcePort].portPlacement]],
    endSocket:
      mappings[PortPlacement[$ports[connection.targetPort].portPlacement]],
  }
  export let options = {}

  $: finalOptions = { ...defaults, ...options }

  let start
  let end
  let line

  const destroy = () => {
    if (line) {
      console.log(line.remove)
      line.remove()
    }
  }

  const init = async () => {
    await tick()
    start = document.querySelector(`.port-${connection.sourcePort}`)
    end = document.querySelector(`.port-${connection.targetPort}`)
    if (start && end && !line) {
      line = new LeaderLine(start, end, finalOptions)
    }
  }

  $: if ($showFlowChart) init()
  $: options, init()
  $: if (!$showFlowChart) destroy()

  onMount(init)
  onDestroy(destroy)
</script>
