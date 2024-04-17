// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { MATERIAL_TYPE } from "../../src/codegen/common.sol";
import { LibOrder } from "../../src/libraries/Libraries.sol";
import { ONE_MINUTE, ONE_DAY, ONE_HOUR } from "../../src/constants.sol";

contract CreateOrder is Script {
  function run(address worldAddress) external {
    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    bytes32 admin = bytes32(0);

    // 80 INDUSTRIAL_LUBRICANT => 160 points
    LibOrder.create(admin, "", MATERIAL_TYPE.INDUSTRIAL_LUBRICANT, 8000, false, 0, 160, 0, 0);

    // 130 EVIAN => 210 points
    LibOrder.create(admin, "", MATERIAL_TYPE.EVIAN, 13000, false, 0, 210, 0, 0);

    // 50 LOW_GRADE_AMPHETAMINE => 500 points
    LibOrder.create(admin, "", MATERIAL_TYPE.LOW_GRADE_AMPHETAMINE, 5000, false, 0, 500, 0, 0);

    // 90 CONGEALED_FAT => 140 points
    LibOrder.create(admin, "", MATERIAL_TYPE.CONGEALED_FAT, 9000, false, 0, 140, 0, 0);

    // 50 ORGANIC_WASTE => 100 points
    LibOrder.create(admin, "", MATERIAL_TYPE.ORGANIC_WASTE, 5000, false, 0, 100, 0, 0);

    // 80 BLOOD_CLOT  => 300 points
    LibOrder.create(admin, "", MATERIAL_TYPE.BLOOD_CLOT, 8000, false, 0, 300, 0, 0);

    // 50 HEMATURIC_FLUID => 200 points
    LibOrder.create(admin, "", MATERIAL_TYPE.HEMATURIC_FLUID, 5000, false, 0, 200, 0, 0);

    // 70 FERTILIZER => 120 points
    LibOrder.create(admin, "", MATERIAL_TYPE.FERTILIZER, 7000, false, 0, 120, 0, 0);

    // 50 PISS => 120 points
    LibOrder.create(admin, "", MATERIAL_TYPE.PISS, 5000, false, 0, 120, 0, 0);

    // 90 INDUSTRIAL_LUBRICANT => 240 points
    LibOrder.create(admin, "", MATERIAL_TYPE.INDUSTRIAL_LUBRICANT, 9000, false, 0, 240, 0, 0);

    vm.stopBroadcast();
  }
}
