<script lang="ts">
  import { fly } from "svelte/transition"
  import { name } from "@modules/action"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"

  import Spinner from "../../Atoms/Spinner.svelte"

  let working = false
  let modalActive = false
  let userName = ""

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") sendName()
  }

  function isValidName(name: string): boolean {
    // Check for minimume length of 4
    const hasMinLength = name.length >= 4
    // Check for maximum length of 24
    const isLengthValid = name.length <= 24

    return hasMinLength && isLengthValid
  }

  function toggleModal() {
    modalActive = !modalActive
  }

  async function sendName() {
    if (!isValidName(userName)) return
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

<svelte:window on:keydown|stopPropagation={onKeyDown} />

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
  <form
    on:submit|stopPropagation|preventDefault={sendName}
    class="certificate-modal"
    class:working
    in:fly
  >
    <div class="inner-container">
      <div class="close">
        <button on:click={toggleModal}>X</button>
      </div>

      <div class="text">
        Congratualtions: Your IQ (72) is sufficent for operating the POD
        machinery. No serious brain damage detected.
      </div>

      <div class="form">
        {#if working}
          <div class="spinner"><Spinner /></div>
        {:else}
          <input type="text" bind:value={userName} placeholder="Enter name" />
          <input type="submit" on:click={sendName} value="Sign" />
        {/if}
      </div>
    </div>
  </form>
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
        }
      }
    }
  }

  .certificate-modal {
    position: absolute;
    background: var(--background);
    color: var(--foreground);
    border: 5px double var(--foreground);
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    // height: 60%;
    width: 60%;

    &.working {
      pointer-events: none;
    }

    .inner-container {
      width: 100%;
      height: 100%;
      position: relative;
      padding: 40px;

      .close {
        position: absolute;
        top: 0;
        right: 0;

        button {
          background: var(--color-grey-dark);
          color: var(--foreground);
          padding: 7px;
          border: none;
          cursor: pointer;
          font-size: var(--font-size-small);
          font-family: var(--font-family);

          &:hover {
            background: var(--foreground);
            color: var(--background);
          }
        }
      }

      .text {
        margin-bottom: 60px;
      }

      .form {
        display: flex;

        input {
          width: 100%;
          margin-right: 20px;
          height: 36px;
          padding-inline: 10px;
          margin-bottom: 20px;
          font-family: var(--font-family);
          background: transparent;
          border: none;
          border-bottom: 3px dotted var(--foreground);
          padding: 0;
          color: var(--foreground);
          outline: none;
        }

        button {
          padding-inline: 20px;
          height: 36px;
          background: var(--color-success);
          border: 0;
          font-family: var(--font-family);

          &:hover {
            background: var(--foreground);
            color: var(--background);
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
