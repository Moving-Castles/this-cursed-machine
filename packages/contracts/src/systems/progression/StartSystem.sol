// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CarriedBy, EntityType, MachinesInPod, FixedEntities, FixedEntitiesData, DepotsInPod, MaterialType, Amount, Tutorial, BuildIndex, BuildTracker, DepotConnection, NonTransferableBalance } from "../../codegen/index.sol";
import { MACHINE_TYPE, MATERIAL_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibPod, LibEntity, LibDepot, LibToken } from "../../libraries/Libraries.sol";
import { NUMBER_OF_DEPOTS } from "../../constants.sol";

contract StartSystem is System {
  /**
   * @notice Set up a pod for the player
   * @return podEntity Id of pod entity
   */
  function start() public returns (bytes32 podEntity) {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // todo: check that player is spawned

    // Create pod
    podEntity = LibPod.create();

    // Create inlet entities
    bytes32[] memory inletEntities = new bytes32[](2);
    inletEntities[0] = LibEntity.create(MACHINE_TYPE.INLET);
    inletEntities[1] = LibEntity.create(MACHINE_TYPE.INLET);
    for (uint32 i; i < inletEntities.length; i++) {
      BuildIndex.set(inletEntities[i], i + 1);
      CarriedBy.set(inletEntities[i], podEntity);
      MachinesInPod.push(podEntity, inletEntities[i]);
      DepotConnection.set(inletEntities[i], bytes32(0));
    }

    // Place player in pod
    CarriedBy.set(playerEntity, podEntity);
    MachinesInPod.push(podEntity, playerEntity);

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, podEntity);
    MachinesInPod.push(podEntity, outletEntity);
    DepotConnection.set(outletEntity, bytes32(0));
    BuildIndex.set(outletEntity, 1);

    // Create depots
    bytes32[] memory depotsInPod = new bytes32[](NUMBER_OF_DEPOTS);

    // Store IDs of depots in the pod
    for (uint32 i; i < depotsInPod.length; i++) {
      depotsInPod[i] = LibDepot.create(podEntity, i);
    }
    DepotsInPod.set(podEntity, depotsInPod);

    // Save fixed entities
    FixedEntities.set(podEntity, FixedEntitiesData({ outlet: outletEntity, inlets: inletEntities }));

    // Set build tracker to an array with the length of the number of machine types
    // This is used to have a build index per machine type and pod to identify a particular machine in the UI
    BuildTracker.set(podEntity, new uint32[](uint(type(MACHINE_TYPE).max) + 1));

    // Go to first tutorial level
    TutorialLevel.set(playerEntity, 0);
    Tutorial.set(playerEntity, true);

    // Fill first depot, based on the config of the first tutorial level
    MaterialType.set(depotsInPod[0], MATERIAL_TYPE.BUG);
    Amount.set(depotsInPod[0], 10000);

    // We give the player some non-transferable tokens to start with
    NonTransferableBalance.set(playerEntity, 500);

    return podEntity;
  }
}
