<script lang="ts">
  import { walletNetwork, publicNetwork } from "@modules/network"
  import { store as accountKitStore } from "@latticexyz/account-kit/bundle"
  import type { AccountKitConnectReturn } from "@components/Spawn/account-kit-connect/types"

  let balance = BigInt(0)

  const openAccountModalPromise = new Promise<() => void>(resolve => {
    const { openAccountModal } = accountKitStore.getState()
    if (openAccountModal) return resolve(openAccountModal)
    const unsub = accountKitStore.subscribe(state => {
      if (state.openAccountModal) {
        unsub()
        resolve(state.openAccountModal)
      }
    })
  })

  export const connect = () =>
    openAccountModalPromise.then(openAccountModal => {
      openAccountModal()
      return new Promise<AccountKitConnectReturn>((resolve, reject) => {
        const unsub = accountKitStore.subscribe(state => {
          // if (state.appAccountClient) {
          //   unsub()
          //   // Close the modal and resolve with appAccountClient
          //   state.closeAccountModal ? state.closeAccountModal() : null
          //   resolve({
          //     appAccountClient: state.appAccountClient,
          //     userAddress: state.userAddress,
          //   })
          // }
          if (state.accountModalOpen === false) {
            unsub()
            reject(new Error("Account modal closed before connecting."))
          }
        })
      })
    })

  const triggerConnect = async () => {
    console.log("trigger connect")
    connect()
  }

  const getBalance = async () => {
    if (!$walletNetwork?.walletClient?.account?.address) return BigInt(0)
    if (!$publicNetwork?.publicClient?.getBalance) return BigInt(0)

    console.log("$publicNetwork", $publicNetwork)

    const b = await $publicNetwork.publicClient.getBalance({
      address: $walletNetwork.walletClient.account.address,
    })

    console.log("b", b)

    return b
  }

  const setBalance = async () => {
    balance = await getBalance()
  }
</script>

<div class="account-kit-balance">
  <span>
    {balance}
    <button on:click={setBalance}>Balance</button>
    <button on:click={triggerConnect}>Top up</button>
  </span>
</div>

<style lang="scss">
  .account-kit-balance {
    font-size: var(--font-size-small);

    button {
      font-size: var(--font-size-small);
      font-family: var(--font-family);
    }
  }
</style>
