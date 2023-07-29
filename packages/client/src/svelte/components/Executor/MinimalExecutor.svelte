<script lang="ts">
  import gsap from "gsap"
  import {
    activeActions,
    queuedActions,
    completedActions,
    failedActions,
  } from "../../modules/action/actionSequencer"
  import { playSound } from "../../modules/sound"

  let queueElement: HTMLElement
  let activeElement: HTMLElement
  let doneElement: HTMLElement

  let localQueuedActionsCount = 0
  let localActiveActionsCount = 0
  let localCompletedActionsCount = 0
  let localFailedActionsCount = 0

  const CONNECTOR_TIME = 0.1
  const NODE_TIME = 0.4

  function animateAction(nodeEl: HTMLElement, nodeColor: string) {
    const tl = gsap.timeline()
    tl.to(nodeEl, { duration: 0, backgroundColor: nodeColor })
    tl.to(nodeEl, { duration: NODE_TIME, backgroundColor: "#808080" })
  }

  function animateQueuedAction() {
    animateAction(queueElement, "orange")
  }

  function animateActiveAction() {
    animateAction(activeElement, "orange")
  }

  function animateCompletedAction() {
    animateAction(doneElement, "green")
  }

  function animateFailedAction() {
    animateAction(doneElement, "red")
  }

  queuedActions.subscribe(actions => {
    if (actions.length > localQueuedActionsCount) animateQueuedAction()
    setTimeout(() => {
      localQueuedActionsCount = actions.length
    }, CONNECTOR_TIME * 1000)
  })

  activeActions.subscribe(actions => {
    if (actions.length > localActiveActionsCount) animateActiveAction()
    setTimeout(() => {
      localActiveActionsCount = actions.length
    }, CONNECTOR_TIME * 1000)
  })

  completedActions.subscribe(actions => {
    if (actions.length > localCompletedActionsCount) animateCompletedAction()
    setTimeout(() => {
      if (actions.length === 0) return
      playSound("tekken", "yes")
      localCompletedActionsCount = actions.length
    }, CONNECTOR_TIME * 1000)
  })

  failedActions.subscribe(actions => {
    if (actions.length > localFailedActionsCount) animateFailedAction()
    setTimeout(() => {
      localFailedActionsCount = actions.length
    }, CONNECTOR_TIME * 1000)
  })
</script>

<div class="executor">
  <div class="node queue" bind:this={queueElement}>
    <div>{localQueuedActionsCount}</div>
  </div>
  <div class="node active" bind:this={activeElement}>
    <div>{localActiveActionsCount}</div>
  </div>
  <div class="node done" bind:this={doneElement}>
    <div>
      {localCompletedActionsCount}/{localFailedActionsCount}
    </div>
  </div>
</div>

<style lang="scss">
  progress {
    height: 25px;
  }

  .executor {
    position: fixed;
    bottom: 0;
    left: 0;
    overflow: hidden;
    height: auto;
    height: 30px;
    display: flex;
    flex-direction: row;
    background: black;
    z-index: 10000;
    opacity: 1;

    .node {
      height: 30px;
      width: 30px;
      background: #808080;
      font-size: 8px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.queue {
        &.focus {
          background: yellow;
          color: black;
        }
      }

      &.active {
        &.focus {
          background: orangered;
          color: black;
        }
      }

      &.active {
        &.focus {
          background: green;
        }
      }
    }
  }
</style>
