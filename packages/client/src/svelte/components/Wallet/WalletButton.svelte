<script lang="ts">
  import { createWeb3Modal } from "@web3modal/wagmi"
  import { network } from "../../modules/network"

  const projectId = "2454dce71dbc00562f6d51096866435b"

  $: console.log("$network.wagmiConfig", $network.wagmiConfig)

  const modal = createWeb3Modal({
    wagmiConfig: $network.wagmiConfig,
    projectId,
  })

  const openModal = async () => {
    modal.open()
  }
</script>

<div class="connect-button">
  <button on:click={openModal}>Connect Wallet</button>
</div>

<style lang="scss">
  .connect-button {
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 10px;
    background: red;
    z-index: 100000;
  }
</style>
