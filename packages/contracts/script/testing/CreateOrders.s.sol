// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { LibOrder, PublicMaterials } from "../../src/libraries/Libraries.sol";
import { ONE_MINUTE, ONE_DAY, ONE_HOUR } from "../../src/constants.sol";

contract CreateOrder is Script {
  function run(address worldAddress) external {
    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    bytes32 admin = bytes32(0);

    // 80 LUBRICANT => 160 points
    LibOrder.create(admin, "", PublicMaterials.LUBRICANT, 8000, false, 0, 160, 0, 0);

    // 130 WATER => 210 points
    LibOrder.create(admin, "", PublicMaterials.WATER, 13000, false, 0, 210, 0, 0);

    // 50 AMPHETAMINE => 500 points
    LibOrder.create(admin, "", PublicMaterials.AMPHETAMINE, 5000, false, 0, 500, 0, 0);

    // 90 FAT => 140 points
    LibOrder.create(admin, "", PublicMaterials.FAT, 9000, false, 0, 140, 0, 0);

    // 50 ORGANIC_WASTE => 100 points
    LibOrder.create(admin, "", PublicMaterials.ORGANIC_WASTE, 5000, false, 0, 100, 0, 0);

    // 80 BLOOD_CLOT  => 300 points
    LibOrder.create(admin, "", PublicMaterials.BLOOD_CLOT, 8000, false, 0, 300, 0, 0);

    // 50 HEMATURIC => 200 points
    LibOrder.create(admin, "", PublicMaterials.HEMATURIC, 5000, false, 0, 200, 0, 0);

    // 70 FERTILIZER => 120 points
    LibOrder.create(admin, "", PublicMaterials.FERTILIZER, 7000, false, 0, 120, 0, 0);

    // 50 PISS => 120 points
    LibOrder.create(admin, "", PublicMaterials.PISS, 5000, false, 0, 120, 0, 0);

    // 90 LUBRICANT => 240 points
    LibOrder.create(admin, "", PublicMaterials.LUBRICANT, 9000, false, 0, 240, 0, 0);

    vm.stopBroadcast();
  }
}
