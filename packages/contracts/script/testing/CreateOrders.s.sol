// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { LibOrder, PublicMaterials } from "../../src/libraries/Libraries.sol";
import { ONE_MINUTE, ONE_DAY, ONE_HOUR, ONE_UNIT } from "../../src/constants.sol";

contract CreateOrder is Script {
  function run(address worldAddress) external {
    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    address admin = address(0);

    // 80 INDUSTRIAL_LUBRICANT => 160 points
    LibOrder.create(admin, PublicMaterials.INDUSTRIAL_LUBRICANT, 80 * ONE_UNIT, false, 0, 160 * ONE_UNIT, 0, 0);

    // 130 EVIAN => 210 points
    LibOrder.create(admin, PublicMaterials.EVIAN, 130 * ONE_UNIT, false, 0, 210 * ONE_UNIT, 0, 0);

    // 50 LOW_GRADE_AMPHETAMINE => 500 points
    LibOrder.create(admin, PublicMaterials.LOW_GRADE_AMPHETAMINE, 50 * ONE_UNIT, false, 0, 500 * ONE_UNIT, 0, 0);

    // 90 CONGEALED_FAT => 140 points
    LibOrder.create(admin, PublicMaterials.CONGEALED_FAT, 90 * ONE_UNIT, false, 0, 140 * ONE_UNIT, 0, 0);

    // 50 ORGANIC_WASTE => 100 points
    LibOrder.create(admin, PublicMaterials.ORGANIC_WASTE, 50 * ONE_UNIT, false, 0, 100 * ONE_UNIT, 0, 0);

    // 80 BLOOD_CLOT  => 300 points
    LibOrder.create(admin, PublicMaterials.BLOOD_CLOT, 80 * ONE_UNIT, false, 0, 300 * ONE_UNIT, 0, 0);

    // 50 HEMATURIC_FLUID => 200 points
    LibOrder.create(admin, PublicMaterials.HEMATURIC_FLUID, 50 * ONE_UNIT, false, 0, 200 * ONE_UNIT, 0, 0);

    // 70 FERTILIZER => 120 points
    LibOrder.create(admin, PublicMaterials.FERTILIZER, 70 * ONE_UNIT, false, 0, 120 * ONE_UNIT, 0, 0);

    // 50 PISS => 120 points
    LibOrder.create(admin, PublicMaterials.PISS, 50 * ONE_UNIT, false, 0, 120 * ONE_UNIT, 0, 0);

    // 90 INDUSTRIAL_LUBRICANT => 240 points
    LibOrder.create(admin, PublicMaterials.INDUSTRIAL_LUBRICANT, 90 * ONE_UNIT, false, 0, 240 * ONE_UNIT, 0, 0);

    vm.stopBroadcast();
  }
}
