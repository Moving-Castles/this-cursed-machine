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
import { LibInit } from "../src/libraries/init/LibInit.sol";
import { LibInitRecipes } from "../src/libraries/init/LibInitRecipes.sol";

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

    // Initialize gameConfig, tutorial levels and goals
    LibInit.init(address(token));
    // Initialize recipes
    LibInitRecipes.init();

    vm.stopBroadcast();
  }
}
