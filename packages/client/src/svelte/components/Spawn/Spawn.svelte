<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import {
    COMMAND,
    TERMINAL_OUTPUT_TYPE,
    TERMINAL_TYPE,
  } from "@components/Main/Terminal/enums"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { SYMBOLS } from "@components/Main/Terminal"
  import { typeWriteToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
  import { narrative } from "@components/Spawn/narrative"
  import { player, playerAddress } from "@modules/state/base/stores"
  import { ENVIRONMENT } from "@mud/enums"
  import { initSignalNetwork } from "@modules/signal"
  import { walletNetwork, publicNetwork } from "@modules/network"
  import { setupBurnerWalletNetwork } from "@mud/setupBurnerWalletNetwork"
  import { setupWalletNetwork } from "@mud/setupWalletNetwork"
  import { store as accountKitStore } from "@latticexyz/account-kit/bundle"

  export let environment: ENVIRONMENT

  const dispatch = createEventDispatcher()

  import Terminal from "@components/Main/Terminal/Terminal.svelte"

  let terminalComponent: any
  let narrativeIndex = 0

  const handleCommand = async (e: any) => {
    if (e.detail.command.id === COMMAND.SKIP) {
      dispatch("done")
    }
    if (e.detail.command.id === COMMAND.BLINK) {
      // Move the story forward
      narrativeIndex++
      // Write the next part of the story to the terminal
      if (narrativeIndex < narrative.length) {
        await narrative[narrativeIndex](environment)
      }
      // End of narrative reached
      if (narrativeIndex === narrative.length - 1) {
        dispatch("done")
      }
    }

    if (terminalComponent) {
      terminalComponent.resetInput()
    }
  }

  onMount(async () => {
    /*
     * Check if the user is already connected
     */
    if ([ENVIRONMENT.DEVELOPMENT, ENVIRONMENT.GARNET].includes(environment)) {
      /*
       * Burner environments
       * We set up the burner wallet already here
       * Either using a cached private key or generating a new one
       */
      walletNetwork.set(setupBurnerWalletNetwork($publicNetwork))
      playerAddress.set($walletNetwork.walletClient?.account.address)
    } else {
      /*
       * Account Kit environments
       * We get the account kit store state
       * If appAccountClient and userAddress are set the user is connected
       * We set up the wallet network using the appAccountClient
       * and set playerAddress to the user address
       */
      const accountKitStoreState = accountKitStore.getState()
      console.log("accountKitStoreState", accountKitStoreState)

      if (
        accountKitStoreState.appAccountClient &&
        accountKitStoreState.userAddress
      ) {
        walletNetwork.set(
          setupWalletNetwork(
            $publicNetwork,
            accountKitStoreState.appAccountClient,
          ),
        )
        // Set player address to main wallet address
        playerAddress.set(accountKitStoreState.userAddress)
      }
    }

    /*
     * If playerAddress was set above
     * and a corresponing entity has the carriedBy component set
     * the player is spawned in the world
     */
    if ($player?.carriedBy) {
      // Websocket connection for off-chain messaging
      initSignalNetwork()

      await typeWriteToTerminal(
        TERMINAL_OUTPUT_TYPE.NORMAL,
        "Welcome back...",
        SYMBOLS[7],
        10,
        1000,
      )
      dispatch("done")
    } else {
      await narrative[0](environment)
      if (terminalComponent) {
        terminalComponent.resetInput()
      }
      // Reset tutorial
      tutorialProgress.set(0)
    }
  })
</script>

<div class="spawn">
  <Terminal
    bind:this={terminalComponent}
    terminalType={TERMINAL_TYPE.SPAWN}
    placeholder="BLINK"
    setBlink
    on:commandExecuted={e => handleCommand(e)}
  />
</div>

<style>
  .spawn {
    position: fixed;
    inset: 0;
    background-color: var(--background);
    background-size: cover;
    background-position: center;
    z-index: var(--z-1);
    display: flex;
    align-items: center;
    justify-items: center;
    user-select: none;
    cursor: pointer;
  }

  :global(p.normal) {
    margin-bottom: 1rem;
  }
</style>
