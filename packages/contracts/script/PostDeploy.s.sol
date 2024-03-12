// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

import { StandardDelegationsModule } from "@latticexyz/world-modules/src/modules/std-delegations/StandardDelegationsModule.sol";
import { PuppetModule } from "@latticexyz/world-modules/src/modules/puppet/PuppetModule.sol";
import { IERC20Mintable } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20Mintable.sol";
import { registerERC20 } from "@latticexyz/world-modules/src/modules/erc20-puppet/registerERC20.sol";
import { ERC20MetadataData } from "@latticexyz/world-modules/src/modules/erc20-puppet/tables/ERC20Metadata.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import { MATERIAL_TYPE } from "../src/codegen/common.sol";
import { LibOrder, LibInitRecipes, LibInit } from "../src/libraries/Libraries.sol";
import { ONE_MINUTE, ONE_DAY, ONE_HOUR } from "../src/constants.sol";

uint256 constant POOL_SUPPLY = 1_000_000 wei;

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    // console.log("Deployed world: ", worldAddress);
    IWorld world = IWorld(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    // Register and mint ERC20 token
    world.installRootModule(new StandardDelegationsModule(), new bytes(0));
    world.installModule(new PuppetModule(), new bytes(0));

    IERC20Mintable token = registerERC20(
      world,
      "Token",
      ERC20MetadataData({ decimals: 18, name: "TCM", symbol: "TCM" })
    );

    token.mint(worldAddress, POOL_SUPPLY);

    // Initialize gameConfig and tutorial levels
    LibInit.init(address(token));

    // Initialize recipes
    LibInitRecipes.init();

    // Create test orders
    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BUG, 1000, false, 1000, ONE_MINUTE, 10);
    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD_MEAL, 10000, false, 1000, ONE_HOUR, 10);
    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.AMMONIA, 10000, false, 1000, ONE_DAY, 10);

    vm.stopBroadcast();
  }
}
