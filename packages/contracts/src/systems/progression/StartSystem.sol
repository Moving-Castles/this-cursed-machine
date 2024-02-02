// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CarriedBy, EntityType, MachinesInPod, FixedEntities, FixedEntitiesData, StorageInPod, MaterialType, Amount, Order, TutorialOrders, CurrentOrder, Tutorial } from "../../codegen/index.sol";
import { MACHINE_TYPE, MATERIAL_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibPod, LibEntity, LibStorage } from "../../libraries/Libraries.sol";

contract StartSystem is System {
  function start() public returns (bytes32) {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Create pod
    bytes32 podEntity = LibPod.create();

    // Create inlet entities
    bytes32[] memory inletEntities = new bytes32[](2);
    inletEntities[0] = LibEntity.create(MACHINE_TYPE.INLET);
    inletEntities[1] = LibEntity.create(MACHINE_TYPE.INLET);
    for (uint i; i < inletEntities.length; i++) {
      CarriedBy.set(inletEntities[i], podEntity);
      MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), inletEntities[i]));
    }

    // Place player in pod
    CarriedBy.set(playerEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), playerEntity));

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), outletEntity));

    // Create storage
    bytes32[] memory storageInPod = new bytes32[](3);
    storageInPod[0] = LibStorage.create(podEntity);
    storageInPod[1] = LibStorage.create(podEntity);
    storageInPod[2] = LibStorage.create(podEntity);
    StorageInPod.set(podEntity, storageInPod);

    // Create dispenser
    bytes32 dispenserEntity = LibStorage.create(podEntity);
    EntityType.set(dispenserEntity, ENTITY_TYPE.DISPENSER);

    // Save fixed entities
    FixedEntities.set(
      podEntity,
      FixedEntitiesData({ dispenser: dispenserEntity, outlet: outletEntity, inlets: inletEntities })
    );

    // Go to first tutorial level
    bytes32 nextTutorialLevel = TutorialOrders.get()[0];
    TutorialLevel.set(playerEntity, 0);
    Tutorial.set(playerEntity, true);
    CurrentOrder.set(podEntity, nextTutorialLevel);

    // Fill dispenser, based on the config of the first tutorial level
    MaterialType.set(dispenserEntity, Order.get(nextTutorialLevel).resourceMaterialType);
    Amount.set(dispenserEntity, Order.get(nextTutorialLevel).resourceAmount);

    return podEntity;
  }
}
