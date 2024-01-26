// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, StorageConnection, InletEntity, OutletEntity, Level } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibPod, LibEntity, LibStorage, LibNetwork, LibGoal } from "../libraries/Libraries.sol";

// Connect      X
// Disconnect   X
// Clear        X
// Ship         X
// Transfer

contract StorageSystem is System {
  function connectStorage(bytes32 _storageEntity, MACHINE_TYPE _machineType) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_storageEntity) == podEntity, "not in pod");
    require(EntityType.get(_storageEntity) == ENTITY_TYPE.STORAGE, "not storage");
    require(StorageConnection.get(_storageEntity) == bytes32(0), "storage already connected");
    require(_machineType == MACHINE_TYPE.INLET || _machineType == MACHINE_TYPE.OUTLET, "not inlet/outlet"); // Resolve network
    LibNetwork.resolve(playerEntity);

    bytes32 targetEntity = _machineType == MACHINE_TYPE.INLET
      ? InletEntity.get(podEntity)
      : OutletEntity.get(podEntity);

    require(StorageConnection.get(targetEntity) == bytes32(0), "target already connected");

    // Resolve network
    LibNetwork.resolve(playerEntity);

    // Connect on both sides
    StorageConnection.set(targetEntity, _storageEntity);
    StorageConnection.set(_storageEntity, targetEntity);
  }

  function disconnectStorage(MACHINE_TYPE _machineType) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(_machineType == MACHINE_TYPE.INLET || _machineType == MACHINE_TYPE.OUTLET, "not inlet/outlet");

    // Resolve network
    LibNetwork.resolve(playerEntity);

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
    // We can not clear the storage if it is connected
    require(StorageConnection.get(_storageEntity) == bytes32(0), "storage connected");

    // Clear content of storage
    MaterialType.set(_storageEntity, MATERIAL_TYPE.NONE);
    Amount.set(_storageEntity, 0);
  }

  function shipStorage(bytes32 _storageEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    require(CarriedBy.get(_storageEntity) == CarriedBy.get(playerEntity), "not in pod");
    // We can not ship the storage if it is connected
    require(StorageConnection.get(_storageEntity) == bytes32(0), "storage connected");

    // Get current goal
    bytes32 currentGoal = LibGoal.getGoal(Level.get(playerEntity));

    // Check goal
    require(
      MaterialType.get(_storageEntity) == MaterialType.get(currentGoal) &&
        Amount.get(_storageEntity) >= Amount.get(currentGoal),
      "goal not reached"
    );

    // Level up player entity
    Level.set(playerEntity, Level.get(playerEntity) + 1);

    MaterialType.set(_storageEntity, MATERIAL_TYPE.NONE);
    Amount.set(_storageEntity, 0);
  }
}