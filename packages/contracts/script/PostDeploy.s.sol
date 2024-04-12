// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { IERC20Mintable } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20Mintable.sol";
import { registerERC20 } from "@latticexyz/world-modules/src/modules/erc20-puppet/registerERC20.sol";
import { ERC20MetadataData } from "@latticexyz/world-modules/src/modules/erc20-puppet/tables/ERC20Metadata.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import { ROOT_NAMESPACE_ID } from "@latticexyz/world/src/constants.sol";
import { NamespaceOwner } from "@latticexyz/world/src/codegen/tables/NamespaceOwner.sol";
import { ResourceId, WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";

import { MATERIAL_TYPE } from "../src/codegen/common.sol";
import { LibOrder, LibInitRecipes, LibInit, LibOffer } from "../src/libraries/Libraries.sol";
import { ONE_MINUTE, ONE_DAY, ONE_HOUR } from "../src/constants.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    IWorld world = IWorld(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    // Register and mint ERC20 token
    IERC20Mintable token = registerERC20(
      world,
      "BugToken",
      ERC20MetadataData({ decimals: 18, name: "BUG", symbol: "BUG" })
    );

    // Transfer ownership of the token namespace to the world contract
    ResourceId namespaceId = WorldResourceIdLib.encodeNamespace("BugToken");
    world.transferOwnership(namespaceId, worldAddress);

    // Initialize gameConfig and tutorial levels
    // Root namespace owner is admin
    LibInit.init(NamespaceOwner.get(ROOT_NAMESPACE_ID), address(token));

    // Initialize recipes
    LibInitRecipes.init();

    // Create offer
    LibOffer.create(MATERIAL_TYPE.BUG, 10000, 100); // 1:1 ratio : 100 $BUG => 10000 Bug (Shown as 100 Bugs with scale-down in UI)

    vm.stopBroadcast();
  }
}
