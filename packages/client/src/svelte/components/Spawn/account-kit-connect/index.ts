import { store as accountKitStore } from "@latticexyz/account-kit/bundle";
import type { AccountKitConnectReturn } from "./types";

const openAccountModalPromise = new Promise<() => void>((resolve) => {
    const { openAccountModal } = accountKitStore.getState();
    if (openAccountModal) return resolve(openAccountModal);
    const unsub = accountKitStore.subscribe((state) => {
        if (state.openAccountModal) {
            unsub();
            resolve(state.openAccountModal);
        }
    });
});

export const connect = () =>
    openAccountModalPromise.then((openAccountModal) => {
        openAccountModal();
        return new Promise<AccountKitConnectReturn>((resolve, reject) => {
            const unsub = accountKitStore.subscribe((state) => {
                if (state.appAccountClient) {
                    unsub();
                    // Close the modal and resolve with appAccountClient
                    state.closeAccountModal ? state.closeAccountModal() : null;
                    resolve({ appAccountClient: state.appAccountClient, userAddress: state.userAddress });
                }
                if (state.accountModalOpen === false) {
                    unsub();
                    reject(new Error("Account modal closed before connecting."));
                }
            });
        });
    });