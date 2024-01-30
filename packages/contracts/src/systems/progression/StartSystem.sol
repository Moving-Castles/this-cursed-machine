// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CarriedBy, EntityType, CreationBlock, MachinesInPod, OutletEntity, InletEntity, DispenserEntity, StorageInPod, MaterialType, Amount, ResourceEntity, TutorialOrders, CurrentOrder, Tutorial } from "../../codegen/index.sol";
import { MACHINE_TYPE, MATERIAL_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibPod, LibEntity, LibStorage } from "../../libraries/Libraries.sol";

contract StartSystem is System {
  function start() public returns (bytes32) {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Create pod
    bytes32 podEntity = LibPod.create();

    // Create dispenser
    bytes32 dispenserEntity = LibStorage.create(podEntity);
    EntityType.set(dispenserEntity, ENTITY_TYPE.DISPENSER);
    DispenserEntity.set(podEntity, dispenserEntity);

    // Give resource to dispenser, based on the config of the first tutorial level
    MaterialType.set(dispenserEntity, MaterialType.get(ResourceEntity.get(TutorialOrders.get()[0])));
    Amount.set(dispenserEntity, Amount.get(ResourceEntity.get(TutorialOrders.get()[0])));

    // Create storage
    bytes32[] memory storageInPod = new bytes32[](3);
    storageInPod[0] = LibStorage.create(podEntity);
    storageInPod[1] = LibStorage.create(podEntity);
    storageInPod[2] = LibStorage.create(podEntity);
    StorageInPod.set(podEntity, storageInPod);

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    CarriedBy.set(inletEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), inletEntity));
    // Save inlet entity
    InletEntity.set(podEntity, inletEntity);

    // Place player in pod
    CarriedBy.set(playerEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), playerEntity));

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), outletEntity));
    // Save outlet entity
    OutletEntity.set(podEntity, outletEntity);

    // Go to first tutorial level
    TutorialLevel.set(playerEntity, 0);
    Tutorial.set(playerEntity, true);
    CurrentOrder.set(podEntity, TutorialOrders.get()[0]);

    return podEntity;
  }
}
