<script lang="ts">
  //   import { player } from "@modules/state/base/stores"
  import { fly } from "svelte/transition"
  //   import { playSound } from "@modules/sound"
  import { name } from "@modules/action"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"

  let working = false
  let modalActive = false
  let userName = "MEATBALL"

  // function isValidName(name: string): boolean {
  //   // Regex to check for at least one numeral
  //   const hasNumeral = /\d/.test(name)
  //   // Regex to check for any character that is not a letter
  //   const hasSpecialChar = /[^A-Za-z]/.test(name)
  //   // Check for maximum length of 24
  //   const isLengthValid = name.length <= 24

  //   return hasNumeral && hasSpecialChar && isLengthValid
  // }

  // const handleCommand = async (e: any) => {
  //   if (e.detail?.userInput && isValidName(e.detail.userInput)) {
  //     await narrative[1](e.detail.userInput)
  //     dispatch("named")
  //     return
  //   }

  // await writeNarrative("congratulations on completing the on-boarding.")
  //       await writeNarrative('You are a now a full time (168 hour week) employee of TCM.')
  //       await writeNarrative('You are allowed to assign yourself a human readable ID (name).')
  //       await writeNarrativeAction("Enter your name (Must include at least one numeral and one special character).")
  //   },
  //   async (str: string) => {
  //       await writeNarrativeInfo("Permanently erasing old identity...")
  //       await writeNarrativeError("WARNING: THIS CAN NOT BE UNDONE")
  //       await writeNarrativeInfo("Assigning new name...")
  //       const action = name(str)
  //       await waitForTransaction(action, loadingSpinner);
  //       await waitForCompletion(action, loadingLine);
  //       playSound("tcm", "TRX_yes")
  //       await writeNarrativeSuccess("Name assigned")
  //   },

  function toggleModal() {
    modalActive = !modalActive
  }

  async function sendName() {
    try {
      working = true
      const action = name(userName)
      await waitForCompletion(action)
      working = false
      modalActive = false
    } catch (e) {
      console.error(e)
      working = false
      modalActive = false
    }
  }
</script>

<div class="shop-item">
  <div class="section material">
    <div>CERTIFICATE</div>
  </div>

  <div class="section icon">
    <img src="/images/spider.png" alt="icon" />
  </div>

  <div class="section buy">
    <button class:pulse={$tutorialProgress === 26} on:click={toggleModal}
      >FREE</button
    >
  </div>
</div>

{#if modalActive}
  <div class="certificate-modal" class:working in:fly>
    <div>
      Congratualtions: Your IQ (72) is sufficent for operating the POD
      machinery. No serious brain damage detected.
    </div>
    <input
      type="text"
      bind:value={userName}
      placeholder="Enter human readable ID (name)"
    />
    <button on:click={sendName}>Sign</button>
    <button on:click={toggleModal}>X</button>
  </div>
{/if}

<style lang="scss">
  .shop-item {
    width: 300px;
    height: 300px;
    border: 1px solid var(--foreground);
    padding: 10px;
    padding-bottom: 30px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    margin-right: 20px;

    &.working {
      opacity: 0.5;
      pointer-events: none;
    }

    .section {
      user-select: none;
      width: 100%;

      &.material {
        border-bottom: 1px solid var(--foreground);
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
      }

      &.icon {
        height: 200px;
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 140px;
          aspect-ratio: 1;
          object-fit: cover;
        }
      }

      &.buy {
        height: 60px;
        border-top: 1px solid var(--foreground);
        display: flex;
        padding-top: 10px;

        button {
          width: 100%;
          height: 36px;
          background: var(--color-grey-mid);
          border: 0;
          font-family: var(--font-family);

          &:hover {
            background: var(--foreground);
            color: var(--background);
            cursor: pointer;
          }

          &.unafforable {
            background: red;
            pointer-events: none;
          }
        }
      }
    }
  }

  .certificate-modal {
    position: absolute;
    background: red;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding: 100px;

    &.working {
      opacity: 0.5;
      pointer-events: none;
    }
  }
</style>
