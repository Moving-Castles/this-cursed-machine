import type { AppAccountClient } from "@latticexyz/account-kit/src/common";

export type AccountKitConnectReturn = {
    appAccountClient: AppAccountClient
    userAddress: string
}