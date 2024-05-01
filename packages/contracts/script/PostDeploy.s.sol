// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { IERC20Mintable } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20Mintable.sol";
import { registerERC20 } from "@latticexyz/world-modules/src/modules/erc20-puppet/registerERC20.sol";
import { ERC20MetadataData } from "@latticexyz/world-modules/src/modules/erc20-puppet/tables/ERC20Metadata.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import { StandardDelegationsModule } from "@latticexyz/world-modules/src/modules/std-delegations/StandardDelegationsModule.sol";
import { PuppetModule } from "@latticexyz/world-modules/src/modules/puppet/PuppetModule.sol";

import { ROOT_NAMESPACE_ID } from "@latticexyz/world/src/constants.sol";
import { NamespaceOwner } from "@latticexyz/world/src/codegen/tables/NamespaceOwner.sol";
import { ResourceId, WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";

import { LibOrder, LibInitRecipes, LibInit, LibOffer, LibMaterial, PublicMaterials, MaterialId, LibAddRecipe } from "../src/libraries/Libraries.sol";
import { ONE_MINUTE, ONE_DAY, ONE_HOUR, ONE_UNIT } from "../src/constants.sol";
import { MATERIAL_DIFFICULTY } from "../src/codegen/common.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    IWorld world = IWorld(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    // Install modules
    world.installRootModule(new StandardDelegationsModule(), new bytes(0));
    world.installModule(new PuppetModule(), new bytes(0));

    // Register public materials
    PublicMaterials.init();

    // Initialize gameConfig and tutorial levels
    // Root namespace owner is admin
    LibInit.init(NamespaceOwner.get(ROOT_NAMESPACE_ID));

    // Initialize recipes
    LibInitRecipes.init();

    // Create offer
    LibOffer.create(PublicMaterials.BUGS, 100 * ONE_UNIT, 100 * ONE_UNIT); // 100 $BUGS => 100 Bug in depot

    // YEAST : YEA : NOVICE
    LibMaterial.registerMaterial(MaterialId.wrap("t_YEA"), "YEAST", "YEA", MATERIAL_DIFFICULTY.NOVICE);
    // BACTERIA : BAC : NOVICE
    LibMaterial.registerMaterial(MaterialId.wrap("t_BAC"), "BACTERIA", "BAC", MATERIAL_DIFFICULTY.NOVICE);
    // PISS => YEAST, BACTERIA
    LibAddRecipe.centrifuge(PublicMaterials.PISS, [MaterialId.wrap("t_YEA"), MaterialId.wrap("t_BAC")]);

    vm.stopBroadcast();
  }
}
