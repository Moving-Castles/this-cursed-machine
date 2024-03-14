// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import { MATERIAL_TYPE } from "../src/codegen/common.sol";
import { LibOrder } from "../src/libraries/Libraries.sol";
import { ONE_MINUTE, ONE_DAY, ONE_HOUR } from "../src/constants.sol";

contract CreateOrder is Script {
  function run() external {
    address worldAddress = 0xBeB0E280b9A2E7e0315186DED65a5D1FF71e7F21;

    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    // console.log("Deployed world: ", worldAddress);
    // IWorld world = IWorld(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.PISS, 50000, false, 6969, ONE_HOUR, 10);

    vm.stopBroadcast();
  }
}
