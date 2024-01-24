// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, StorageConnection, InletEntity, OutletEntity } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibPod, LibEntity, LibStorage } from "../libraries/Libraries.sol";

// Connect      X
// Disconnect   X
// Clear        X
// Transfer
// Ship

contract StorageSystem is System {
  function connectStorage(bytes32 _storageEntity, MACHINE_TYPE _machineType) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_storageEntity) == podEntity, "not in pod");
    require(EntityType.get(_storageEntity) == ENTITY_TYPE.STORAGE, "not storage");
    require(StorageConnection.get(_storageEntity) == bytes32(0), "storage already connected");
    require(_machineType == MACHINE_TYPE.INLET || _machineType == MACHINE_TYPE.OUTLET, "not inlet/outlet");

    // Resolve network ?

    bytes32 targetEntity = _machineType == MACHINE_TYPE.INLET
      ? InletEntity.get(podEntity)
      : OutletEntity.get(podEntity);

    require(StorageConnection.get(targetEntity) == bytes32(0), "target already connected");

    // Connect on both sides
    StorageConnection.set(targetEntity, _storageEntity);
    StorageConnection.set(_storageEntity, targetEntity);
  }

  function disconnectStorage(MACHINE_TYPE _machineType) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(_machineType == MACHINE_TYPE.INLET || _machineType == MACHINE_TYPE.OUTLET, "not inlet/outlet");

    // Resolve network ?

    bytes32 targetEntity = _machineType == MACHINE_TYPE.INLET
      ? InletEntity.get(podEntity)
      : OutletEntity.get(podEntity);

    bytes32 _storageEntity = StorageConnection.get(targetEntity);

    // Disconnect on both sides
    StorageConnection.set(targetEntity, bytes32(0));
    StorageConnection.set(_storageEntity, bytes32(0));
  }

  function clearStorage(bytes32 _storageEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_storageEntity) == podEntity, "not in pod");
    require(EntityType.get(_storageEntity) == ENTITY_TYPE.STORAGE, "not storage");

    // Resolve network ?

    // Clear content of storage
    MaterialType.set(_storageEntity, MATERIAL_TYPE.NONE);
    Amount.set(_storageEntity, 0);
  }
}
