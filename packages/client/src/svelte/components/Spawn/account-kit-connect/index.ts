import { store as accountKitStore } from "@latticexyz/account-kit/bundle";
import type { AppAccountClient } from "@latticexyz/account-kit/src/common";

// TODO: add some sort of timeout to keep this from spinning forever?
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
        return new Promise<AppAccountClient>((resolve, reject) => {
            const unsub = accountKitStore.subscribe((state) => {
                if (state.appAccountClient) {
                    unsub();
                    resolve(state.appAccountClient);
                }
                if (state.accountModalOpen === false) {
                    unsub();
                    reject(new Error("Account modal closed before connecting."));
                }
            });
        });
    });